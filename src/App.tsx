import React from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import { Box } from '@mui/material';

export const App: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <AddTodoForm />
      <TodoList />
    </Box>
  );
};

