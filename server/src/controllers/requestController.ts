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
import notifyMake from '../utils/notifyMake';

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

  await notifyMake('request.created', created);

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

const DECISIONS = ['approved', 'rejected'] as const;
type Decision = (typeof DECISIONS)[number];

interface DecideProjectRequestBody {
  decision?: unknown;
  note?: unknown;
}

export async function decideProjectRequest(
  req: Request<{ id: string }, {}, DecideProjectRequestBody>,
  res: Response<ApiResponse<IProjectRequest>>,
) {
  const user = getAuthUser(req);
  const { id } = req.params;
  const { decision, note } = req.body ?? {};
  if (!isValidObjectId(id)) throw new ApiError(400, 'Invalid request id');
  if (!isOneOf(DECISIONS, decision)) throw new ApiError(400, 'decision must be approved or rejected');
  if (note !== undefined && typeof note !== 'string') throw new ApiError(400, 'note must be a string');
  if (typeof note === 'string' && note.trim().length > 1000) {
    throw new ApiError(400, 'note must be at most 1000 characters');
  }

  const request = await ProjectRequest.findById(id);
  if (!request) throw new ApiError(404, 'Project request not found');
  if (!request.approverId?.equals(user._id)) {
    throw new ApiError(403, 'Only the assigned approver can decide on this request');
  }
  if (request.status !== 'pending') throw new ApiError(409, 'This request has already been decided');

  request.status = decision as Decision;
  request.decisionNote = typeof note === 'string' ? note.trim() : '';
  request.decidedAt = new Date();
  await request.save();
  await request.populate([
    { path: 'requester', select: PERSON_FIELDS },
    { path: 'approver', select: PERSON_FIELDS },
  ]);

  await notifyMake('request.decided', request);

  res.status(200).json({ success: true, data: request });
}

/** Execution statuses the PMO can move a request into, keyed by the status it must currently have. */
const STATUS_TRANSITIONS: Partial<Record<RequestStatus, RequestStatus>> = {
  approved: 'in-progress',
  'in-progress': 'completed',
};

interface UpdateProjectRequestStatusBody {
  status?: unknown;
}

export async function updateProjectRequestStatus(
  req: Request<{ id: string }, {}, UpdateProjectRequestStatusBody>,
  res: Response<ApiResponse<IProjectRequest>>,
) {
  const { id } = req.params;
  const { status } = req.body ?? {};
  if (!isValidObjectId(id)) throw new ApiError(400, 'Invalid request id');
  if (status !== 'in-progress' && status !== 'completed') {
    throw new ApiError(400, 'status must be in-progress or completed');
  }

  const request = await ProjectRequest.findById(id);
  if (!request) throw new ApiError(404, 'Project request not found');
  if (STATUS_TRANSITIONS[request.status] !== status) {
    throw new ApiError(409, `Cannot change status from ${request.status} to ${status}`);
  }

  request.status = status;
  await request.save();
  await request.populate([
    { path: 'requester', select: PERSON_FIELDS },
    { path: 'approver', select: PERSON_FIELDS },
  ]);

  res.status(200).json({ success: true, data: request });
}
