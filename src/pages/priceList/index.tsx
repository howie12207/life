import { useState, useEffect, useCallback, useRef } from 'react';
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
} from '@/api/crypto';
import { formatToThousand, formatDateTime } from '@/utils/format';

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

type AcePriceListKeys = keyof AcePriceList;
type BitoPriceList = {
    buy: '';
    sell: '';
};

const PriceList = () => {
    const INTERVAL = 50000;
    const nodeRef = useRef(null);
    const nodeRef2 = useRef(null);
    const [maxPriceList, setMaxPriceList] = useState({} as MaxPriceList);
    const [acePriceList, setAcePriceList] = useState({} as AcePriceList);
    const [bitoPriceList, setBitoPriceList] = useState({} as BitoPriceList);
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);

    const getPrice = useCallback(async () => {
        setIsLoadingPrice(true);
        const [
            resMax,
            resAcePrice,
            resAceBTCTWD,
            resAceETHTWD,
            resAceBTCUSDT,
            resAceETHUSDT,
            resAceUSDTTWD,
            resBitoBTCTWD,
        ] = await Promise.all([
            apiGetMaxCryptoPrice(),
            apiGetAceCryptoPrice(),
            apiGetAceCryptoBook(2, 1),
            apiGetAceCryptoBook(4, 1),
            apiGetAceCryptoBook(2, 14),
            apiGetAceCryptoBook(4, 14),
            apiGetAceCryptoBook(14, 1),
            apiGetBitoCryptoBook(),
        ]);
        if (resMax) setMaxPriceList(resMax);
        if (resAcePrice) setAcePriceList(resAcePrice);
        if (resAceBTCTWD) handleAceBook('BTC/TWD', resAceBTCTWD);
        if (resAceETHTWD) handleAceBook('ETH/TWD', resAceETHTWD);
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

    const getOrderList = useCallback(async () => {
        setIsLoadingPrice(true);
        const orderList = await apiOrderListAll();
        setOrderListAll(orderList);
        setIsLoadingPrice(false);
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

    const renderRef = useRef(false);
    useEffect(() => {
        if (renderRef.current) return;
        renderRef.current = true;
        getPrice();
        getOrderList();
        let timer: ReturnType<typeof setTimeout> = setInterval(() => {
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
        return isLoadingPrice ? <Skeleton /> : <span>{formatToThousand(value)}</span>;
    };

    // const btctwdCompare = useMemo(() => {
    //     const buyAceBTCTWD = Number(acePriceList['BTC/TWD']?.buy);
    //     const sellAceBTCTWD = Number(acePriceList['BTC/TWD']?.sell);
    //     const buyMaxBTCTWD = Number(maxPriceList['btctwd']?.buy);
    //     const sellMaxBTCTWD = Number(maxPriceList['btctwd']?.sell);
    //     const diffA = sellAceBTCTWD - buyMaxBTCTWD;
    //     const diffB = sellMaxBTCTWD - buyAceBTCTWD;
    //     if (diffA >= diffB) {
    //         return {
    //             text: 'BTCTWD Ace買 Max賣',
    //             value: diffA ? `${(diffA / sellAceBTCTWD) * 100}%` : '',
    //         };
    //     }
    //     return {
    //         text: 'BTCTWD Ace賣 Max買',
    //         value: diffB ? `${(diffB / sellMaxBTCTWD) * 100}%` : '',
    //     };
    // }, [maxPriceList]);

    const [aceType, setAceType] = useState('1');
    const [acePrice, setAcePrice] = useState('');
    const [aceAmount, setAceAmount] = useState('0.001');
    const aceSubmit = async () => {
        await apiAceOrder({
            buyOrSell: aceType,
            price: acePrice,
            num: aceAmount,
            quoteCurrencyId: '1',
            baseCurrencyId: '2',
        });
    };

    const [ace2Type, setAce2Type] = useState('1');
    const [ace2Price, setAce2Price] = useState('');
    const [ace2Amount, setAce2Amount] = useState('0.001');
    const ace2Submit = async () => {
        await apiAceOrder2({
            buyOrSell: ace2Type,
            price: ace2Price,
            num: ace2Amount,
            quoteCurrencyId: '14',
            baseCurrencyId: '2',
        });
    };

    const [bitoType, setBitoType] = useState('BUY');
    const [bitoPrice, setBitoPrice] = useState('');
    const [bitoAmount, setBitoAmount] = useState('0.001');
    const bitoSubmit = async () => {
        await apiBitoOrder({
            action: bitoType,
            price: bitoPrice,
            amount: bitoAmount,
        });
    };

    const [orderListAll, setOrderListAll] = useState({ ace: [], ace2: [], bito: [] });

    const cancelOrder = async (target: string, orderNo: string) => {
        let res;
        if (target === 'ace') res = await apiAceCancelOrder({ orderNo });
        else if (target === 'ace2') res = await apiAceCancelOrder2({ orderNo });
        else if (target === 'bito') res = await apiBitoCancelOrder(orderNo);

        if (res) await getOrderList();
    };

    return (
        <section>
            {/* <>
                {btctwdCompare?.text}
                {btctwdCompare?.value}
            </> */}

            <>
                <div>Max</div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>btc/twd</TableCell>
                            <TableCell>eth/twd</TableCell>
                            <TableCell>usdt/twd</TableCell>
                            <TableCell>btc/usdt</TableCell>
                            <TableCell>eth/usdt</TableCell>
                        </TableRow>
                    </TableHead>
                    <SwitchTransition>
                        <CSSTransition
                            key={isLoadingPrice ? 'loading' : 'data'}
                            nodeRef={nodeRef}
                            timeout={300}
                            classNames="page"
                        >
                            <TableBody ref={nodeRef}>
                                <TableRow>
                                    <TableCell>Last</TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['btctwd']?.last)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['ethtwd']?.last)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['usdttwd']?.last)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['btcusdt']?.last)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['ethusdt']?.last)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Buy</TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['btctwd']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['ethtwd']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['usdttwd']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['btcusdt']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['ethusdt']?.buy)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sell</TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['btctwd']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['ethtwd']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['usdttwd']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['btcusdt']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(maxPriceList['ethusdt']?.sell)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </CSSTransition>
                    </SwitchTransition>
                </Table>
            </>

            <>
                <div className="mt-8">Ace</div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>btc/twd</TableCell>
                            <TableCell>eth/twd</TableCell>
                            <TableCell>usdt/twd</TableCell>
                            <TableCell>btc/usdt</TableCell>
                            <TableCell>eth/usdt</TableCell>
                        </TableRow>
                    </TableHead>
                    <SwitchTransition>
                        <CSSTransition
                            key={isLoadingPrice ? 'loading' : 'data'}
                            nodeRef={nodeRef2}
                            timeout={300}
                            classNames="page"
                        >
                            <TableBody ref={nodeRef2}>
                                <TableRow>
                                    <TableCell>Last</TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['BTC/TWD']?.last_price)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['ETH/TWD']?.last_price)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['USDT/TWD']?.last_price)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['BTC/USDT']?.last_price)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['ETH/USDT']?.last_price)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Buy</TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['BTC/TWD']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['ETH/TWD']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['USDT/TWD']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['BTC/USDT']?.buy)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['ETH/USDT']?.buy)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sell</TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['BTC/TWD']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['ETH/TWD']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['USDT/TWD']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['BTC/USDT']?.sell)}
                                    </TableCell>
                                    <TableCell>
                                        {ValueComponent(acePriceList['ETH/USDT']?.sell)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </CSSTransition>
                    </SwitchTransition>
                </Table>
            </>

            <div className="my-4">
                <span>Bito</span>
                <span className="mx-4">Buy: {formatToThousand(bitoPriceList.buy)}</span>
                <span>Sell: {formatToThousand(bitoPriceList.sell)}</span>
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
                                <TableRow key={item.uid}>
                                    <TableCell>{item.orderTime}</TableCell>
                                    <TableCell>{formatToThousand(item.price)}</TableCell>
                                    <TableCell>
                                        {String(item.buyOrSell) === '1'
                                            ? '買'
                                            : String(item.buyOrSell) === '2'
                                            ? '賣'
                                            : ''}
                                    </TableCell>
                                    <TableCell>
                                        <Close
                                            className="cursor-pointer"
                                            onClick={() => cancelOrder('ace', item.orderNo)}
                                        />
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
                                    key={item.uid}
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
        </section>
    );
};

export default PriceList;
