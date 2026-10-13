import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/models';
import { authApi } from './authApi';
import { loggedOut } from './authActions';

export const TOKEN_STORAGE_KEY = 'projecthub.token';

interface AuthState {
  token: string | null;
  user: User | null;
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

const initialState: AuthState = { token: readStoredToken(), user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedOut, (state) => {
        state.token = null;
        state.user = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload;
      });
  },
});

export default authSlice.reducer;
