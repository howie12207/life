import { configureStore } from '@reduxjs/toolkit';
import baseReducer from './base';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: { base: baseReducer },
    devTools: import.meta.env.DEV,
});
