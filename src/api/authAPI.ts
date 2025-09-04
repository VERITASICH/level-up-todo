// api/authAPI.ts
import axios from 'axios';
import type {
  User,
  LoginCredentials,
  RegisterData,
  ChangePasswordData,
  AuthResponse,
} from '@/types';
import { tokenStorage } from '@/utils/auth';

const API_URL = 'http://localhost:3001';

// Создаем экземпляр axios с базовыми настройками
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token && !tokenStorage.isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track refresh token promise to prevent multiple simultaneous refresh attempts
let refreshTokenPromise: Promise<any> | null = null;

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If there's already a refresh in progress, wait for it
      if (refreshTokenPromise) {
        try {
          await refreshTokenPromise;
          // Retry the original request with the new token
          const newToken = tokenStorage.getAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If the refresh failed, proceed to logout
          tokenStorage.clearTokens();
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('auth:logout'));
          }
          return Promise.reject(refreshError);
        }
      }

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh access token...');
        
        // Create refresh promise and store it
        refreshTokenPromise = api.post('/auth/refresh', {
          refreshToken: refreshToken,
        });

        const response = await refreshTokenPromise;
        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in storage
        tokenStorage.setTokens(newToken, newRefreshToken);

        // Update Redux state by dispatching a custom event
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', {
            detail: { accessToken: newToken, refreshToken: newRefreshToken }
          }));
        }

        console.log('Access token refreshed successfully');

        // Clear the refresh promise
        refreshTokenPromise = null;

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear the refresh promise
        refreshTokenPromise = null;
        
        // Clear tokens and logout
        tokenStorage.clearTokens();

        // Dispatch logout event to update Redux state
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: RegisterData) =>
    api.post<AuthResponse>('/auth/register', userData),

  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),

  getProfile: () => api.get<User>('/auth/me'),

  changePassword: (passwords: ChangePasswordData) =>
    api.post('/auth/change-password', passwords),

  refreshToken: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: () => {
    tokenStorage.clearTokens();
    return Promise.resolve();
  },
};
