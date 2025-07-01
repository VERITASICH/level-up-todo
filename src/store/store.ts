import { configureStore } from '@reduxjs/toolkit';
import type { TodoState } from './todoSlise';
import todoReducer from './todoSlise';

export interface RootState {
  todo: TodoState;
}

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
