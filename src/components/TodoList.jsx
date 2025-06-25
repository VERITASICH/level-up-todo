import React, { useEffect } from 'react';
import { fetchTodos, setLimit, setPage } from '../store/todoSlise';
import { useDispatch, useSelector } from 'react-redux';

function TodoList() {
  const dispatch = useDispatch();
  const {
    todos,
    currentPage,
    limit,
  } = useSelector((state) => state.todo);
  useEffect(() => {
    console.log(todos);
  }, [todos])
  useEffect(() => {
    dispatch(fetchTodos({page: currentPage, limit}));
  }, [currentPage, limit, dispatch]); 
  return (
    <h1>h1</h1>
  );
}

export default TodoList

