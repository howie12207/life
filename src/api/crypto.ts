import req from '@/config/request';
import { base } from '@/config/apiPath';

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

// 取得文章清單
type ListParams = { fsyms: string; tsyms?: string };

export const apiGetCryptoPrice = async (params: ListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.append(key, String(value));
        });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await req(`${base}/cryptoPrice${query}`);
    if (res?.code === 200) return res.data as { [key: string]: number };
    else return false;
};
