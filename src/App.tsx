import type { FC } from 'react';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { Box } from '@mui/material';

export const App: FC = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <AddTodoForm />
      <TodoList />
    </Box>
  );
};
