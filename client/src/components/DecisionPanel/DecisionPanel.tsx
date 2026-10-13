import { useState } from 'react';
import type { FC } from 'react';
import {
  Button,
  Field,
  MessageBar,
  MessageBarBody,
  Spinner,
  Textarea,
  Toast,
  ToastTitle,
  useToastController,
} from '@fluentui/react-components';
import { Checkmark20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { useDecideRequestMutation } from '../../features/requests/requestsApi';
import type { DecideRequestArgs } from '../../features/requests/requestsApi';
import type { ProjectRequest } from '../../types/models';
import { getApiErrorMessage } from '../../utils/apiError';
import { APP_TOASTER_ID } from '../../utils/toaster';
import styles from './DecisionPanel.module.css';

interface DecisionPanelProps {
  request: ProjectRequest;
}

const DecisionPanel: FC<DecisionPanelProps> = ({ request }) => {
  const [note, setNote] = useState('');
  const [pendingDecision, setPendingDecision] = useState<DecideRequestArgs['decision'] | null>(null);
  const [decide, { isLoading, error }] = useDecideRequestMutation();
  const { dispatchToast } = useToastController(APP_TOASTER_ID);

  const handleDecision = async (decision: DecideRequestArgs['decision']) => {
    setPendingDecision(decision);
    try {
      await decide({ id: request._id, decision, note: note.trim() }).unwrap();
      dispatchToast(
        <Toast>
          <ToastTitle>{decision === 'approved' ? 'הבקשה אושרה' : 'הבקשה נדחתה'}</ToastTitle>
        </Toast>,
        { intent: decision === 'approved' ? 'success' : 'info' },
      );
    } catch {
      // The error is shown from the mutation state.
    } finally {
      setPendingDecision(null);
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.pulse} />
        <h2 className={styles.title}>ממתינה להחלטה שלך</h2>
      </div>
      <p className={styles.text}>
        {request.requester?.name} ממחלקת {request.department} מבקש/ת לאשר את הפרויקט. אפשר להוסיף הערה שתישלח
        יחד עם ההחלטה.
      </p>

      <Field label="הערה למגיש/ה (אופציונלי)">
        <Textarea
          value={note}
          rows={3}
          resize="vertical"
          maxLength={1000}
          placeholder="לדוגמה: מאושר, יש לתאם מול צוות התשתיות"
          onChange={(_, data) => setNote(data.value)}
        />
      </Field>

      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
        </MessageBar>
      )}

      <div className={styles.actions}>
        <Button
          appearance="primary"
          size="large"
          className={styles.approve}
          disabled={isLoading}
          icon={pendingDecision === 'approved' ? <Spinner size="tiny" appearance="inverted" /> : <Checkmark20Regular />}
          onClick={() => void handleDecision('approved')}
        >
          אישור
        </Button>
        <Button
          appearance="secondary"
          size="large"
          className={styles.reject}
          disabled={isLoading}
          icon={pendingDecision === 'rejected' ? <Spinner size="tiny" /> : <Dismiss20Regular />}
          onClick={() => void handleDecision('rejected')}
        >
          דחייה
        </Button>
      </div>
    </section>
  );
};

export default DecisionPanel;
