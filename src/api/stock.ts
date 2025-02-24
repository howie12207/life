import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

import { store } from '@/app/store';
import { updateNavList } from '@/app/stock';

const apiPath = '' as string;

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
    const res = await req(`${base}/stock${apiPath === '2' ? '?accountType=2' : ''}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 新增配息項目
export type DividendItemParams = {
    itemName: string;
    itemCode: string;
    tradeDate: number;
    exDividendDate: number;
    dollar: number;
    amount: number;
    note: string;
    _id?: string;
    tradeDateString?: string;
};
export const apiAddDividendItem = async (params: DividendItemParams) => {
    const res = await req(`${base}/stock/dividend${apiPath === '2' ? '?accountType=2' : ''}`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
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
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    if (apiPath === '2') searchParams.append('accountType', '2');

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/stock/list${query}`);
    if (res?.code === 200) return res.data as StockListRes;
    else return false;
};

// 取得配息清單
export type DividendListRes = {
    list: Array<DividendItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetDividendList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    if (apiPath === '2') searchParams.append('accountType', '2');
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/stock/dividend/list${query}`);
    if (res?.code === 200) return res.data as DividendListRes;
    else return false;
};

// 取得股票名稱對照表
export const apiGetStockTable = async () => {
    const res = await req(`${base}/stock/tableName`);
    if (res?.code === 200) return res.data;
};

// 取得所有淨值清單
export const apiGetNavList = async () => {
    const res = await req(`${base}/stock/navList`);
    if (res?.code === 200) {
        store.dispatch(updateNavList(res.data));
    }
};

// 編輯股票項目
export const apiEditStockItem = async (params: StockItemParams) => {
    const res = await req(
        `${base}/stock?_id=${params._id}${apiPath === '2' ? '&accountType=2' : ''}`,
        {
            method: 'PATCH',
            body: JSON.stringify(params),
        }
    );
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 編輯配息項目
export const apiEditDividendItem = async (params: DividendItemParams) => {
    const res = await req(
        `${base}/stock/dividend?_id=${params._id}${apiPath === '2' ? '&accountType=2' : ''}`,
        {
            method: 'PATCH',
            body: JSON.stringify(params),
        }
    );
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除股票項目
export const apiDeleteStockItem = async (_id: string) => {
    const res = await req(`${base}/stock?_id=${_id}${apiPath === '2' ? '&accountType=2' : ''}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};

// 刪除配息項目
export const apiDeleteDividendItem = async (_id: string) => {
    const res = await req(
        `${base}/stock/dividend?_id=${_id}${apiPath === '2' ? '&accountType=2' : ''}`,
        {
            method: 'DELETE',
        }
    );
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
