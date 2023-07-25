import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

import { store } from '@/app/store';
import { updateNavList } from '@/app/stock';

// 新增股票項目
export type StockItemParams = {
    itemCode: string;
    itemType: string;
    tradeDate: number;
    price: string;
    amount: number;
    dollar: number;
    note: string;
    _id?: string;
    tradeDateString?: string;
    itemName: string;
};
export const apiAddStockItem = async (params: StockItemParams) => {
    const res = await req(`${base}/stock/item`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得股票清單
type ListParams = { startTime?: string; endTime?: string; page?: number; size?: number };
export type StockListRes = {
    list: Array<StockItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetStockList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/stock/list${query}`);
    if (res?.code === 200) return res.data as StockListRes;
    else return false;
};

// 取得股票名稱對照表
export const apiGetStockTable = async () => {
    const res = await req(`${base}/stock/tableName`);
    if (res?.code === 200) return res.data;
};

// 取得所有淨值清單
export const apiGetNavList = async () => {
    const res = await req(`${base}/stock/nav/list`);
    if (res?.code === 200) {
        store.dispatch(updateNavList(res.data));
    }
};

// 編輯股票項目
export const apiEditStockItem = async (params: StockItemParams) => {
    const res = await req(`${base}/stock/item/${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除股票項目
export const apiDeleteStockItem = async (_id: string) => {
    const res = await req(`${base}/stock/item/${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
