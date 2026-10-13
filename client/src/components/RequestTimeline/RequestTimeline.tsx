import type { FC } from 'react';
import type { FluentIcon } from '@fluentui/react-icons';
import {
  CheckmarkCircle16Filled,
  DismissCircle16Filled,
  DocumentAdd16Regular,
  Flag16Regular,
  PersonAvailable16Regular,
  Rocket16Regular,
} from '@fluentui/react-icons';
import type { ProjectRequest } from '../../types/models';
import { formatDate } from '../../utils/format';
import styles from './RequestTimeline.module.css';

interface RequestTimelineProps {
  request: ProjectRequest;
}

type StepState = 'done' | 'current' | 'upcoming' | 'rejected';

interface TimelineStep {
  key: string;
  title: string;
  detail?: string;
  note?: string;
  state: StepState;
  icon: FluentIcon;
}

function buildSteps(request: ProjectRequest): TimelineStep[] {
  const approverName = request.approver?.name ?? 'המנהל הישיר';
  const { status } = request;
  const decided = status !== 'pending';
  const steps: TimelineStep[] = [
    {
      key: 'submitted',
      title: 'הבקשה הוגשה',
      detail: `${request.requester?.name ?? ''} · ${formatDate(request.createdAt)}`,
      state: 'done',
      icon: DocumentAdd16Regular,
    },
  ];

  if (status === 'rejected') {
    steps.push({
      key: 'decision',
      title: `נדחתה על ידי ${approverName}`,
      detail: request.decidedAt ? formatDate(request.decidedAt) : undefined,
      note: request.decisionNote || undefined,
      state: 'rejected',
      icon: DismissCircle16Filled,
    });
    return steps;
  }

  steps.push({
    key: 'decision',
    title: decided ? `אושרה על ידי ${approverName}` : `ממתינה להחלטת ${approverName}`,
    detail: decided && request.decidedAt ? formatDate(request.decidedAt) : undefined,
    note: decided ? request.decisionNote || undefined : undefined,
    state: decided ? 'done' : 'current',
    icon: decided ? CheckmarkCircle16Filled : PersonAvailable16Regular,
  });

  steps.push({
    key: 'execution',
    title: 'בביצוע',
    detail: status === 'in-progress' ? `עודכן ${formatDate(request.updatedAt)}` : undefined,
    state: status === 'in-progress' ? 'current' : status === 'completed' ? 'done' : 'upcoming',
    icon: Rocket16Regular,
  });

  steps.push({
    key: 'completed',
    title: 'הושלם',
    detail: status === 'completed' ? formatDate(request.updatedAt) : undefined,
    state: status === 'completed' ? 'done' : 'upcoming',
    icon: Flag16Regular,
  });

  return steps;
}

const RequestTimeline: FC<RequestTimelineProps> = ({ request }) => (
  <ol className={styles.timeline}>
    {buildSteps(request).map(({ key, title, detail, note, state, icon: Icon }) => (
      <li key={key} className={`${styles.step} ${styles[state]}`}>
        <span className={styles.marker}>
          <Icon />
        </span>
        <div className={styles.body}>
          <span className={styles.title}>{title}</span>
          {detail && <span className={styles.detail}>{detail}</span>}
          {note && <blockquote className={styles.note}>{note}</blockquote>}
        </div>
      </li>
    ))}
  </ol>
);

export default RequestTimeline;
