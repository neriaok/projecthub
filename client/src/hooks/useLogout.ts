import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { loggedOut } from '../features/auth/authActions';
import { baseApi } from '../store/baseApi';

export function useLogout(): () => void {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(loggedOut());
    dispatch(baseApi.util.resetApiState());
  }, [dispatch]);
}
