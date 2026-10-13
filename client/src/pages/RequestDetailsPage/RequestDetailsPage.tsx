import type { FC, ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, Body1, MessageBar, MessageBarBody, Spinner } from '@fluentui/react-components';
import {
  ArrowRight16Regular,
  CalendarLtr20Regular,
  Clock12Filled,
  Money20Regular,
  Timer20Regular,
} from '@fluentui/react-icons';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import DecisionPanel from '../../components/DecisionPanel';
import ExecutionPanel from '../../components/ExecutionPanel';
import RequestTimeline from '../../components/RequestTimeline';
import NetworkPattern from '../../components/NetworkPattern';
import { useGetRequestQuery } from '../../features/requests/requestsApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import type { Person } from '../../types/models';
import { ROLE_LABELS } from '../../utils/labels';
import { formatCurrency, formatDate } from '../../utils/format';
import { getApiErrorMessage } from '../../utils/apiError';
import { isOverdue } from '../../utils/requests';
import styles from './RequestDetailsPage.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;

interface FactProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

const Fact: FC<FactProps> = ({ icon, label, value }) => (
  <div className={styles.fact}>
    <span className={styles.factIcon}>{icon}</span>
    <span className={styles.factText}>
      <span className={styles.factLabel}>{label}</span>
      <span className={styles.factValue}>{value}</span>
    </span>
  </div>
);

interface PersonRowProps {
  label: string;
  person?: Person | null;
}

const PersonRow: FC<PersonRowProps> = ({ label, person }) => (
  <div className={styles.person}>
    <span className={styles.personLabel}>{label}</span>
    {person ? (
      <span className={styles.personValue}>
        <Avatar name={person.name} color="colorful" size={32} />
        <span className={styles.personText}>
          <span className={styles.personName}>{person.name}</span>
          <span className={styles.personMeta}>
            {ROLE_LABELS[person.role]} · {person.department}
          </span>
        </span>
      </span>
    ) : (
      <span className={styles.personMeta}>לא הוגדר</span>
    )}
  </div>
);

const RequestDetailsPage: FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.auth.user);
  const { data: request, isLoading, error } = useGetRequestQuery(id, { skip: !id });

  const backLink = (
    <Link to={user?.role === 'manager' ? '/approvals' : '/requests'} className={styles.back}>
      <ArrowRight16Regular />
      חזרה לרשימה
    </Link>
  );

  if (isLoading) return <Spinner className={styles.state} label="טוען את פרטי הבקשה..." />;

  if (error || !request) {
    const forbidden = error && 'status' in error && error.status === 403;
    return (
      <div className={styles.stateBox}>
        {backLink}
        <MessageBar intent={forbidden ? 'warning' : 'error'}>
          <MessageBarBody>
            {forbidden ? 'אין לך הרשאה לצפות בבקשה הזו' : getApiErrorMessage(error, 'הבקשה לא נמצאה')}
          </MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  const durationDays = Math.round((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / DAY_MS);
  const canDecide = request.status === 'pending' && request.approverId === user?._id;
  const canManageExecution =
    user?.role === 'pmo' && (request.status === 'approved' || request.status === 'in-progress');

  return (
    <div className={styles.page}>
      {backLink}

      <section className={styles.hero}>
        <NetworkPattern className={styles.heroPattern} seed={request.title.length} nodes={34} width={900} height={260} linkDistance={120} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>בקשת פרויקט · מחלקת {request.department}</span>
          <h1 className={styles.title}>{request.title}</h1>
          <div className={styles.badges}>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
            {isOverdue(request) && (
              <span className={styles.overdue}>
                <Clock12Filled /> באיחור
              </span>
            )}
          </div>
        </div>
        <div className={styles.facts}>
          <Fact icon={<Money20Regular />} label="תקציב" value={formatCurrency(request.budget)} />
          <Fact
            icon={<CalendarLtr20Regular />}
            label="לוח זמנים"
            value={`${formatDate(request.startDate)} – ${formatDate(request.endDate)}`}
          />
          <Fact icon={<Timer20Regular />} label="משך" value={`${durationDays} ימים`} />
        </div>
      </section>

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>תיאור הפרויקט</h2>
            <Body1 className={styles.description}>{request.description || 'לא נוסף תיאור לבקשה.'}</Body1>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>אנשי קשר</h2>
            <div className={styles.people}>
              <PersonRow label="הוגשה על ידי" person={request.requester} />
              <PersonRow label="גורם מאשר" person={request.approver} />
            </div>
          </section>
        </div>

        <aside className={styles.side}>
          {canDecide && <DecisionPanel request={request} />}
          {canManageExecution && <ExecutionPanel request={request} />}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>מסלול הבקשה</h2>
            <RequestTimeline request={request} />
          </section>
        </aside>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
