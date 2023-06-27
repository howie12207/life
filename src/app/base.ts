import { createSlice } from '@reduxjs/toolkit';

export const baseSlice = createSlice({
    name: 'base',
    initialState: {
        loading: false,
        isLogin: false,
        username: '',
    },
    reducers: {
        updateLoading(state, action) {
            state.loading = action.payload;
        },
        updateIsLogin(state, action) {
            state.isLogin = action.payload;
        },
        updateUsername(state, action) {
            state.username = action.payload;
        },
    },
});

export const { updateLoading, updateIsLogin, updateUsername } = baseSlice.actions;
export default baseSlice.reducer;
