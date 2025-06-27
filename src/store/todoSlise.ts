import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
}

interface TodosApiResponse {
  data: Todo[];
  totalPages: number;
}

interface FetchTodosParams {
  page: number;
  limit: number;
}

interface TodoState {
  todos: Todo[];
  currentPage: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  isLoading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk<
  TodosApiResponse, 
  FetchTodosParams, 
  { rejectValue: string } 
>(
  'todos/fetchTodos',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get<TodosApiResponse>(
        `${API_URL}/todos?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const addTodo = createAsyncThunk<
  Todo, 
  string, 
  { rejectValue: string }
>(
  'todos/addTodo',
  async (todoText, { rejectWithValue }) => {
    try {
      const response = await axios.post<Todo>(`${API_URL}/todos`, {
        text: todoText,
        completed: false
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to add todo');
    }
  }
);

export const deleteTodo = createAsyncThunk<
  number | string, 
  number | string, 
  { rejectValue: string }
>(
  'todos/deleteTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/todos/${todoId}`);
      return todoId;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to delete todo');
    }
  }
);

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<TodosApiResponse>) => {
        state.isLoading = false;
        state.todos = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки задач';
      })
      
      // Обработчики для addTodo
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false;
        state.todos.unshift(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при добавлении задачи';
      })
      
      // Обработчики для deleteTodo
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.isLoading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при удалении задачи';
      });
  },
});

export const { setPage, setLimit } = todoSlice.actions;
export type { Todo, TodoState };
export type { FetchTodosParams, TodosApiResponse };
export default todoSlice.reducer;