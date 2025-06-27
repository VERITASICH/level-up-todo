import React, { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todoSlise';
import { TextField, Button, Box } from '@mui/material';
import { AppDispatch } from '../store/store'; 

const AddTodoForm: React.FC = () => {
  const [todoText, setTodoText] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>(); 

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (todoText.trim()) {
      dispatch(addTodo(todoText));
      setTodoText('');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ mb: 3 }}
    >
      <TextField
        fullWidth
        variant="outlined"
        label="Новая задача"
        value={todoText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          setTodoText(e.target.value)
        }
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
};

export default AddTodoForm;