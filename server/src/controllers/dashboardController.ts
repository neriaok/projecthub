import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ApiResponse } from '../types/ApiResponse';
import ProjectRequest, { REQUEST_STATUSES, RequestStatus } from '../models/ProjectRequest';

interface DepartmentBudget {
  department: string;
  approvedBudget: number;
  pendingBudget: number;
  requests: number;
}

interface OverdueProject {
  _id: Types.ObjectId;
  title: string;
  department: string;
  status: RequestStatus;
  budget: number;
  endDate: Date;
  daysOverdue: number;
  requester: { _id: Types.ObjectId; name: string } | null;
}

interface DashboardSummary {
  totals: { requests: number; approvedBudget: number; pendingBudget: number };
  countsByStatus: Record<RequestStatus, number>;
  budgetByDepartment: DepartmentBudget[];
  overdue: OverdueProject[];
}

const APPROVED_STATUSES: RequestStatus[] = ['approved', 'in-progress', 'completed'];
const ACTIVE_STATUSES: RequestStatus[] = ['approved', 'in-progress'];
const DAY_MS = 24 * 60 * 60 * 1000;

export async function getDashboardSummary(_req: Request, res: Response<ApiResponse<DashboardSummary>>) {
  const now = new Date();

  const [statusCounts, departments, overdue] = await Promise.all([
    ProjectRequest.aggregate<{ _id: RequestStatus; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    ProjectRequest.aggregate<DepartmentBudget>([
      {
        $group: {
          _id: '$department',
          approvedBudget: {
            $sum: { $cond: [{ $in: ['$status', APPROVED_STATUSES] }, '$budget', 0] },
          },
          pendingBudget: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$budget', 0] } },
          requests: { $sum: 1 },
        },
      },
      { $project: { _id: 0, department: '$_id', approvedBudget: 1, pendingBudget: 1, requests: 1 } },
      { $sort: { approvedBudget: -1 } },
    ]),
    ProjectRequest.find({ status: { $in: ACTIVE_STATUSES }, endDate: { $lt: now } })
      .sort({ endDate: 1 })
      .populate<{ requester: { _id: Types.ObjectId; name: string } | null }>('requester', 'name')
      .lean(),
  ]);

  const countsByStatus = Object.fromEntries(REQUEST_STATUSES.map((status) => [status, 0])) as Record<
    RequestStatus,
    number
  >;
  statusCounts.forEach(({ _id, count }) => {
    countsByStatus[_id] = count;
  });

  res.status(200).json({
    success: true,
    data: {
      totals: {
        requests: statusCounts.reduce((sum, { count }) => sum + count, 0),
        approvedBudget: departments.reduce((sum, d) => sum + d.approvedBudget, 0),
        pendingBudget: departments.reduce((sum, d) => sum + d.pendingBudget, 0),
      },
      countsByStatus,
      budgetByDepartment: departments,
      overdue: overdue.map((request) => ({
        _id: request._id,
        title: request.title,
        department: request.department,
        status: request.status,
        budget: request.budget,
        endDate: request.endDate,
        daysOverdue: Math.floor((now.getTime() - request.endDate.getTime()) / DAY_MS),
        requester: request.requester ? { _id: request.requester._id, name: request.requester.name } : null,
      })),
    },
  });
}
