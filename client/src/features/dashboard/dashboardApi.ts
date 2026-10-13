import { baseApi } from '../../store/baseApi';
import type { RequestStatus } from '../../types/models';

export interface DepartmentBudget {
  department: string;
  approvedBudget: number;
  pendingBudget: number;
  requests: number;
}

export interface OverdueProject {
  _id: string;
  title: string;
  department: string;
  status: RequestStatus;
  budget: number;
  endDate: string;
  daysOverdue: number;
  requester: { _id: string; name: string } | null;
}

export interface DashboardSummary {
  totals: { requests: number; approvedBudget: number; pendingBudget: number };
  countsByStatus: Record<RequestStatus, number>;
  budgetByDepartment: DepartmentBudget[];
  overdue: OverdueProject[];
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => '/dashboard/summary',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
