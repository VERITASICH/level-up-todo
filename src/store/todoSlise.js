import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/todos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoText, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, {
        text: todoText,
        completed: false
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/todos/${todoId}`);
      return todoId; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    todos: [],
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.currentPage = 1; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка загрузки задач';
      })
      .addCase(addTodo.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.unshift(action.payload); 
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка при добавлении задачи';
      })
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
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
export default todoSlice.reducer;