import req from '@/config/request';
import { base } from '@/config/apiPath';
import SnackbarUtils from '@/utils/snackBar';

// 新增文章
export type ArticleItemParams = {
    name: string;
    content: string;
    sorts: Array<string>;
    status: number;
    createTime?: number;
    updateTime?: number;
    _id?: string;
};
export const apiAddArticleItem = async (params: ArticleItemParams) => {
    const res = await req(`${base}/article`, { method: 'POST', body: JSON.stringify(params) });
    if (res?.code === 200) {
        SnackbarUtils.success('新增成功');
        return true;
    } else return false;
};

// 取得文章清單
type ListParams = { startTime?: string; endTime?: string; page?: number; size?: number };
export type ArticleListRes = {
    list: Array<ArticleItemParams>;
    totalPage: number;
    totalCount: number;
};
export const apiGetArticleList = async (params?: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/articleList${query}`);
    if (res?.code === 200) return res.data as ArticleListRes;
    else return false;
};

// 取得指定文章
export const apiGetArticleItem = async (_id: string) => {
    const res = await req(`${base}/article?_id=${_id}`);
    if (res?.code === 200) return res.data as ArticleItemParams;
    else return false;
};

// 編輯文章
export const apiEditArticleItem = async (params: ArticleItemParams) => {
    const res = await req(`${base}/article?_id=${params._id}`, {
        method: 'PATCH',
        body: JSON.stringify(params),
    });
    if (res?.code === 200) {
        SnackbarUtils.success('編輯成功');
        return true;
    } else return false;
};

// 刪除文章
export const apiDeleteArticleItem = async (_id: string) => {
    const res = await req(`${base}/article?_id=${_id}`, {
        method: 'DELETE',
    });
    if (res?.code === 200) {
        SnackbarUtils.success('刪除成功');
        return true;
    } else return false;
};
