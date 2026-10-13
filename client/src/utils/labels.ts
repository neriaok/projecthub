import type { RequestPriority, RequestStatus, UserRole } from '../types/models';

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'ממתינה לאישור',
  approved: 'מאושרת',
  rejected: 'נדחתה',
  'in-progress': 'בביצוע',
  completed: 'הושלמה',
};

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  employee: 'עובד',
  manager: 'מנהל מחלקה',
  pmo: 'PMO',
};
