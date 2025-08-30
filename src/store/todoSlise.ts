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
          
          // Handle todos data safely
          if (Array.isArray(action.payload.data)) {
            state.todos = action.payload.data;
          } else if (Array.isArray(action.payload)) {
            // Fallback: if payload is directly an array
            state.todos = action.payload;
          } else {
            console.warn('Unexpected todos data structure:', action.payload);
            state.todos = [];
          }
          
          // Handle pagination safely
          if (action.payload.pagination && typeof action.payload.pagination.totalPages === 'number') {
            state.totalPages = action.payload.pagination.totalPages;
          } else {
            // Default to 1 page if no pagination info
            state.totalPages = 1;
          }
          
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
