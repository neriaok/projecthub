export type UserRole = 'employee' | 'manager' | 'pmo';

export const REQUEST_STATUSES = ['pending', 'approved', 'rejected', 'in-progress', 'completed'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const REQUEST_PRIORITIES = ['low', 'medium', 'high'] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  managerId: string | null;
}

export type Person = Pick<User, '_id' | 'name' | 'email' | 'role' | 'department'>;

export interface ProjectRequest {
  _id: string;
  title: string;
  description: string;
  department: string;
  requesterId: string;
  approverId: string | null;
  requester?: Person;
  approver?: Person | null;
  budget: number;
  startDate: string;
  endDate: string;
  priority: RequestPriority;
  status: RequestStatus;
  decisionNote: string;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };
