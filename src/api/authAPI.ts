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

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

        tokenStorage.setTokens(newToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        tokenStorage.clearTokens();
        
        // Dispatch logout action if we're in a Redux context
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

  getProfile: () => 
    api.get<User>('/auth/me'),

  changePassword: (passwords: ChangePasswordData) => 
    api.post('/auth/change-password', passwords),

  refreshToken: (refreshToken: string) => 
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: () => {
    tokenStorage.clearTokens();
    return Promise.resolve();
  },
};

