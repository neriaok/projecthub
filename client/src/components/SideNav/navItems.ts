import type { FluentIcon } from '@fluentui/react-icons';
import {
  AddCircle20Regular,
  ClipboardTaskListLtr20Regular,
  DataPie20Regular,
  DocumentBulletList20Regular,
  TaskListSquareLtr20Regular,
} from '@fluentui/react-icons';
import type { UserRole } from '../../types/models';

export interface NavItem {
  to: string;
  label: string;
  icon: FluentIcon;
  end?: boolean;
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  employee: [
    { to: '/requests', label: 'הבקשות שלי', icon: DocumentBulletList20Regular, end: true },
    { to: '/requests/new', label: 'בקשה חדשה', icon: AddCircle20Regular },
  ],
  manager: [
    { to: '/approvals', label: 'בקשות לאישור', icon: TaskListSquareLtr20Regular },
    { to: '/requests', label: 'הבקשות שלי', icon: DocumentBulletList20Regular, end: true },
    { to: '/requests/new', label: 'בקשה חדשה', icon: AddCircle20Regular },
  ],
  pmo: [
    { to: '/dashboard', label: 'דשבורד', icon: DataPie20Regular },
    { to: '/requests', label: 'כל הבקשות', icon: ClipboardTaskListLtr20Regular, end: true },
  ],
};
