import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增薪水
export type SalaryItemParams = {
    getDate: number;
    place: string;
    content: string;
    dollar: number;
    remark: string;
    createTime?: number;
    updateTime?: number;
    _id?: string;
};
export const apiAddSalaryItem = async (params: SalaryItemParams) => {
    const res = await req(`${base}/salary`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得薪水清單
export const apiGetSalaryList = async (params?: object) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/salaryList${query}`);
    if (res?.code === 200) return res.data;
    else return false;
};

// 編輯薪水
export const apiEditSalaryItem = async (params: SalaryItemParams) => {
    const res = await req(`${base}/salary?_id=${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除薪水
export const apiDeleteSalaryItem = async (_id: string) => {
    const res = await req(`${base}/salary?_id=${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
