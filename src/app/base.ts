import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const baseSlice = createSlice({
    name: 'base',
    initialState: {
        loading: false,
        token: '',
        isOpenMenu: false,
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
        updateIsOpenMenu(state, action) {
            state.isOpenMenu = action.payload;
        },
    },
});

export const { updateLoading, updateToken, clearToken, updateIsOpenMenu } = baseSlice.actions;
export default baseSlice.reducer;
