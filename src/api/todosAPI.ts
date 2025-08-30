import { api } from './authAPI';
import type { Todo, TodosApiResponse, FetchTodosParams } from '@/types';

export const todosAPI = {
  // Get todos with pagination
  getTodos: (params: FetchTodosParams) => 
    api.get<TodosApiResponse>(`/todos?page=${params.page}&limit=${params.limit}`),

  // Create a new todo
  createTodo: (text: string) => 
    api.post<Todo>('/todos', { text }),

  // Update a todo
  updateTodo: (id: string | number, updates: Partial<Todo>) => 
    api.put<Todo>(`/todos/${id}`, updates),

  // Delete a todo
  deleteTodo: (id: string | number) => 
    api.delete(`/todos/${id}`),

  // Toggle todo completion status
  toggleTodo: (id: string | number) => 
    api.patch<Todo>(`/todos/${id}/toggle`),
};
