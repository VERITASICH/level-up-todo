import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/types';
import { useEffect } from 'react';
import { logout } from './authSlise';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for authentication
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
    };

    // Listen for logout events from the API interceptor
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [dispatch]);

  return auth;
};
