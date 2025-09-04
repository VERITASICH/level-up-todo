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
    // Проверка, есть ли у пользователя токен, и подтверждение его при запуске приложения.
    const token = tokenStorage.getAccessToken();
    if (token && !tokenStorage.isTokenExpired(token)) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
};
