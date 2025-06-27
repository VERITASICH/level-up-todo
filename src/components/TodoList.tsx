import React, { useEffect } from 'react';
import { deleteTodo, fetchTodos, setLimit, setPage } from '../store/todoSlise';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  Pagination, 
  Select, 
  MenuItem, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  Alert, 
  CircularProgress, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    todos,
    currentPage,
    limit,
    totalPages,
    isLoading,
    error,
  } = useAppSelector((state) => state.todo);

  useEffect(() => {
    dispatch(fetchTodos({ page: currentPage, limit }));
  }, [currentPage, limit, dispatch]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPage(page));
  };

  const handleLimitChange = (e: SelectChangeEvent<number>) => {
    dispatch(setLimit(Number(e.target.value)));
  };
  
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Список задач
      </Typography>

      {/* Выбор количества задач на странице */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography>Задач на странице:</Typography>
        <Select 
          value={limit} 
          onChange={handleLimitChange} 
          size="small"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </Box>

      {/* Состояние загрузки */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Ошибка */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Список задач */}
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <ListItemText primary={todo.text} />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Пагинация (если есть задачи) */}
      {todos.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
          <Typography sx={{ textAlign: 'center', mt: 1 }}>
            Страница {currentPage} из {totalPages}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default TodoList;