import { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useAuth } from '@/store/hooks';
import { fetchTodos } from '@/store/todoSlise';
import { TodoList } from './TodoList';
import { Box, Typography, Button } from '@mui/material';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { todos, currentPage, limit, isLoading, error } = useAppSelector(
    (state) => state.todo
  );
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only fetch todos if user is authenticated
    if (isAuthenticated) {
      dispatch(fetchTodos({ page: currentPage, limit }));
    }
  }, [dispatch, currentPage, limit, isAuthenticated]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }


  if (isLoading && todos.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '16rem' 
      }}>
        <Typography variant="h6" color="text.secondary">
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  if (error && todos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchTodos({ page: currentPage, limit }))}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      
      {/* Task List */}
      <TodoList />

      {/* Loading indicator for pagination */}
      {isLoading && todos.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Loading more tasks...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
