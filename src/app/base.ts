import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const baseSlice = createSlice({
    name: 'base',
    initialState: {
        loading: false,
        token: '',
        isOpenMenu: false,
        autoReload: window.localStorage.getItem('autoReload') !== 'false',
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
            Cookies.remove('accessToken');
        },
        updateIsOpenMenu(state, action) {
            state.isOpenMenu = action.payload;
        },
        updateAutoReload(state, action) {
            state.autoReload = action.payload;
            window.localStorage.setItem('autoReload', String(action.payload));
        },
    },
});

export const { updateLoading, updateToken, clearToken, updateIsOpenMenu, updateAutoReload } =
    baseSlice.actions;
export default baseSlice.reducer;
