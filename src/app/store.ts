import { configureStore } from '@reduxjs/toolkit';
import baseReducer from './base';
import sortReducer from './sort';
import stockReducer from './stock';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: { base: baseReducer, sort: sortReducer, stock: stockReducer },
    devTools: import.meta.env.DEV,
});
