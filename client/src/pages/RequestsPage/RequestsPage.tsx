import { useMemo, useState } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Body1,
  Button,
  Caption1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  MessageBar,
  MessageBarBody,
  Spinner,
  Tab,
  TabList,
  TableCellLayout,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableColumnId } from '@fluentui/react-components';
import { Add20Regular, Clock12Filled, DocumentSearch24Regular } from '@fluentui/react-icons';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import { useGetRequestsQuery } from '../../features/requests/requestsApi';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { REQUEST_STATUSES } from '../../types/models';
import type { ProjectRequest, RequestStatus } from '../../types/models';
import { STATUS_LABELS } from '../../utils/labels';
import { formatCurrency, formatDate } from '../../utils/format';
import { getApiErrorMessage } from '../../utils/apiError';
import { isOverdue } from '../../utils/requests';
import styles from './RequestsPage.module.css';

export type RequestsView = 'mine' | 'approvals' | 'all';

interface RequestsPageProps {
  view: RequestsView;
}

type StatusFilter = RequestStatus | 'all';

const VIEW_COPY: Record<RequestsView, { eyebrow: string; title: string; subtitle: string; empty: string }> = {
  mine: {
    eyebrow: 'סביבת העבודה שלי',
    title: 'הבקשות שלי',
    subtitle: 'בקשות הפרויקט שהגשת ומצבן העדכני',
    empty: 'עדיין לא הגשת בקשות פרויקט',
  },
  approvals: {
    eyebrow: 'ניהול מחלקה',
    title: 'בקשות לאישור',
    subtitle: 'בקשות של עובדי המחלקה שממתינות להחלטה שלך',
    empty: 'אין בקשות שממתינות לאישורך',
  },
  all: {
    eyebrow: 'תיק הפרויקטים',
    title: 'כל הבקשות',
    subtitle: 'בקשות הפרויקט של כל המחלקות בארגון',
    empty: 'אין בקשות בארגון',
  },
};

/** Proportional column widths, so the grid stays fluid instead of scrolling sideways. */
const COLUMN_CLASS: Record<string, string> = {
  title: styles.colTitle,
  requester: styles.colRequester,
  department: styles.colDepartment,
  budget: styles.colBudget,
  dates: styles.colDates,
  priority: styles.colPriority,
  status: styles.colStatus,
};

const columnClass = (columnId: TableColumnId) => COLUMN_CLASS[String(columnId)];

const compareText = (a: string, b: string) => a.localeCompare(b, 'he');

