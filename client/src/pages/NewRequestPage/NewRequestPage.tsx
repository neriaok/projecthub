import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
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
import type { FluentIcon } from '@fluentui/react-icons';
import { DataTrending20Regular, PersonAvailable20Regular, Send20Regular } from '@fluentui/react-icons';
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

const NEXT_STEPS: { icon: FluentIcon; title: string; text: string }[] = [
  { icon: Send20Regular, title: 'הגשה', text: 'הבקשה נשמרת ומנותבת אוטומטית למנהל הישיר שלך.' },
  { icon: PersonAvailable20Regular, title: 'החלטת מנהל', text: 'המנהל מקבל התראה, ומאשר או דוחה את הבקשה עם הערה.' },
  { icon: DataTrending20Regular, title: 'מעקב PMO', text: 'בקשה מאושרת עוברת למעקב ביצוע ונכנסת לתמונת המצב הארגונית.' },
];

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
        eyebrow="בקשה חדשה"
        title="בקשת פרויקט חדשה"
        subtitle={`הבקשה תישלח לאישור המנהל הישיר שלך · מחלקת ${user?.department ?? ''}`}
      />

      <div className={styles.layout}>
        <section className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>פרטי הפרויקט</h2>
              <Field label="שם הפרויקט" required validationMessage={errors.title}>
                <Input
                  size="large"
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
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>תקציב ולוח זמנים</h2>
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
                  className={styles.priority}
                  onChange={(_, data) => updateField('priority', data.value as RequestPriority)}
                >
                  {REQUEST_PRIORITIES.map((priority) => (
                    <Radio key={priority} value={priority} label={PRIORITY_LABELS[priority]} />
                  ))}
                </RadioGroup>
              </Field>
            </div>

            {error && (
              <MessageBar intent="error">
                <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
              </MessageBar>
            )}

            <div className={styles.actions}>
              <Button
                type="submit"
                appearance="primary"
                size="large"
                className={styles.submit}
                disabled={isLoading}
                icon={isLoading ? <Spinner size="tiny" appearance="inverted" /> : <Send20Regular className={styles.flipIcon} />}
              >
                הגשת בקשה
              </Button>
              <Button appearance="subtle" size="large" disabled={isLoading} onClick={() => navigate('/requests')}>
                ביטול
              </Button>
            </div>
          </form>
        </section>

        <aside className={styles.aside}>
          <h2 className={styles.asideTitle}>מה קורה אחרי ההגשה?</h2>
          <ol className={styles.steps}>
            {NEXT_STEPS.map(({ icon: Icon, title, text }) => (
              <li key={title} className={styles.step}>
                <span className={styles.stepIcon}>
                  <Icon />
                </span>
                <span className={styles.stepText}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
};

export default NewRequestPage;
