import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlise'; 
import { TextField, Button, Box } from '@mui/material';

function AddTodoForm() {
  const [todoText, setTodoText] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoText.trim()) {
      dispatch(addTodo(todoText));
      setTodoText('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Новая задача"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ mt: 1 }}
      >
        Добавить
      </Button>
    </Box>
  );
}

export default AddTodoForm;