import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增花費項目
export type DiaryItemParams = {
    _id?: string;
    diaryTime: number;
    content: string;
    type: string;
};
export const apiAddDiaryItem = async (params: DiaryItemParams) => {
    const res = await req(`${base}/diary/item`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得花費清單
type ListParams = { startTime?: string; endTime?: string };
// export type CostListRes = {
//     list: Array<CostItemParams>;
//     totalPage: number;
//     totalCount: number;
// };
export const apiGetDiaryList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/diary/list${query}`);
    if (res?.code === 200) return res.data as Array<DiaryItemParams>;
    else return false;
};

// 編輯花費項目
export const apiEditDiaryItem = async (params: DiaryItemParams) => {
    const res = await req(`${base}/diary/item/${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除花費項目
export const apiDeleteDiaryItem = async (_id: string) => {
    const res = await req(`${base}/diary/item/${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};