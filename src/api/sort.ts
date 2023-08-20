import req from '@/config/request';
import { base } from '@/config/apiPath';

export type SortItemParams = {
    name: string;
    createTime: number;
    color: string;
};
// 取得分類清單
export type SortListRes = {
    list: Array<SortItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetSortList = async () => {
    const res = await req(`${base}/sortList`);
    if (res?.code === 200) return res.data as SortListRes;
    else return false;
};
