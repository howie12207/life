import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增花費項目
export type CostItemParams = {
    costTime: number;
    costDate?: string;
    itemName: string;
    price: number;
    note: string;
    _id?: string;
};
export const apiAddCostItem = async (params: CostItemParams) => {
    const res = await req(`${base}/cost`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得花費清單
type ListParams = { startTime?: string; endTime?: string; page?: number; size?: number };
export type CostListRes = {
    list: Array<CostItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetCostList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/cost/list${query}`);
    if (res?.code === 200) return res.data as CostListRes;
    else return false;
};

// 編輯花費項目
export const apiEditCostItem = async (params: CostItemParams) => {
    const res = await req(`${base}/cost?_id=${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除花費項目
export const apiDeleteCostItem = async (_id: string) => {
    const res = await req(`${base}/cost?_id=${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
