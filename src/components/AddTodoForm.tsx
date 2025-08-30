import React, { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '@/store/todoSlise';
import { TextField, Button, Box, Paper } from '@mui/material';
import type { AppDispatch } from '@/types';
import { ToastContainer, toast } from 'react-toastify';

export const AddTodoForm: React.FC = () => {
  const [todoText, setTodoText] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (todoText.trim()) {
      dispatch(addTodo(todoText));
      setTodoText('');
    }
    toast.success('Задача успешно добавлена!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        <ToastContainer />
        <TextField
          fullWidth
          label="Новая задача"
          value={todoText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTodoText(e.target.value)
          }
          variant="outlined"
          size="medium"
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large"
          sx={{ minWidth: '120px' }}
        >
          Добавить
        </Button>
      </Box>
    </Paper>
  );
};
