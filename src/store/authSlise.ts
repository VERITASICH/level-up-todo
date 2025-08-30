import { authAPI } from '@/api/authAPI';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ChangePasswordData,
  LoginCredentials,
  RegisterData,
  User,
  AuthState,
} from '@/types';
import { tokenStorage } from '@/utils/auth';

export const initialState: AuthState = {
  user: null,
  token: tokenStorage.getAccessToken(),
  status: 'idle',
  error: null,
  isAuthenticated: !!tokenStorage.getAccessToken(),
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.register(userData);
      const { accessToken, refreshToken } = response.data;

      tokenStorage.setTokens(accessToken, refreshToken);

      // Fetch user profile after successful registration
      const profileResponse = await authAPI.getProfile();
      const user = profileResponse.data;

      return { user, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const { accessToken, refreshToken } = response.data;

      tokenStorage.setTokens(accessToken, refreshToken);

      // Fetch user profile after successful login
      const profileResponse = await authAPI.getProfile();
      const user = profileResponse.data;

      return { user, token: accessToken };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwords: ChangePasswordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(passwords);
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Password change failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      tokenStorage.clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        tokenStorage.clearTokens();
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
