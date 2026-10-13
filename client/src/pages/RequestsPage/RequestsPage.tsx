import { useMemo, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Body1,
  Button,
  Caption1,
  Card,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Field,
  MessageBar,
  MessageBarBody,
  Select,
  Spinner,
  TableCellLayout,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition, TableColumnSizingOptions } from '@fluentui/react-components';
import { Add20Regular, DocumentSearch24Regular } from '@fluentui/react-icons';
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
import styles from './RequestsPage.module.css';

export type RequestsView = 'mine' | 'approvals' | 'all';

interface RequestsPageProps {
  view: RequestsView;
}

const VIEW_COPY: Record<RequestsView, { title: string; subtitle: string; empty: string }> = {
  mine: {
    title: 'הבקשות שלי',
    subtitle: 'בקשות הפרויקט שהגשת ומצבן העדכני',
    empty: 'עדיין לא הגשת בקשות פרויקט',
  },
  approvals: {
    title: 'בקשות לאישור',
    subtitle: 'בקשות של עובדי המחלקה שממתינות להחלטה שלך',
    empty: 'אין בקשות שממתינות לאישורך',
  },
  all: {
    title: 'כל הבקשות',
    subtitle: 'תיק הבקשות של כל המחלקות בארגון',
    empty: 'אין בקשות בארגון',
  },
};

const COLUMN_SIZING: TableColumnSizingOptions = {
  title: { idealWidth: 280, minWidth: 200 },
  requester: { idealWidth: 130, minWidth: 110 },
  department: { idealWidth: 130, minWidth: 110 },
  budget: { idealWidth: 110, minWidth: 100 },
  dates: { idealWidth: 200, minWidth: 190 },
  priority: { idealWidth: 90, minWidth: 80 },
  status: { idealWidth: 130, minWidth: 120 },
};

const compareText = (a: string, b: string) => a.localeCompare(b, 'he');

const RequestsPage: FC<RequestsPageProps> = ({ view }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [status, setStatus] = useState<RequestStatus | ''>(view === 'approvals' ? 'pending' : '');
  const { data, isLoading, isFetching, error } = useGetRequestsQuery(status || undefined);

  const requests = useMemo(() => {
    if (!data || !user) return [];
    if (view === 'mine') return data.filter((request) => request.requesterId === user._id);
    if (view === 'approvals') return data.filter((request) => request.approverId === user._id);
    return data;
  }, [data, user, view]);

  const columns = useMemo<TableColumnDefinition<ProjectRequest>[]>(() => {
    const list: TableColumnDefinition<ProjectRequest>[] = [
      createTableColumn<ProjectRequest>({
        columnId: 'title',
        compare: (a, b) => compareText(a.title, b.title),
        renderHeaderCell: () => 'שם הפרויקט',
        renderCell: (item) => (
          <TableCellLayout truncate className={styles.titleCell}>
            {item.title}
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
          renderCell: (item) => <TableCellLayout truncate>{item.requester?.name}</TableCellLayout>,
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
        renderCell: (item) => <span className={styles.number}>{formatCurrency(item.budget)}</span>,
      }),
      createTableColumn<ProjectRequest>({
        columnId: 'dates',
        compare: (a, b) => a.startDate.localeCompare(b.startDate),
        renderHeaderCell: () => 'תאריכים',
        renderCell: (item) => (
          <span className={styles.number}>
            {formatDate(item.startDate)} – {formatDate(item.endDate)}
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

  return (
    <>
      <PageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        actions={
          canCreate && (
            <Button appearance="primary" icon={<Add20Regular />} onClick={() => navigate('/requests/new')}>
              בקשה חדשה
            </Button>
          )
        }
      />

      <Card className={styles.card}>
        <div className={styles.toolbar}>
          <Field label="סטטוס" orientation="horizontal" className={styles.filter}>
            <Select value={status} onChange={(_, selected) => setStatus(selected.value as RequestStatus | '')}>
              <option value="">כל הסטטוסים</option>
              {REQUEST_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </Select>
          </Field>
          <Caption1 className={styles.count}>
            {isFetching && !isLoading ? <Spinner size="extra-tiny" /> : `${requests.length} בקשות`}
          </Caption1>
        </div>

        {error ? (
          <MessageBar intent="error">
            <MessageBarBody>{getApiErrorMessage(error)}</MessageBarBody>
          </MessageBar>
        ) : isLoading ? (
          <Spinner className={styles.state} label="טוען בקשות..." />
        ) : requests.length === 0 ? (
          <div className={styles.state}>
            <DocumentSearch24Regular className={styles.emptyIcon} />
            <Body1>{status ? `אין בקשות בסטטוס "${STATUS_LABELS[status]}"` : copy.empty}</Body1>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <DataGrid
              items={requests}
              columns={columns}
              sortable
              resizableColumns
              columnSizingOptions={COLUMN_SIZING}
              getRowId={(item: ProjectRequest) => item._id}
              className={styles.grid}
            >
              <DataGridHeader>
                <DataGridRow>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<ProjectRequest>>
                {({ item, rowId }) => (
                  <DataGridRow<ProjectRequest> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        )}
      </Card>
    </>
  );
};

export default RequestsPage;