const RequestsPage: FC<RequestsPageProps> = ({ view }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(view === 'approvals' ? 'pending' : 'all');
  const { data, isLoading, error } = useGetRequestsQuery(undefined);

  const scoped = useMemo(() => {
    if (!data || !user) return [];
    if (view === 'mine') return data.filter((request) => request.requesterId === user._id);
    if (view === 'approvals') return data.filter((request) => request.approverId === user._id);
    return data;
  }, [data, user, view]);

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = {
      all: scoped.length,
      pending: 0,
      approved: 0,
      rejected: 0,
      'in-progress': 0,
      completed: 0,
    };
    scoped.forEach((request) => {
      result[request.status] += 1;
    });
    return result;
  }, [scoped]);

  const requests = useMemo(
    () => (statusFilter === 'all' ? scoped : scoped.filter((request) => request.status === statusFilter)),
    [scoped, statusFilter],
  );

  const columns = useMemo<TableColumnDefinition<ProjectRequest>[]>(() => {
    const list: TableColumnDefinition<ProjectRequest>[] = [
      createTableColumn<ProjectRequest>({
        columnId: 'title',
        compare: (a, b) => compareText(a.title, b.title),
        renderHeaderCell: () => 'שם הפרויקט',
        renderCell: (item) => (
          <TableCellLayout truncate description={`הוגשה ${formatDate(item.createdAt)}`}>
            <Link to={`/requests/${item._id}`} className={styles.title} onClick={(event) => event.stopPropagation()}>
              {item.title}
            </Link>
          </TableCellLayout>
        ),
      }),
    ];
    if (view !== 'mine') {
      list.push(
        createTableColumn<ProjectRequest>({
          columnId: 'requester',
          compare: (a, b) => compareText(a.requester?.name ?? '', b.requester?.name ?? ''),
          renderHeaderCell: () => 'מגיש/ה',
          renderCell: (item) => (
            <TableCellLayout truncate media={<Avatar name={item.requester?.name} color="colorful" size={24} />}>
              {item.requester?.name}
            </TableCellLayout>
          ),
        }),
      );
    }
    list.push(
      createTableColumn<ProjectRequest>({
        columnId: 'department',
        compare: (a, b) => compareText(a.department, b.department),
        renderHeaderCell: () => 'מחלקה',
        renderCell: (item) => <TableCellLayout truncate>{item.department}</TableCellLayout>,
      }),
      createTableColumn<ProjectRequest>({
        columnId: 'budget',
        compare: (a, b) => a.budget - b.budget,
        renderHeaderCell: () => 'תקציב',
        renderCell: (item) => <span className={styles.budget}>{formatCurrency(item.budget)}</span>,
      }),
      createTableColumn<ProjectRequest>({
        columnId: 'dates',
        compare: (a, b) => a.endDate.localeCompare(b.endDate),
        renderHeaderCell: () => 'לוח זמנים',
        renderCell: (item) => (
          <span className={styles.dates}>
            <span className={styles.number}>
              {formatDate(item.startDate)} – {formatDate(item.endDate)}
            </span>
            {isOverdue(item) && (
              <span className={styles.overdue}>
                <Clock12Filled /> באיחור
              </span>
            )}
          </span>
        ),
      }),
      createTableColumn<ProjectRequest>({
        columnId: 'priority',
        compare: (a, b) => a.priority.localeCompare(b.priority),
        renderHeaderCell: () => 'עדיפות',
        renderCell: (item) => <PriorityBadge priority={item.priority} />,
      }),
      createTableColumn<ProjectRequest>({
        columnId: 'status',
        compare: (a, b) => a.status.localeCompare(b.status),
        renderHeaderCell: () => 'סטטוס',
        renderCell: (item) => <StatusBadge status={item.status} />,
      }),
    );
    return list;
  }, [view]);

  const copy = VIEW_COPY[view];
  const canCreate = user?.role !== 'pmo';
  const tabs: StatusFilter[] = ['all', ...REQUEST_STATUSES];

  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          canCreate && (
            <Button
              appearance="primary"
              size="large"
              icon={<Add20Regular />}
              className={styles.cta}
              onClick={() => navigate('/requests/new')}
            >
              בקשה חדשה
            </Button>
          )
        }
      />

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <TabList
            selectedValue={statusFilter}
            onTabSelect={(_, tab) => setStatusFilter(tab.value as StatusFilter)}
            aria-label="סינון לפי סטטוס"
          >
            {tabs.map((tab) => (
              <Tab key={tab} value={tab}>
                <span className={styles.tabLabel}>
                  {tab === 'all' ? 'הכל' : STATUS_LABELS[tab]}
                  <span className={statusFilter === tab ? `${styles.count} ${styles.countActive}` : styles.count}>
                    {counts[tab]}
                  </span>
                </span>
              </Tab>
            ))}
          </TabList>
        </div>

        {error ? (
          <div className={styles.state}>
            <MessageBar intent="error">
              <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
            </MessageBar>
          </div>
        ) : isLoading ? (
          <Spinner className={styles.state} label="טוען בקשות..." />
        ) : requests.length === 0 ? (
          <div className={styles.state}>
            <span className={styles.emptyIcon}>
              <DocumentSearch24Regular />
            </span>
            <Body1 className={styles.emptyText}>
              {statusFilter === 'all' ? copy.empty : `אין בקשות בסטטוס "${STATUS_LABELS[statusFilter]}"`}
            </Body1>
            {canCreate && statusFilter === 'all' && view === 'mine' && (
              <Button appearance="primary" icon={<Add20Regular />} onClick={() => navigate('/requests/new')}>
                להגשת בקשה ראשונה
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <DataGrid
                items={requests}
                columns={columns}
                sortable
                getRowId={(item: ProjectRequest) => item._id}
                className={styles.grid}
              >
                <DataGridHeader className={styles.gridHeader}>
                  <DataGridRow>
                    {({ renderHeaderCell, columnId }) => (
                      <DataGridHeaderCell className={columnClass(columnId)}>{renderHeaderCell()}</DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<ProjectRequest>>
                  {({ item, rowId }) => (
                    <DataGridRow<ProjectRequest>
                      key={rowId}
                      className={styles.row}
                      onClick={() => navigate(`/requests/${item._id}`)}
                    >
                      {({ renderCell, columnId }) => (
                        <DataGridCell className={columnClass(columnId)}>{renderCell(item)}</DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            </div>
            <Caption1 className={styles.footer}>
              מוצגות {requests.length} מתוך {scoped.length} בקשות
            </Caption1>
          </>
        )}
      </section>
    </>
  );
};

export default RequestsPage;
