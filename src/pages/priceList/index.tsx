import { useState, useEffect, useCallback } from 'react';
import {
    apiGetMaxCryptoPrice,
    MaxPriceList,
    apiGetAceCryptoPrice,
    apiGetAceCryptoBook,
    apiOrderListAll,
    apiAceCancelOrder,
    apiAceCancelOrder2,
    apiBitoCancelOrder,
    apiGetBitoCryptoBook,
    AcePriceList,
    AceBook,
    apiAceOrder,
    apiAceOrder2,
    apiBitoOrder,
    apiFetchBalanceAll,
    Wallet,
} from '@/api/crypto';
import { formatToThousand, formatDateTime, settleTimezone, toStartTime } from '@/utils/format';

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Skeleton,
    RadioGroup,
    Radio,
    FormControlLabel,
    TextField,
    Button,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { BaseDatePicker } from '@/components/baseDatePicker/BaseDatePicker';

type AcePriceListKeys = keyof AcePriceList;
type MaxPriceListKeys = keyof MaxPriceList;
type BitoPriceList = {
    buy: '';
    sell: '';
};

const MAX_TABLE_LIST: Array<MaxPriceListKeys> = ['btctwd', 'usdttwd', 'btcusdt', 'ethusdt'];
const ACE_TABLE_LIST: Array<AcePriceListKeys> = ['BTC/TWD', 'USDT/TWD', 'BTC/USDT', 'ETH/USDT'];

