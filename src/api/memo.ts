import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增便條紙
export type MemoItemParams = {
    content: string;
    color: string;
    createTime?: number;
    updateTime?: number;
    deleteTime?: number;
    _id?: string;
};
export const apiAddMemoItem = async (params: MemoItemParams) => {
    const res = await req(`${base}/memo`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得便條紙清單
type ListParams = { startTime?: string; endTime?: string; page?: number; size?: number };
export type MemoListRes = {
    list: Array<MemoItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetMemoList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/memoList${query}`);
    if (res?.code === 200) return res.data?.list as MemoListRes['list'];
    else return false;
};

// 編輯便條紙
export const apiEditMemoItem = async (params: MemoItemParams) => {
    const res = await req(`${base}/memo?_id=${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除便條紙項目
export const apiDeleteMemoItem = async (_id: string) => {
    const res = await req(`${base}/memo?_id=${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
