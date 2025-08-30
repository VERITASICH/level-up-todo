import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserProfile } from '@/store/authSlise';
import { tokenStorage } from '@/utils/auth';
import type { AppDispatch } from '@/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user has a token and validate it on app start
    const token = tokenStorage.getAccessToken();
    if (token && !tokenStorage.isTokenExpired(token)) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
};
