import { configureStore } from "@reduxjs/toolkit";
import todoReducer from './todoSlise';
import { TodoState } from './todoSlise'; 


export interface RootState {
  todo: TodoState;
}

export const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

export type AppDispatch = typeof store.dispatch;