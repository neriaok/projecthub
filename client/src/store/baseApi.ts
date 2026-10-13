import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { loggedOut } from '../features/auth/authActions';
import type { ApiResponse } from '../types/models';

interface StateWithToken {
  auth: { token: string | null };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as StateWithToken).auth;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/** Unwraps the API's { success, data } envelope and signs the user out when the session is rejected. */
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // Only sign out here. Resetting the API state from inside a running query leaves
  // RTK Query inconsistent, so the cache is cleared when the next session starts instead.
  if (result.error?.status === 401 && api.endpoint !== 'login') {
    api.dispatch(loggedOut());
  }
  if (result.error) return { error: result.error };

  const body = result.data as ApiResponse<unknown>;
  return body.success ? { data: body.data } : { error: { status: 500, data: body } };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Request', 'Dashboard'],
  endpoints: () => ({}),
});
