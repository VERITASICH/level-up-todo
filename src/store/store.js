import { configureStore } from "@reduxjs/toolkit";
import todoReducer from './todoSlise'


export const store = configureStore({
    reducer: {
        todo: todoReducer,
    },
    
})