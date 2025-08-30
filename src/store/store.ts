import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlise';
import authReducer from './authSlise';

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    auth: authReducer,
  },
});