const PriceList = () => {
    const INTERVAL = 10000;
    const [maxPriceList, setMaxPriceList] = useState({} as MaxPriceList);
    const [acePriceList, setAcePriceList] = useState({} as AcePriceList);
    const [bitoPriceList, setBitoPriceList] = useState({} as BitoPriceList);
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);

    const getPrice = useCallback(async () => {
        if (import.meta.env.PROD) return;
        setIsLoadingPrice(true);
        const [
            resMax,
            resAcePrice,
            resAceBTCTWD,
            resAceBTCUSDT,
            resAceETHUSDT,
            resAceUSDTTWD,
            resBitoBTCTWD,
        ] = await Promise.all([
            apiGetMaxCryptoPrice(),
            apiGetAceCryptoPrice(),
            apiGetAceCryptoBook(2, 1),
            apiGetAceCryptoBook(2, 14),
            apiGetAceCryptoBook(4, 14),
            apiGetAceCryptoBook(14, 1),
            apiGetBitoCryptoBook(),
        ]);
        if (resMax) setMaxPriceList(resMax);
        if (resAcePrice) setAcePriceList(resAcePrice);
        if (resAceBTCTWD) handleAceBook('BTC/TWD', resAceBTCTWD);
        if (resAceBTCUSDT) handleAceBook('BTC/USDT', resAceBTCUSDT);
        if (resAceETHUSDT) handleAceBook('ETH/USDT', resAceETHUSDT);
        if (resAceUSDTTWD) handleAceBook('USDT/TWD', resAceUSDTTWD);
        if (resBitoBTCTWD) {
            setBitoPriceList({
                buy: resBitoBTCTWD?.bids?.[0].price,
                sell: resBitoBTCTWD?.asks?.[0].price,
            });
        }
        setIsLoadingPrice(false);
    }, []);

    const [orderStartDate, setOrderStartDate] = useState<Date | null>(new Date());

    const getOrderList = useCallback(async () => {
        const orderList = await apiOrderListAll({
            startTime: settleTimezone(toStartTime(settleTimezone(orderStartDate)), true),
        });
        setOrderListAll(orderList);
    }, [orderStartDate]);

    // Wallet
    const [wallet, setWallet] = useState({} as Wallet);
    const getBalance = useCallback(async () => {
        if (import.meta.env.PROD) return;
        const res = await apiFetchBalanceAll();
        if (res) setWallet(res);
    }, []);

    const handleAceBook = (target: AcePriceListKeys, data: AceBook) => {
        setAcePriceList(preState => ({
            ...preState,
            [target]: {
                ...preState[target],
                buy: data.attachment.bids[0][1],
                sell: data.attachment.asks[0][1],
            },
        }));
    };

    useEffect(() => {
        getOrderList();
        getPrice();
        getBalance();
        let timer: ReturnType<typeof setInterval> = setInterval(() => {
            getPrice();
        }, INTERVAL);

        const handleVisible = () => {
            if (document.visibilityState === 'visible') {
                getPrice();
                timer = setInterval(() => {
                    getPrice();
                }, INTERVAL);
            } else clearInterval(timer);
        };
        document.addEventListener('visibilitychange', handleVisible);

        return () => {
            document.removeEventListener('visibilitychange', handleVisible);
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ValueComponent = (value: string) => {
        return (
            <SwitchTransition>
                <CSSTransition
                    key={isLoadingPrice ? 'loading' : 'data'}
                    timeout={300}
                    classNames="page"
                    unmountOnExit
                >
                    {isLoadingPrice ? (
                        <Skeleton width={80} className="!inline-block" />
                    ) : (
                        <span>{formatToThousand(value)}</span>
                    )}
                </CSSTransition>
            </SwitchTransition>
        );
    };

    const [aceType, setAceType] = useState('1');
    const [acePrice, setAcePrice] = useState('');
    const [aceAmount, setAceAmount] = useState('0.0006');
    const [aceCurrency, setAceCurrency] = useState('14');
    const aceSubmit = async () => {
        await apiAceOrder({
            buyOrSell: aceType,
            price: acePrice,
            num: aceAmount,
            quoteCurrencyId: aceCurrency,
            baseCurrencyId: '2',
        });
        await Promise.all([getOrderList(), getBalance()]);
    };

    const [ace2Type, setAce2Type] = useState('1');
    const [ace2Price, setAce2Price] = useState('');
    const [ace2Amount, setAce2Amount] = useState('0.0006');
    const ace2Submit = async () => {
        await apiAceOrder2({
            buyOrSell: ace2Type,
            price: ace2Price,
            num: ace2Amount,
            quoteCurrencyId: '14',
            baseCurrencyId: '2',
        });
        await Promise.all([getOrderList(), getBalance()]);
    };

    const [bitoType, setBitoType] = useState('BUY');
    const [bitoPrice, setBitoPrice] = useState('');
    const [bitoAmount, setBitoAmount] = useState('0.0005');
    const bitoSubmit = async () => {
        await apiBitoOrder({
            action: bitoType,
            price: bitoPrice,
            amount: bitoAmount,
        });
        await Promise.all([getOrderList(), getBalance()]);
    };

    const [orderListAll, setOrderListAll] = useState({ ace: [], ace2: [], bito: [] });

    const cancelOrder = async (target: string, orderNo: string) => {
        let res;
        if (target === 'ace') res = await apiAceCancelOrder({ orderNo });
        else if (target === 'ace2') res = await apiAceCancelOrder2({ orderNo });
        else if (target === 'bito') res = await apiBitoCancelOrder(orderNo);

        if (res) await Promise.all([getOrderList(), getBalance()]);
    };

    return (
        <section className="bg-gray-500">
            {import.meta.env.DEV && (
                <>
                    <div>Max</div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>btc/twd</TableCell>
                                <TableCell>usdt/twd</TableCell>
                                <TableCell>btc/usdt</TableCell>
                                <TableCell>eth/usdt</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            <TableRow>
                                <TableCell>Last</TableCell>
                                {MAX_TABLE_LIST.map((item: MaxPriceListKeys) => {
                                    return (
                                        <TableCell key={item}>
                                            {ValueComponent(maxPriceList[item]?.last)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>Buy</TableCell>
                                {MAX_TABLE_LIST.map((item: MaxPriceListKeys) => {
                                    return (
                                        <TableCell key={item}>
                                            {ValueComponent(maxPriceList[item]?.buy)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>Sell</TableCell>
                                {MAX_TABLE_LIST.map((item: MaxPriceListKeys) => {
                                    return (
                                        <TableCell key={item}>
                                            {ValueComponent(maxPriceList[item]?.sell)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="mt-8">Ace</div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>btc/twd</TableCell>
                                <TableCell>usdt/twd</TableCell>
                                <TableCell>btc/usdt</TableCell>
                                <TableCell>eth/usdt</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Last</TableCell>
                                {ACE_TABLE_LIST.map((item: AcePriceListKeys) => {
                                    return (
                                        <TableCell key={item}>
                                            {ValueComponent(acePriceList[item]?.last_price)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>Buy</TableCell>
                                {ACE_TABLE_LIST.map((item: AcePriceListKeys) => {
                                    return (
                                        <TableCell key={item}>
                                            {ValueComponent(acePriceList[item]?.buy)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                            <TableRow>
                                <TableCell>Sell</TableCell>
                                {ACE_TABLE_LIST.map((item: AcePriceListKeys) => {
                                    return (
                                        <TableCell key={item}>
                                            {ValueComponent(acePriceList[item]?.sell)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="my-4">
                        <span>Bito</span>
                        <span className="mx-4">Buy: {ValueComponent(bitoPriceList.buy)}</span>
                        <span>Sell: {ValueComponent(bitoPriceList.sell)}</span>
                    </div>
                </>
            )}

            <div className="flex items-center gap-2">
                <BaseDatePicker
                    id="life-search-cost-start-date"
                    value={orderStartDate}
                    setValue={setOrderStartDate}
                    isValid={true}
                    setIsValid={() => ({})}
                    placeholder="下單日期起始"
                    wFull={false}
                />
                <Button variant="contained" onClick={getOrderList}>
                    查詢
                </Button>
            </div>

            <section>
                <span>Ace</span>
                <RadioGroup
                    className="!flex-row"
                    value={aceType}
                    onChange={e => setAceType(e.target.value)}
                >
                    <FormControlLabel value={'1'} control={<Radio size="small" />} label="買" />
                    <FormControlLabel value={'2'} control={<Radio size="small" />} label="賣" />
                </RadioGroup>
                <RadioGroup
                    className="!flex-row"
                    value={aceCurrency}
                    onChange={e => setAceCurrency(e.target.value)}
                >
                    <FormControlLabel value={'1'} control={<Radio size="small" />} label="TWD" />
                    <FormControlLabel value={'14'} control={<Radio size="small" />} label="USD" />
                </RadioGroup>
                <TextField
                    label="價格"
                    variant="outlined"
                    value={acePrice}
                    onChange={event => {
                        setAcePrice(event.target.value);
                    }}
                    size="small"
                />
                <TextField
                    label="數量"
                    variant="outlined"
                    value={aceAmount}
                    onChange={event => {
                        setAceAmount(event.target.value);
                    }}
                    size="small"
                />
                <Button variant="contained" onClick={aceSubmit}>
                    下單
                </Button>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>日期</TableCell>
                            <TableCell>價位</TableCell>
                            <TableCell>買/賣</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderListAll?.ace?.map((item: any) => {
                            return (
                                <TableRow
                                    key={item.tradeNo || item.orderNo}
                                    style={
                                        item.status === 2 ? { textDecoration: 'line-through' } : {}
                                    }
                                >
                                    <TableCell>{item.orderTime || item.tradeTime}</TableCell>
                                    <TableCell>{formatToThousand(item.price)}</TableCell>
                                    <TableCell>
                                        {String(item.buyOrSell) === '1'
                                            ? '買'
                                            : String(item.buyOrSell) === '2'
                                            ? '賣'
                                            : ''}
                                    </TableCell>
                                    <TableCell>
                                        {item.status !== 2 && (
                                            <Close
                                                className="cursor-pointer"
                                                onClick={() => cancelOrder('ace', item.orderNo)}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>

            <section>
                <span>Ace母</span>
                <RadioGroup
                    className="!flex-row"
                    value={ace2Type}
                    onChange={e => setAce2Type(e.target.value)}
                >
                    <FormControlLabel value={'1'} control={<Radio size="small" />} label="買" />
                    <FormControlLabel value={'2'} control={<Radio size="small" />} label="賣" />
                </RadioGroup>
                <TextField
                    label="價格"
                    variant="outlined"
                    value={ace2Price}
                    onChange={event => {
                        setAce2Price(event.target.value);
                    }}
                    size="small"
                />
                <TextField
                    label="數量"
                    variant="outlined"
                    value={ace2Amount}
                    onChange={event => {
                        setAce2Amount(event.target.value);
                    }}
                    size="small"
                />
                <Button variant="contained" onClick={ace2Submit}>
                    下單
                </Button>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>日期</TableCell>
                            <TableCell>價位</TableCell>
                            <TableCell>買/賣</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderListAll?.ace2?.map((item: any) => {
                            return (
                                <TableRow
                                    key={item.tradeNo || item.orderNo}
                                    style={
                                        item.status === 2 ? { textDecoration: 'line-through' } : {}
                                    }
                                >
                                    <TableCell>{item.orderTime || item.tradeTime}</TableCell>
                                    <TableCell>{formatToThousand(item.price)}</TableCell>
                                    <TableCell>
                                        {String(item.buyOrSell) === '1'
                                            ? '買'
                                            : String(item.buyOrSell) === '2'
                                            ? '賣'
                                            : ''}
                                    </TableCell>
                                    <TableCell>
                                        {item.status !== 2 && (
                                            <Close
                                                className="cursor-pointer"
                                                onClick={() => cancelOrder('ace2', item.orderNo)}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>

            <section>
                <span>Bito</span>
                <RadioGroup
                    className="!flex-row"
                    value={bitoType}
                    onChange={e => setBitoType(e.target.value)}
                >
                    <FormControlLabel value={'BUY'} control={<Radio size="small" />} label="買" />
                    <FormControlLabel value={'SELL'} control={<Radio size="small" />} label="賣" />
                </RadioGroup>
                <TextField
                    label="價格"
                    variant="outlined"
                    value={bitoPrice}
                    onChange={event => {
                        setBitoPrice(event.target.value);
                    }}
                    size="small"
                />
                <TextField
                    label="數量"
                    variant="outlined"
                    value={bitoAmount}
                    onChange={event => {
                        setBitoAmount(event.target.value);
                    }}
                    size="small"
                />
                <Button variant="contained" onClick={bitoSubmit}>
                    下單
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>日期</TableCell>
                            <TableCell>價位</TableCell>
                            <TableCell>買/賣</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderListAll?.bito?.map((item: any) => {
                            return (
                                <TableRow
                                    key={item.id}
                                    style={
                                        item.status === 2 ? { textDecoration: 'line-through' } : {}
                                    }
                                >
                                    <TableCell>{formatDateTime(item.updatedTimestamp)}</TableCell>
                                    <TableCell>{formatToThousand(item.price)}</TableCell>
                                    <TableCell>{item.action}</TableCell>
                                    <TableCell>
                                        {item.status === 0 && (
                                            <Close
                                                className="cursor-pointer"
                                                onClick={() => cancelOrder('bito', item.id)}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>

            <section className="mt-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>錢包</TableCell>
                            <TableCell>BTC</TableCell>
                            <TableCell>TWD</TableCell>
                            <TableCell>USDT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Ace</TableCell>
                            <TableCell>
                                {wallet.ace?.find(item => item.currencyName === 'BTC')?.cashAmount}
                            </TableCell>
                            <TableCell>
                                {wallet.ace?.find(item => item.currencyName === 'TWD')?.cashAmount}
                            </TableCell>
                            <TableCell>
                                {wallet.ace?.find(item => item.currencyName === 'USDT')?.cashAmount}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ace2</TableCell>
                            <TableCell>
                                {wallet.ace2?.find(item => item.currencyName === 'BTC')?.cashAmount}
                            </TableCell>
                            <TableCell>
                                {wallet.ace2?.find(item => item.currencyName === 'TWD')?.cashAmount}
                            </TableCell>
                            <TableCell>
                                {
                                    wallet.ace2?.find(item => item.currencyName === 'USDT')
                                        ?.cashAmount
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Bito</TableCell>
                            <TableCell>
                                {wallet.bito?.find(item => item.currency === 'btc')?.available}
                            </TableCell>
                            <TableCell>
                                {wallet.bito?.find(item => item.currency === 'twd')?.available}
                            </TableCell>
                            <TableCell>
                                {wallet.bito?.find(item => item.currency === 'usdt')?.available}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </section>
        </section>
    );
};

export default PriceList;
