import { QueryFilter } from 'mongoose';
import { IUser } from '../models/User';
import { IProjectRequest } from '../models/ProjectRequest';

/** Requests a user may see: PMO sees all, managers see their own and those awaiting their decision. */
export function visibleRequestsFilter(user: IUser): QueryFilter<IProjectRequest> {
  if (user.role === 'pmo') return {};
  if (user.role === 'manager') {
    return { $or: [{ requesterId: user._id }, { approverId: user._id }] };
  }
  return { requesterId: user._id };
}

export function canViewRequest(user: IUser, request: IProjectRequest): boolean {
  if (user.role === 'pmo') return true;
  return request.requesterId.equals(user._id) || (request.approverId?.equals(user._id) ?? false);
}
