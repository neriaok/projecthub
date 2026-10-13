import { baseApi } from '../../store/baseApi';
import type { User } from '../../types/models';

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginBody>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
