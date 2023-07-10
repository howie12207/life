import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增作品項目
export type PortfolioItemParams = {
    name: string;
    content: string;
    img: string;
    pathCode: string;
    pathDemo: string;
    url: string;
    order: number;
    status: number;
    recommend: boolean;
    updateTime?: number;
    createTime?: number;
    _id?: string;
};
export const apiAddPortfolioItem = async (params: PortfolioItemParams) => {
    const res = await req(`${base}/portfolio/item`, {
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得作品清單
type ListParams = { startTime?: string; endTime?: string; page?: number; size?: number };
export type PortfolioListRes = {
    list: Array<PortfolioItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetPortfolioList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/portfolio/list${query}`);
    if (res?.code === 200) return res.data as PortfolioListRes;
    else return false;
};

// 編輯作品項目
export const apiEditPortfolioItem = async (params: PortfolioItemParams) => {
    const res = await req(`${base}/portfolio/item/${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除作品項目
export const apiDeletePortfolioItem = async (_id: string) => {
    const res = await req(`${base}/portfolio/item/${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
