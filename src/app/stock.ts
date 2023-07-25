import { createSlice } from '@reduxjs/toolkit';

export const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        stockTable: {} as { [key: string]: { name: string } },
        navList: {} as { [key: string]: { price: string } },
    },
    reducers: {
        updateStockTable(state, action) {
            state.stockTable = action.payload;
        },
        updateNavList(state, action) {
            state.navList = action.payload;
        },
    },
});

export const { updateStockTable, updateNavList } = stockSlice.actions;
export default stockSlice.reducer;
