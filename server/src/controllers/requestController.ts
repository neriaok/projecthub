import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import ApiError from '../utils/ApiError';
import { ApiResponse } from '../types/ApiResponse';
import ProjectRequest, {
  IProjectRequest,
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  RequestPriority,
  RequestStatus,
} from '../models/ProjectRequest';
import { getAuthUser } from '../middleware/requireAuth';
import { canViewRequest, visibleRequestsFilter } from '../utils/requestAccess';

const PERSON_FIELDS = 'name email department role';

interface CreateProjectRequestBody {
  title?: unknown;
  description?: unknown;
  budget?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  priority?: unknown;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value);
}

export async function listProjectRequests(req: Request, res: Response<ApiResponse<IProjectRequest[]>>) {
  const user = getAuthUser(req);
  const { status } = req.query;
  if (status !== undefined && !isOneOf(REQUEST_STATUSES, status)) {
    throw new ApiError(400, `status must be one of: ${REQUEST_STATUSES.join(', ')}`);
  }

  const filter = visibleRequestsFilter(user);
  const requests = await ProjectRequest.find(status ? { ...filter, status: status as RequestStatus } : filter)
    .sort({ createdAt: -1 })
    .populate('requester', PERSON_FIELDS)
    .populate('approver', PERSON_FIELDS);

  res.status(200).json({ success: true, data: requests });
}

export async function createProjectRequest(
  req: Request<{}, {}, CreateProjectRequestBody>,
  res: Response<ApiResponse<IProjectRequest>>,
) {
  const user = getAuthUser(req);
  const { title, description, budget, startDate, endDate, priority } = req.body ?? {};

  if (typeof title !== 'string' || !title.trim()) throw new ApiError(400, 'Title is required');
  if (title.trim().length > 200) throw new ApiError(400, 'Title must be at most 200 characters');
  if (description !== undefined && typeof description !== 'string') {
    throw new ApiError(400, 'Description must be a string');
  }
  if (typeof budget !== 'number' || !Number.isFinite(budget) || budget <= 0) {
    throw new ApiError(400, 'Budget must be a number greater than 0');
  }
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) throw new ApiError(400, 'Valid start and end dates are required');
  if (end <= start) throw new ApiError(400, 'End date must be after start date');
  if (priority !== undefined && !isOneOf(REQUEST_PRIORITIES, priority)) {
    throw new ApiError(400, `priority must be one of: ${REQUEST_PRIORITIES.join(', ')}`);
  }
  if (!user.managerId) {
    throw new ApiError(400, 'Your profile has no direct manager to approve this request');
  }

  const created = await ProjectRequest.create({
    title: title.trim(),
    description: description?.trim() ?? '',
    department: user.department,
    requesterId: user._id,
    approverId: user.managerId,
    budget,
    startDate: start,
    endDate: end,
    priority: (priority as RequestPriority | undefined) ?? 'medium',
  });
  await created.populate([
    { path: 'requester', select: PERSON_FIELDS },
    { path: 'approver', select: PERSON_FIELDS },
  ]);

  res.status(201).json({ success: true, data: created });
}

export async function getProjectRequest(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<IProjectRequest>>,
) {
  const user = getAuthUser(req);
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new ApiError(400, 'Invalid request id');

  const request = await ProjectRequest.findById(id)
    .populate('requester', PERSON_FIELDS)
    .populate('approver', PERSON_FIELDS);
  if (!request) throw new ApiError(404, 'Project request not found');
  if (!canViewRequest(user, request)) throw new ApiError(403, 'You do not have access to this request');

  res.status(200).json({ success: true, data: request });
}
