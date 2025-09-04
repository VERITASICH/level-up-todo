import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type { Todo, TodoState, TodosApiResponse, FetchTodosParams } from '@/types';
import { todosAPI } from '@/api/todosAPI';

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
>('todos/fetchTodos', async ({ page, limit }, { rejectWithValue }) => {
  try {
    const response = await todosAPI.getTodos({ page, limit });    
    console.log('API Response:', response.data); // Debug log
    
    // Validate response structure
    if (!response.data) {
      console.error('No data in response');
      return rejectWithValue('Invalid response structure');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching todos:', error);
    if (error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

export const addTodo = createAsyncThunk<Todo, string, { rejectValue: string }>(
  'todos/addTodo',
  async (todoText, { rejectWithValue }) => {
    try {
      const response = await todosAPI.createTodo(todoText);
      if (!response.data) {
        return rejectWithValue('Invalid response structure');
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
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
>('todos/deleteTodo', async (todoId, { rejectWithValue }) => {
  try {
    await todosAPI.deleteTodo(todoId);
    return todoId;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue('Failed to delete todo');
  }
});

export const toggleTodo = createAsyncThunk<
  Todo,
  string | number,
  { rejectValue: string }
>('todos/toggleTodo', async (todoId, { rejectWithValue }) => {
  try {
    const response = await todosAPI.toggleTodo(todoId);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data.error || error.response.data);
    }
    return rejectWithValue('Failed to toggle todo status');
  }
});

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
      .addCase(
        fetchTodos.fulfilled,
        (state, action: PayloadAction<TodosApiResponse>) => {
          state.isLoading = false;
          
          // Safety check for response structure
          if (!action.payload) {
            console.error('No payload received in fetchTodos.fulfilled');
            state.todos = [];
            state.totalPages = 1;
            return;
          }
          
          // Handle todos data safely - try multiple possible structures
          const payload = action.payload as any; // Use any to handle different response structures
          
          if (Array.isArray(payload.data)) {
            // Expected structure: { data: [], pagination: {} }
            state.todos = payload.data;
          } else if (Array.isArray(payload.todos)) {
            // Alternative structure: { todos: [], totalPages: 5 }
            state.todos = payload.todos;
          } else if (Array.isArray(payload)) {
            // Fallback: if payload is directly an array
            state.todos = payload;
          } else {
            console.warn('Unexpected todos data structure:', payload);
            state.todos = [];
          }
          
          // Handle pagination safely - try multiple possible structures
          console.log('Full payload:', payload); // Debug log
          console.log('Pagination data:', payload.pagination); // Debug log
          
          let totalPages = 1; // Default
          
          // Try different possible pagination structures
          if (payload.pagination && typeof payload.pagination.totalPages === 'number') {
            // Expected structure: { pagination: { totalPages: 5 } }
            totalPages = payload.pagination.totalPages;
            console.log('Found totalPages in pagination:', totalPages);
          } else if (typeof payload.totalPages === 'number') {
            // Alternative structure: { totalPages: 5 }
            totalPages = payload.totalPages;
            console.log('Found totalPages at root level:', totalPages);
          } else if (payload.pagination && typeof payload.pagination.total === 'number' && state.limit > 0) {
            // Calculate from total count: { pagination: { total: 25 } }
            totalPages = Math.ceil(payload.pagination.total / state.limit);
            console.log('Calculated totalPages from total count:', totalPages);
          } else if (typeof payload.total === 'number' && state.limit > 0) {
            // Calculate from total count at root: { total: 25 }
            totalPages = Math.ceil(payload.total / state.limit);
            console.log('Calculated totalPages from root total:', totalPages);
          } else {
            // Last resort: if we have todos and they fill the current page, assume there might be more
            if (state.todos.length === state.limit) {
              totalPages = state.currentPage + 1; // Assume there's at least one more page
              console.log('No pagination info, assuming more pages based on current page size');
            } else {
              totalPages = state.currentPage; // Current page is the last page
              console.log('No pagination info, current page appears to be the last');
            }
          }
          
          state.totalPages = totalPages;
          console.log('Final totalPages set to:', state.totalPages);
          
          }
      )
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
      .addCase(
        deleteTodo.fulfilled,
        (state, action: PayloadAction<string | number>) => {
          state.isLoading = false;
          state.todos = state.todos.filter(
            (todo) => todo.id !== action.payload
          );
          toast.success('Задача успешно удалена!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      )
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при удалении задачи';
      })

      // Обработчики для toggleTodo
      .addCase(toggleTodo.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        // Оптимистичное обновление
        const todo = state.todos.find((t) => t.id === action.meta.arg);
        if (todo) {
          todo.completed = !todo.completed;
        }
      })
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false;
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при изменении статуса задачи';
        // Откат оптимистичного обновления
        const todo = state.todos.find((t) => t.id === action.meta.arg);
        if (todo) {
          todo.completed = !todo.completed;
        }
      });
  },
});

export const { setPage, setLimit } = todoSlice.actions;
export default todoSlice.reducer;
