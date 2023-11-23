import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { apiGetMaxCryptoPrice, MaxPriceList } from '@/api/crypto';
import { formatToThousand } from '@/utils/format';

import { Table, TableHead, TableRow, TableCell, TableBody, Skeleton } from '@mui/material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const PriceList = () => {
    const INTERVAL = 50000;
    const nodeRef = useRef(null);
    const [maxPriceList, setMaxPriceList] = useState({} as MaxPriceList);
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);

    const getPrice = useCallback(async () => {
        setIsLoadingPrice(true);
        const res = await apiGetMaxCryptoPrice();
        if (res) setMaxPriceList(res);
        setIsLoadingPrice(false);
    }, []);

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
        // TODO
        const buyAce = 1182000;
        const sellAce = 1183000;
        const buyMax = Number(maxPriceList['btctwd']?.buy);
        const sellMax = Number(maxPriceList['btctwd']?.sell);
        const diffA = sellAce - buyMax;
        const diffB = sellMax - buyAce;
        if (diffA >= diffB) {
            return { text: 'Ace買 Max賣', value: diffA ? `${(diffA / sellAce) * 100}%` : '' };
        }
        return { text: 'Ace賣 Max買', value: diffB ? `${(diffB / sellMax) * 100}%` : '' };
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
        </section>
    );
};

export default PriceList;
