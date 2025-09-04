import type { FC } from 'react';
import {
  deleteTodo,
  setLimit,
  setPage,
  toggleTodo,
} from '@/store/todoSlise';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
  type SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ToastContainer } from 'react-toastify';

export const TodoList: FC = () => {
  const dispatch = useAppDispatch();
  const { todos, currentPage, limit, totalPages, isLoading, error } =
    useAppSelector((state) => state.todo);

  // Debug log to see pagination values
  console.log('TodoList pagination state:', { currentPage, limit, totalPages, todosCount: todos.length });

  // Note: Initial data fetching is handled by HomePage component
  // This component only handles pagination changes

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    dispatch(setPage(page));
  };

  const handleLimitChange = (e: SelectChangeEvent<number>) => {
    dispatch(setLimit(Number(e.target.value)));
  };

  const handleToggle = (id: string | number) => {
    dispatch(toggleTodo(id));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Список задач
      </Typography>

      {/* Выбор количества задач на странице */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography>Задач на странице:</Typography>
        <Select value={limit} onChange={handleLimitChange} size="small">
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
          <ListItem
            key={todo.id}
            sx={{
              backgroundColor: todo.completed
                ? 'action.selected'
                : 'background.paper',
              transition: 'background-color 0.3s ease',
            }}
          >
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="toggle"
                onClick={() => handleToggle(todo.id)}
                color={todo.completed ? 'success' : 'default'}
              >
                {todo.completed ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => dispatch(deleteTodo(todo.id))}
                color="error"
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
              count={Math.max(totalPages, 1)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
          <Typography sx={{ textAlign: 'center', mt: 1 }}>
            Страница {currentPage} из {Math.max(totalPages, 1)}
          </Typography>
        </>
      )}
    </Box>
  );
};
