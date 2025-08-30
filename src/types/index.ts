// Auth Types
export interface User {
  id: number;
  email: string;
  age?: number;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  age?: number;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// Todo Types
export interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
}

export interface TodosApiResponse {
  data: Todo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchTodosParams {
  page: number;
  limit: number;
}

// State Types
export interface TodoState {
  todos: Todo[];
  currentPage: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  isAuthenticated: boolean;
}

export interface RootState {
  todo: TodoState;
  auth: AuthState;
}

// Component Props Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Redux Types
export type AppDispatch = any;
