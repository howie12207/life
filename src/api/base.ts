import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';
import Cookies from 'js-cookie';

import { store } from '@/app/store';
import { updateToken } from '@/app/base';

// 登入
type LoginParams = { account: string; password: string };
export const apiLogin = async (params: LoginParams) => {
    const res = await req(`${base}/user/login`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('登入成功');
        store.dispatch(updateToken(res.data?.token));
        Cookies.set('token', res.data?.token, {
            expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        });
        return true;
    } else return false;
};

// 新增/編輯花費項目
export type CostItemParams = {
    costTime: number;
    costDate?: string;
    itemName: string;
    price: number;
    note: string;
    _id?: string;
};
export const apiAddCostItem = async (params: CostItemParams) => {
    const res = await req(`${base}/cost/item`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得花費清單
type ListParams = { startTime?: string; endTime?: string; page?: number; size?: number };
export type CostListRes = {
    list: Array<{ costDate: string; itemName: string; price: number; note: string }>;
    totalPage: number;
    totalCount: number;
};
export const apiGetCostList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/cost/list${query}`);
    if (res?.code === 200) return res.data as CostListRes;
    else return false;
};

export const apiEditCostItem = async (params: CostItemParams) => {
    const res = await req(`${base}/cost/item/${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

export const apiDeleteCostItem = async (_id: string) => {
    const res = await req(`${base}/cost/item/${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
