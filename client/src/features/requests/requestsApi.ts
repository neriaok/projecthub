import { baseApi } from '../../store/baseApi';
import type { ProjectRequest, RequestPriority, RequestStatus } from '../../types/models';

export interface CreateRequestBody {
  title: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  priority: RequestPriority;
}

export const requestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<ProjectRequest[], RequestStatus | undefined>({
      query: (status) => ({ url: '/requests', params: status ? { status } : undefined }),
      providesTags: (result) => [
        { type: 'Request', id: 'LIST' },
        ...(result ?? []).map(({ _id }) => ({ type: 'Request' as const, id: _id })),
      ],
    }),
    getRequest: builder.query<ProjectRequest, string>({
      query: (id) => `/requests/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Request', id }],
    }),
    createRequest: builder.mutation<ProjectRequest, CreateRequestBody>({
      query: (body) => ({ url: '/requests', method: 'POST', body }),
      invalidatesTags: [{ type: 'Request', id: 'LIST' }],
    }),
  }),
});

export const { useGetRequestsQuery, useGetRequestQuery, useCreateRequestMutation } = requestsApi;
