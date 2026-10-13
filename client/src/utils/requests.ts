import type { ProjectRequest } from '../types/models';

/** A project is overdue when its end date has passed while it is still approved or in progress. */
export function isOverdue(request: Pick<ProjectRequest, 'endDate' | 'status'>, now = new Date()): boolean {
  return (
    (request.status === 'approved' || request.status === 'in-progress') && new Date(request.endDate) < now
  );
}
