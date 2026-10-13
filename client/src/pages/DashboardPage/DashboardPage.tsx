import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Caption1, MessageBar, MessageBarBody, Spinner } from '@fluentui/react-components';
import {
  ArrowLeft16Regular,
  ClockAlarm24Regular,
  HourglassHalf24Regular,
  RocketRegular,
} from '@fluentui/react-icons';
import PageHeader from '../../components/PageHeader';
import StatTile from '../../components/StatTile';
import BudgetChart from '../../components/BudgetChart';
import StatusDonut from '../../components/StatusDonut';
import OverdueTable from '../../components/OverdueTable';
import { useGetDashboardSummaryQuery } from '../../features/dashboard/dashboardApi';
import { formatCompactCurrency } from '../../utils/format';
import { getApiErrorMessage } from '../../utils/apiError';
import styles from './DashboardPage.module.css';

interface PanelProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

const Panel: FC<PanelProps> = ({ title, subtitle, className, children }) => (
  <section className={`${styles.panel} ${className ?? ''}`}>
    <header className={styles.panelHeader}>
      <h2 className={styles.panelTitle}>{title}</h2>
      {subtitle && <Caption1 className={styles.panelSubtitle}>{subtitle}</Caption1>}
    </header>
    {children}
  </section>
);

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetDashboardSummaryQuery();

  const header = (
    <PageHeader
      eyebrow="תמונת מצב ארגונית"
      title="דשבורד PMO"
      subtitle="סטטוס הבקשות, תקציבים לפי מחלקה ופרויקטים שחרגו מלוח הזמנים"
      actions={
        <Button appearance="secondary" icon={<ArrowLeft16Regular />} iconPosition="after" onClick={() => navigate('/requests')}>
          לכל הבקשות
        </Button>
      }
    />
  );

  if (isLoading) {
    return (
      <>
        {header}
        <Spinner className={styles.state} label="טוען את תמונת המצב..." />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        {header}
        <MessageBar intent="error">
          <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
        </MessageBar>
      </>
    );
  }

  const { countsByStatus, totals, overdue, budgetByDepartment } = data;
  const active = countsByStatus.approved + countsByStatus['in-progress'];

  return (
    <>
      {header}

      <div className={styles.stats}>
        <StatTile
          label="ממתינות לאישור"
          value={countsByStatus.pending}
          caption={`${formatCompactCurrency(totals.pendingBudget)} בתקציב שממתין להחלטה`}
          icon={<HourglassHalf24Regular />}
        />
        <StatTile
          label="מאושרות ובביצוע"
          value={active}
          caption={`${countsByStatus['in-progress']} בביצוע · ${countsByStatus.approved} ממתינות להתחלה`}
          icon={<RocketRegular />}
          tone="positive"
        />
        <StatTile
          label="באיחור"
          value={overdue.length}
          caption={overdue.length ? 'פרויקטים שעברו את תאריך היעד' : 'אין פרויקטים באיחור'}
          icon={<ClockAlarm24Regular />}
          tone={overdue.length ? 'alert' : 'brand'}
        />
      </div>

      <div className={styles.charts}>
        <Panel
          title="תקציב לפי מחלקה"
          subtitle={`${formatCompactCurrency(totals.approvedBudget)} מאושר · ${formatCompactCurrency(totals.pendingBudget)} ממתין`}
        >
          <BudgetChart data={budgetByDepartment} />
        </Panel>
        <Panel title="בקשות לפי סטטוס" subtitle={`${totals.requests} בקשות בתיק`}>
          <StatusDonut counts={countsByStatus} />
        </Panel>
      </div>

      <Panel
        title="פרויקטים באיחור"
        subtitle="פרויקטים מאושרים או בביצוע שתאריך היעד שלהם עבר"
        className={styles.overduePanel}
      >
        <OverdueTable projects={overdue} />
      </Panel>
    </>
  );
};

export default DashboardPage;
