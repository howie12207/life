import { createSlice } from '@reduxjs/toolkit';

export const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        stockTable: {} as { [key: string]: { name: string } },
        navList: {} as { [key: string]: { price: string } },
        twseDate: '',
        tpexDate: '',
    },
    reducers: {
        updateStockTable(state, action) {
            state.stockTable = action.payload;
        },
        updateNavList(state, action) {
            state.navList = action.payload.list;
            state.twseDate = action.payload.twseDate.slice(5);
            state.tpexDate = action.payload.tpexDate.slice(5);
        },
    },
});

export const { updateStockTable, updateNavList } = stockSlice.actions;
export default stockSlice.reducer;
