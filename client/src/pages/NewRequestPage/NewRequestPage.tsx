import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Radio,
  RadioGroup,
  Spinner,
  Textarea,
  Toast,
  ToastBody,
  ToastTitle,
  useToastController,
} from '@fluentui/react-components';
import PageHeader from '../../components/PageHeader';
import { useCreateRequestMutation } from '../../features/requests/requestsApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { REQUEST_PRIORITIES } from '../../types/models';
import type { RequestPriority } from '../../types/models';
import { PRIORITY_LABELS } from '../../utils/labels';
import { getApiErrorMessage } from '../../utils/apiError';
import { APP_TOASTER_ID } from '../../utils/toaster';
import styles from './NewRequestPage.module.css';

interface FormValues {
  title: string;
  description: string;
  budget: string;
  startDate: string;
  endDate: string;
  priority: RequestPriority;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  title: '',
  description: '',
  budget: '',
  startDate: '',
  endDate: '',
  priority: 'medium',
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) errors.title = 'יש להזין שם לפרויקט';
  const budget = Number(values.budget);
  if (!values.budget || !Number.isFinite(budget) || budget <= 0) errors.budget = 'התקציב חייב להיות גדול מ-0';
  if (!values.startDate) errors.startDate = 'יש לבחור תאריך התחלה';
  if (!values.endDate) errors.endDate = 'יש לבחור תאריך סיום';
  else if (values.startDate && values.endDate <= values.startDate) {
    errors.endDate = 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה';
  }
  return errors;
}

const NewRequestPage: FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { dispatchToast } = useToastController(APP_TOASTER_ID);
  const [createRequest, { isLoading, error }] = useCreateRequestMutation();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const created = await createRequest({
        title: values.title.trim(),
        description: values.description.trim(),
        budget: Number(values.budget),
        startDate: values.startDate,
        endDate: values.endDate,
        priority: values.priority,
      }).unwrap();

      dispatchToast(
        <Toast>
          <ToastTitle>הבקשה הוגשה בהצלחה</ToastTitle>
          <ToastBody>"{created.title}" נשלחה לאישור {created.approver?.name ?? 'המנהל הישיר'}</ToastBody>
        </Toast>,
        { intent: 'success' },
      );
      navigate('/requests');
    } catch {
      // The error is shown from the mutation state.
    }
  };

  return (
    <>
      <PageHeader
        title="בקשת פרויקט חדשה"
        subtitle={`הבקשה תישלח לאישור המנהל הישיר שלך · מחלקת ${user?.department ?? ''}`}
      />

      <Card className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Field label="שם הפרויקט" required validationMessage={errors.title}>
            <Input
              value={values.title}
              maxLength={200}
              placeholder="לדוגמה: הטמעת מערכת לניהול פניות"
              onChange={(_, data) => updateField('title', data.value)}
            />
          </Field>

          <Field label="תיאור" hint="מטרות הפרויקט, היקף ותועלת צפויה">
            <Textarea
              value={values.description}
              rows={4}
              resize="vertical"
              maxLength={4000}
              onChange={(_, data) => updateField('description', data.value)}
            />
          </Field>

          <div className={styles.row}>
            <Field label="תקציב משוער" required validationMessage={errors.budget}>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                contentBefore="₪"
                value={values.budget}
                onChange={(_, data) => updateField('budget', data.value)}
              />
            </Field>
            <Field label="תאריך התחלה" required validationMessage={errors.startDate}>
              <Input
                type="date"
                value={values.startDate}
                onChange={(_, data) => updateField('startDate', data.value)}
              />
            </Field>
            <Field label="תאריך סיום" required validationMessage={errors.endDate}>
              <Input
                type="date"
                min={values.startDate || undefined}
                value={values.endDate}
                onChange={(_, data) => updateField('endDate', data.value)}
              />
            </Field>
          </div>

          <Field label="עדיפות">
            <RadioGroup
              layout="horizontal"
              value={values.priority}
              onChange={(_, data) => updateField('priority', data.value as RequestPriority)}
            >
              {REQUEST_PRIORITIES.map((priority) => (
                <Radio key={priority} value={priority} label={PRIORITY_LABELS[priority]} />
              ))}
            </RadioGroup>
          </Field>

          {error && (
            <MessageBar intent="error">
              <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
            </MessageBar>
          )}

          <div className={styles.actions}>
            <Button
              type="submit"
              appearance="primary"
              disabled={isLoading}
              icon={isLoading ? <Spinner size="tiny" /> : undefined}
            >
              הגשת בקשה
            </Button>
            <Button appearance="secondary" disabled={isLoading} onClick={() => navigate('/requests')}>
              ביטול
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default NewRequestPage;
