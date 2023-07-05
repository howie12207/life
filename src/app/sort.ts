import { createSlice } from '@reduxjs/toolkit';

export const sortSlice = createSlice({
    name: 'sort',
    initialState: {
        sortList: [],
    },
    reducers: {
        updateSortList(state, action) {
            state.sortList = action.payload;
        },
    },
});

export const { updateSortList } = sortSlice.actions;
export default sortSlice.reducer;
