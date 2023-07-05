import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const baseSlice = createSlice({
    name: 'base',
    initialState: {
        loading: false,
        token: '',
    },
    reducers: {
        updateLoading(state, action) {
            state.loading = action.payload;
        },
        updateToken(state, action) {
            state.token = action.payload;
        },
        clearToken(state) {
            state.token = '';
            Cookies.remove('token');
        },
    },
});

export const { updateLoading, updateToken, clearToken } = baseSlice.actions;
export default baseSlice.reducer;
