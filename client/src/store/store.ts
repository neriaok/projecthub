import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import authReducer, { TOKEN_STORAGE_KEY } from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

let persistedToken = store.getState().auth.token;
store.subscribe(() => {
  const { token } = store.getState().auth;
  if (token === persistedToken) return;
  persistedToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the session then lasts until reload.
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
