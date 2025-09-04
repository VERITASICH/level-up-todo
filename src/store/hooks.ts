import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/types';
import { useEffect } from 'react';
import { logout, updateTokens } from './authSlise';

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

    const handleTokenRefreshed = (event: CustomEvent) => {
      const { accessToken } = event.detail;
      // Update Redux state with new token
      dispatch(updateTokens({ token: accessToken }));
    };

    // Listen for auth events from the API interceptor
    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:tokenRefreshed', handleTokenRefreshed as EventListener);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:tokenRefreshed', handleTokenRefreshed as EventListener);
    };
  }, [dispatch]);

  return auth;
};
