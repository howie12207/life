import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    apiGetMaxCryptoPrice,
    MaxPriceList,
    apiGetAceCryptoPrice,
    apiGetAceCryptoBook,
    AcePriceList,
    AceBook,
} from '@/api/crypto';
import { formatToThousand } from '@/utils/format';

import { Table, TableHead, TableRow, TableCell, TableBody, Skeleton } from '@mui/material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

type AcePriceListKeys = keyof AcePriceList;

const PriceList = () => {
    const INTERVAL = 50000;
    const nodeRef = useRef(null);
    const nodeRef2 = useRef(null);
    const [maxPriceList, setMaxPriceList] = useState({} as MaxPriceList);
    const [acePriceList, setAcePriceList] = useState({} as AcePriceList);
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
        ] = await Promise.all([
            apiGetMaxCryptoPrice(),
            apiGetAceCryptoPrice(),
            apiGetAceCryptoBook(2, 1),
            apiGetAceCryptoBook(4, 1),
            apiGetAceCryptoBook(2, 14),
            apiGetAceCryptoBook(4, 14),
            apiGetAceCryptoBook(14, 1),
        ]);
        if (resMax) setMaxPriceList(resMax);
        if (resAcePrice) setAcePriceList(resAcePrice);
        if (resAceBTCTWD) handleAceBook('BTC/TWD', resAceBTCTWD);
        if (resAceETHTWD) handleAceBook('ETH/TWD', resAceETHTWD);
        if (resAceBTCUSDT) handleAceBook('BTC/USDT', resAceBTCUSDT);
        if (resAceETHUSDT) handleAceBook('ETH/USDT', resAceETHUSDT);
        if (resAceUSDTTWD) handleAceBook('USDT/TWD', resAceUSDTTWD);
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

    useEffect(() => {
        getPrice();
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

    const btctwdCompare = useMemo(() => {
        const buyAceBTCTWD = Number(acePriceList['BTC/TWD']?.buy);
        const sellAceBTCTWD = Number(acePriceList['BTC/TWD']?.sell);
        const buyMaxBTCTWD = Number(maxPriceList['btctwd']?.buy);
        const sellMaxBTCTWD = Number(maxPriceList['btctwd']?.sell);
        const diffA = sellAceBTCTWD - buyMaxBTCTWD;
        const diffB = sellMaxBTCTWD - buyAceBTCTWD;
        if (diffA >= diffB) {
            return {
                text: 'BTCTWD Ace買 Max賣',
                value: diffA ? `${(diffA / sellAceBTCTWD) * 100}%` : '',
            };
        }
        return {
            text: 'BTCTWD Ace賣 Max買',
            value: diffB ? `${(diffB / sellMaxBTCTWD) * 100}%` : '',
        };
    }, [maxPriceList]);
    return (
        <section>
            <>
                {btctwdCompare?.text}
                {btctwdCompare?.value}
            </>

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
                    {/* </CSSTransition>
                    </SwitchTransition> */}
                </Table>
            </>
        </section>
    );
};

export default PriceList;
