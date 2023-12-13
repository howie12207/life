import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增資產
export type AssetsListItem = {
    itemName: string;
    currency: string;
    dollar: number;
    combineName?: string;
};
export type AssetsItemParams = {
    recordDate: number;
    list: Array<AssetsListItem>;
    forexUSD: string;
    forexZAR: string;
    createTime?: number;
    updateTime?: number;
    _id?: string;
    total?: number;
};
export const apiAddAssetsItem = async (params: AssetsItemParams) => {
    const res = await req(`${base}/assets`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得資產清單
export const apiGetAssetsList = async (params?: object) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/assetsList${query}`);
    if (res?.code === 200) return res.data.list as Array<AssetsItemParams>;
    else return false;
};

// // 編輯資產
// export const apiEditAssetsItem = async (params: AssetsItemParams) => {
//     const res = await req(`${base}/assets?_id=${params._id}`, {
//         method: 'PATCH',
//         body: JSON.stringify(params),
//     });
//     if (res?.code === 200) {
//         SnackbarUtils.success('編輯成功');
//         return true;
//     } else return false;
// };

// // 刪除資產
// export const apiDeleteAssetsItem = async (_id: string) => {
//     const res = await req(`${base}/assets?_id=${_id}`, {
//         method: 'DELETE',
//     });
//     if (res?.code === 200) {
//         SnackbarUtils.success('刪除成功');
//         return true;
//     } else return false;
// };
