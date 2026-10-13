import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@fluentui/react-components';
import { CheckmarkCircle24Regular, Clock12Filled } from '@fluentui/react-icons';
import StatusBadge from '../StatusBadge';
import type { OverdueProject } from '../../features/dashboard/dashboardApi';
import { formatCurrency, formatDate } from '../../utils/format';
import styles from './OverdueTable.module.css';

interface OverdueTableProps {
  projects: OverdueProject[];
}

const OverdueTable: FC<OverdueTableProps> = ({ projects }) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className={styles.empty}>
        <CheckmarkCircle24Regular className={styles.emptyIcon} />
        כל הפרויקטים הפעילים עומדים בלוחות הזמנים
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Table className={styles.table} aria-label="פרויקטים באיחור">
        <TableHeader>
          <TableRow>
            <TableHeaderCell className={styles.colTitle}>פרויקט</TableHeaderCell>
            <TableHeaderCell>מגיש/ה</TableHeaderCell>
            <TableHeaderCell>תקציב</TableHeaderCell>
            <TableHeaderCell>תאריך יעד</TableHeaderCell>
            <TableHeaderCell>איחור</TableHeaderCell>
            <TableHeaderCell>סטטוס</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project._id} className={styles.row} onClick={() => navigate(`/requests/${project._id}`)}>
              <TableCell className={styles.colTitle}>
                <TableCellLayout truncate description={project.department}>
                  <Link
                    to={`/requests/${project._id}`}
                    className={styles.title}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {project.title}
                  </Link>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout truncate media={<Avatar name={project.requester?.name} color="colorful" size={24} />}>
                  {project.requester?.name}
                </TableCellLayout>
              </TableCell>
              <TableCell className={styles.number}>{formatCurrency(project.budget)}</TableCell>
              <TableCell className={styles.number}>{formatDate(project.endDate)}</TableCell>
              <TableCell>
                <span className={styles.overdue}>
                  <Clock12Filled /> {project.daysOverdue} ימים
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={project.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OverdueTable;
