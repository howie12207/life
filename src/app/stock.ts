import { createSlice } from '@reduxjs/toolkit';

export const stockSlice = createSlice({
    name: 'stock',
    initialState: {
        stockTable: {} as { [key: string]: { name: string } },
    },
    reducers: {
        updateStockTable(state, action) {
            state.stockTable = action.payload;
        },
    },
});

export const { updateStockTable } = stockSlice.actions;
export default stockSlice.reducer;
