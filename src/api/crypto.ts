import req from '@/config/request';
import { base, apiMax } from '@/config/apiPath';

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

type MaxPriceObj = { buy: string; sell: string; last: string };
export type MaxPriceList = {
    btctwd: MaxPriceObj;
    ethtwd: MaxPriceObj;
    usdttwd: MaxPriceObj;
    btcusdt: MaxPriceObj;
    ethusdt: MaxPriceObj;
};

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

// Max
export const apiGetMaxCryptoPrice = async () => {
    const res = await req(apiMax);
    if (res) return res as MaxPriceList;
    else return false;
};
