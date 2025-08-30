import { fetchUserProfile } from '@/store/authSlise';
import type { ProtectedRouteProps } from '@/types';
import { useEffect } from 'react';
import { useAppDispatch, useAuth } from '@/store/hooks';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && status === 'idle') {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
