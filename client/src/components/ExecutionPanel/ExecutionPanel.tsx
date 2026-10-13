import type { FC } from 'react';
import {
  Button,
  MessageBar,
  MessageBarBody,
  Spinner,
  Toast,
  ToastTitle,
  useToastController,
} from '@fluentui/react-components';
import { CheckmarkCircle20Regular, Play20Regular } from '@fluentui/react-icons';
import { useUpdateRequestStatusMutation } from '../../features/requests/requestsApi';
import type { UpdateStatusArgs } from '../../features/requests/requestsApi';
import type { ProjectRequest } from '../../types/models';
import { getApiErrorMessage } from '../../utils/apiError';
import { APP_TOASTER_ID } from '../../utils/toaster';
import styles from './ExecutionPanel.module.css';

interface ExecutionPanelProps {
  request: ProjectRequest;
}

const NEXT_STEP: Partial<
  Record<ProjectRequest['status'], { status: UpdateStatusArgs['status']; title: string; text: string; action: string; done: string }>
> = {
  approved: {
    status: 'in-progress',
    title: 'מוכן להתחלת ביצוע',
    text: 'הפרויקט אושר על ידי המנהל. סמנו אותו כ"בביצוע" כשהעבודה מתחילה.',
    action: 'התחלת ביצוע',
    done: 'הפרויקט עבר לביצוע',
  },
  'in-progress': {
    status: 'completed',
    title: 'הפרויקט בביצוע',
    text: 'כשכל התוצרים נמסרו, סמנו את הפרויקט כהושלם כדי לסגור אותו בתיק הפרויקטים.',
    action: 'סימון כהושלם',
    done: 'הפרויקט סומן כהושלם',
  },
};

/** PMO controls for moving an approved project through execution. */
const ExecutionPanel: FC<ExecutionPanelProps> = ({ request }) => {
  const [updateStatus, { isLoading, error }] = useUpdateRequestStatusMutation();
  const { dispatchToast } = useToastController(APP_TOASTER_ID);
  const step = NEXT_STEP[request.status];

  if (!step) return null;

  const handleClick = async () => {
    try {
      await updateStatus({ id: request._id, status: step.status }).unwrap();
      dispatchToast(
        <Toast>
          <ToastTitle>{step.done}</ToastTitle>
        </Toast>,
        { intent: 'success' },
      );
    } catch {
      // The error is shown from the mutation state.
    }
  };

  return (
    <section className={styles.panel}>
      <span className={styles.eyebrow}>ניהול ביצוע · PMO</span>
      <h2 className={styles.title}>{step.title}</h2>
      <p className={styles.text}>{step.text}</p>

      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
        </MessageBar>
      )}

      <Button
        appearance="primary"
        size="large"
        className={styles.button}
        disabled={isLoading}
        icon={
          isLoading ? (
            <Spinner size="tiny" appearance="inverted" />
          ) : step.status === 'in-progress' ? (
            <Play20Regular className={styles.flipIcon} />
          ) : (
            <CheckmarkCircle20Regular />
          )
        }
        onClick={() => void handleClick()}
      >
        {step.action}
      </Button>
    </section>
  );
};

export default ExecutionPanel;
