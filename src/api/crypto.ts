import req from '@/config/request';
import { base, apiMax, apiAce } from '@/config/apiPath';

type MaxPriceObj = { buy: string; sell: string; last: string };
export type MaxPriceList = {
    btctwd: MaxPriceObj;
    ethtwd: MaxPriceObj;
    usdttwd: MaxPriceObj;
    btcusdt: MaxPriceObj;
    ethusdt: MaxPriceObj;
};

type AcePriceObj = { buy: string; sell: string; last_price: string };
export type AcePriceList = {
    ['BTC/TWD']: AcePriceObj;
    ['ETH/TWD']: AcePriceObj;
    ['BTC/USDT']: AcePriceObj;
    ['ETH/USDT']: AcePriceObj;
    ['USDT/TWD']: AcePriceObj;
};
export type AceBook = {
    attachment: {
        bids: Array<Array<string>>;
        asks: Array<Array<string>>;
    };
};

export const apiGetCryptoPrice = async (params: object) => {
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

// Ace
export const apiGetAceCryptoPrice = async () => {
    const res = await req(`${apiAce}/oapi/v2/list/tradePrice`);
    if (res) return res;
    else return false;
};
export const apiGetAceCryptoBook = async (baseCurrencyId: number, quoteCurrencyId: number) => {
    const res = await req(
        `${apiAce}/open/v2/public/getOrderBook?baseCurrencyId=${baseCurrencyId}&quoteCurrencyId=${quoteCurrencyId}&depth=1`
    );
    if (res) return res as AceBook;
    else return false;
};
