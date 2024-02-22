import req from '@/config/request';
import { base, apiMax, apiAce, apiBito } from '@/config/apiPath';

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
export type Wallet = {
    ace: Array<{ currencyName: string; cashAmount: string }>;
    ace2: Array<{ currencyName: string; cashAmount: string }>;
    bito: Array<{ currency: string; available: string }>;
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
export const apiAceOrder = async (params: object) => {
    const res = await req(`${base}/aceOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    if (res) return res;
    else return false;
};
export const apiAceOrder2 = async (params: object) => {
    const res = await req(`${base}/aceOrder2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    if (res) return res;
    else return false;
};
export const apiAceCancelOrder = async (params: object) => {
    const res = await req(`${base}/aceCancelOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    if (res) return res;
    else return false;
};
export const apiAceCancelOrder2 = async (params: object) => {
    const res = await req(`${base}/aceCancelOrder2`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    if (res) return res;
    else return false;
};

// Bito
export const apiGetBitoCryptoBook = async (pair = 'btc_twd', limit = 1) => {
    const res = await req(`${apiBito}/order-book/${pair}?limit=${limit}`);
    if (res) return res;
    else return false;
};
export const apiBitoOrder = async (params: object) => {
    const res = await req(`${base}/bitoOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    if (res) return res;
    else return false;
};
export const apiBitoCancelOrder = async (orderId: string) => {
    const res = await req(`${base}/bitoCancelOrder?orderId=${orderId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res) return res;
    else return false;
};

export const apiOrderListAll = async () => {
    const res = await req(`${base}/orderListAll`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res?.data) return res.data;
    else return false;
};
export const apiFetchBalanceAll = async () => {
    const res = await req(`${base}/balanceAll`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res?.data) return res.data as Wallet;
    else return false;
};
