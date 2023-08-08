import { useEffect, useMemo, useState, useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { formatDate, formatDateTime } from '@/utils/format';
import { toXLSX } from '@/utils/toExcel';
import { apiGetNavList, StockListRes, DividendListRes } from '@/api/stock';
import { TRADE_TAX_RATE, TRADE_ETF_TAX_RATE, FEE_RATE } from '@/config/constant';

import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Skeleton,
    CircularProgress,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import SearchBar from './SearchBar';

type Props = {
    stockList: StockListRes['list'];
    isLoadingStockList: boolean;
    dividendList: DividendListRes['list'];
};

const Summary = ({ stockList, isLoadingStockList, dividendList }: Props) => {
    const nodeRef = useRef(null);
    const twseDate = useAppSelector(state => state.stock.twseDate);
    const tpexDate = useAppSelector(state => state.stock.tpexDate);

    // Nav List
    const navList = useAppSelector(state => state.stock.navList);
    const [isLoadingNavList, setIsLoadingNavList] = useState(false);
    useEffect(() => {
        const getNavList = async () => {
            setIsLoadingNavList(true);
            await apiGetNavList();
            setIsLoadingNavList(false);
        };
        if (Object.keys(navList).length === 0) getNavList();
    }, [navList]);

    // Download
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const download = async () => {
        setIsLoadingDownload(true);
        const result: Array<{ [key: string]: string | number }> = [];
        resultList.inStockList.forEach(item => {
            item.details.forEach(detail => {
                result.push({
                    代碼: detail.itemCode,
                    名稱: detail.itemName,
                    購買日: formatDate(detail.tradeDate),
                    購買價格: detail.price,
                    購買成本: detail.dollar,
                    購買股數: detail.amount,
                });
            });
        });
        resultList.settleList.forEach(item => {
            result.push({
                代碼: item.itemCode,
                名稱: item.itemName,
                購買日: formatDate(item.tradeDate),
                購買價格: item.price,
                購買成本: item.dollar,
                購買股數: item.amount,
                售出日: formatDate(item.sellDate),
                售出價格: item.sellPrice,
                淨收: item.sellDollar,
                盈虧: item.sellDollar - item.dollar,
            });
        });
        toXLSX(result, {
            sheetName: '股票清單',
            fileName: `股票清單${formatDate(new Date())}`,
        });
        setIsLoadingDownload(false);
    };

    // Search
    const [itemName, setItemName] = useState('');
    const [buyStartDate, setBuyStartDate] = useState<null | Date>(null);
    const [buyEndDate, setBuyEndDate] = useState<null | Date>(null);
    const [sellStartDate, setSellStartDate] = useState<null | Date>(null);
    const [sellEndDate, setSellEndDate] = useState<null | Date>(null);

    // Show list
    type InStockItem = {
        itemCode: string;
        itemName: string;
        tradeDate: number | string;
        price: string;
        dollar: number;
        amount: number;
        details: Array<{ [key: string]: string | number }>;
        lastPrice: string;
        lastDollar: number;
        lastProfit: number;
        dividend: number;
    };
    type SettleItem = {
        itemCode: string;
        itemName: string;
        tradeDate: number | string;
        price: string;
        dollar: number;
        amount: number;
        sellDate: number;
        sellPrice: string;
        sellDollar: number;
        sellAmount: number;
        profit: number;
        dividend: number;
    };
    const resultList = useMemo(() => {
        let result = [];
        const inventory = [];
        const groupedRecords = [...stockList]
            .sort((a, b) => a.tradeDate - b.tradeDate)
            .reduce((acc, record) => {
                if (!acc[record.itemCode]) acc[record.itemCode] = [];
                acc[record.itemCode].push(record);
                return acc;
            }, {} as { [key: string]: StockListRes['list'] });

        for (const code in groupedRecords) {
            const recordItem = groupedRecords[code];
            if (recordItem.length === 1) {
                inventory.push({ ...recordItem[0], dividend: 0 });
                continue;
            }

            let buyRecords = [] as StockListRes['list'];

            for (const record of recordItem) {
                const { itemName, itemCode, itemType, tradeDate, dollar, amount, price } = record;
                let lastAmt = amount;
                let lastDollar = dollar;

                if (itemType === 'buy' || itemType === 'allotment') {
                    buyRecords.push(record);
                } else if (itemType === 'sell') {
                    // 零股處理
                    if (lastAmt % 1000 !== 0) {
                        const target = buyRecords.find(item => item.amount === lastAmt);
                        buyRecords = buyRecords.filter(item => item !== target);
                        result.push({
                            itemCode,
                            itemName,
                            tradeDate: target?.tradeDate,
                            price: target?.price,
                            dollar: target?.dollar,
                            amount: target?.amount,
                            sellDate: tradeDate,
                            sellPrice: price,
                            sellDollar: lastDollar,
                            sellAmount: lastAmt,
                            dividend: 0,
                            profit: lastDollar - Number(target?.dollar),
                        });
                        continue;
                    }

                    for (let j = 0; j < buyRecords.length; j++) {
                        const buyRecord = buyRecords[j];

                        // 零股處理
                        if (buyRecord.amount % 1000 !== 0) continue;

                        if (buyRecord.amount === lastAmt) {
                            buyRecords = buyRecords.filter(item => item !== buyRecord);
                            result.push({
                                itemCode,
                                itemName,
                                tradeDate: buyRecord.tradeDate,
                                price: buyRecord.price,
                                dollar: buyRecord.dollar,
                                amount: buyRecord.amount,
                                sellDate: tradeDate,
                                sellPrice: price,
                                sellDollar: lastDollar,
                                sellAmount: lastAmt,
                                dividend: 0,
                                profit: lastDollar - buyRecord.dollar,
                            });
                            break;
                        } else if (buyRecord.amount < lastAmt) {
                            buyRecords = buyRecords.filter(item => item !== buyRecord);
                            result.push({
                                itemCode,
                                itemName,
                                tradeDate: buyRecord.tradeDate,
                                price: buyRecord.price,
                                dollar: buyRecord.dollar,
                                amount: buyRecord.amount,
                                sellDate: tradeDate,
                                sellPrice: price,
                                sellDollar: (lastDollar / lastAmt) * buyRecord.amount,
                                sellAmount: buyRecord.amount,
                                dividend: 0,
                                profit:
                                    (lastDollar / lastAmt) * buyRecord.amount - buyRecord.dollar,
                            });

                            lastDollar = lastDollar - (lastDollar / lastAmt) * buyRecord.amount;
                            lastAmt = lastAmt - buyRecord.amount;
                            j--;
                            continue;
                        } else {
                            buyRecords = buyRecords.filter(item => item !== buyRecord);
                            buyRecords.unshift({
                                ...buyRecord,
                                amount: buyRecord.amount - lastAmt,
                                dollar:
                                    (buyRecord.dollar / buyRecord.amount) *
                                    (buyRecord.amount - lastAmt),
                            });
                            result.push({
                                itemCode,
                                itemName,
                                tradeDate: buyRecord.tradeDate,
                                price: buyRecord.price,
                                dollar: (buyRecord.dollar / buyRecord.amount) * lastAmt,
                                amount: lastAmt,
                                sellDate: tradeDate,
                                sellPrice: price,
                                sellDollar: lastDollar,
                                sellAmount: lastAmt,
                                dividend: 0,
                                profit:
                                    lastDollar - (buyRecord.dollar / buyRecord.amount) * lastAmt,
                            });
                            break;
                        }
                    }
                }
            }

            buyRecords.forEach(item => {
                inventory.push({ ...item, dividend: 0 });
            });
        }

        result = result
            .filter(item => {
                const nameFilter =
                    String(item.itemName).includes(itemName) || item.itemCode.includes(itemName);
                const buyStartDateFilter = buyStartDate
                    ? buyStartDate.valueOf() <= Number(item.tradeDate)
                    : true;
                const buyEndDateFilter = buyEndDate
                    ? buyEndDate.valueOf() >= Number(item.tradeDate)
                    : true;
                const sellStartDateFilter = sellStartDate
                    ? sellStartDate.valueOf() <= Number(item.sellDate)
                    : true;
                const sellEndDateFilter = sellEndDate
                    ? sellEndDate.valueOf() >= Number(item.sellDate)
                    : true;
                return (
                    nameFilter &&
                    buyStartDateFilter &&
                    buyEndDateFilter &&
                    sellStartDateFilter &&
                    sellEndDateFilter
                );
            })
            .sort((a, b) => b.sellDate - a.sellDate || Number(b.tradeDate) - Number(a.tradeDate));

        // 目前庫存
        const inStock = Object.values(
            Object.values(inventory)
                .filter(item => {
                    const nameFilter = item.itemName.includes(itemName);
                    const buyStartDateFilter = buyStartDate
                        ? buyStartDate.valueOf() <= item.tradeDate
                        : true;
                    const buyEndDateFilter = buyEndDate
                        ? buyEndDate.valueOf() >= item.tradeDate
                        : true;
                    const sellStartDateFilter = !sellStartDate;
                    const sellEndDateFilter = !sellEndDate;
                    return (
                        nameFilter &&
                        buyStartDateFilter &&
                        buyEndDateFilter &&
                        sellStartDateFilter &&
                        sellEndDateFilter
                    );
                })
                .reduce((acc, curr) => {
                    const taxType = navList[curr.itemCode]?.etf
                        ? TRADE_ETF_TAX_RATE
                        : TRADE_TAX_RATE;
                    const fee = Math.floor(
                        Number(navList[curr.itemCode]?.price) * curr.amount * FEE_RATE
                    );
                    const tax = Math.floor(
                        Number(navList[curr.itemCode]?.price) * curr.amount * taxType
                    );
                    const currentFee = fee + tax;
                    if (!acc[curr.itemCode]) {
                        acc[curr.itemCode] = {
                            ...curr,
                            details: [{ ...curr, totalFee: currentFee }],
                            lastPrice: navList[curr.itemCode]?.price,
                            lastDollar:
                                Number(navList[curr.itemCode]?.price) * curr.amount - currentFee,
                            lastProfit:
                                Number(navList[curr.itemCode]?.price) * curr.amount -
                                currentFee -
                                curr.dollar,
                        };
                    } else {
                        const newAmt = acc[curr.itemCode].amount + curr.amount;
                        acc[curr.itemCode].price = (
                            (Number(acc[curr.itemCode].price) * acc[curr.itemCode].amount +
                                Number(curr.price) * curr.amount) /
                            newAmt
                        ).toFixed(2);
                        acc[curr.itemCode].dollar += curr.dollar;
                        acc[curr.itemCode].amount += curr.amount;
                        acc[curr.itemCode].tradeDate = '';
                        acc[curr.itemCode].details?.push({ ...curr, totalFee: currentFee });
                        const totalFee = acc[curr.itemCode].details?.reduce(
                            (acc, current) => acc + Number(current.totalFee),
                            0
                        );
                        acc[curr.itemCode].lastDollar =
                            Number(acc[curr.itemCode].lastPrice) * newAmt - totalFee;
                        acc[curr.itemCode].lastProfit =
                            Number(acc[curr.itemCode].lastPrice) * newAmt -
                            totalFee -
                            acc[curr.itemCode].dollar;
                    }
                    return acc;
                }, {} as { [key: string]: InStockItem })
        ).sort((a, b) => Number(b.tradeDate) - Number(a.tradeDate));

        // 配息處理
        const dividendRecord = [...dividendList].sort(
            (a, b) => a.exDividendDate - b.exDividendDate
        );
        for (let i = 0; i < dividendRecord.length; i++) {
            const { itemCode, dollar, amount, exDividendDate } = dividendRecord[i];
            let lastAmt = amount;
            let lastDollar = dollar;
            let done = false;

            for (let j = result.length - 1; j >= 0; j--) {
                const codeFilter = result[j].itemCode === itemCode;
                const dateBuyFilter = Number(result[j].tradeDate) < exDividendDate;
                const dateSellFilter = Number(result[j].sellDate) >= exDividendDate;
                if (codeFilter && dateBuyFilter && dateSellFilter) {
                    if (result[j].amount === lastAmt) {
                        result[j].dividend += lastDollar;
                        done = true;
                        break;
                    } else if (Number(result[j].amount) < lastAmt) {
                        result[j].dividend += (lastDollar / lastAmt) * Number(result[j].amount);
                        lastDollar = lastDollar - (lastDollar / lastAmt) * Number(result[j].amount);
                        lastAmt = lastAmt - Number(result[j].amount);
                        continue;
                    }
                }
            }

            if (done) continue;

            for (let j = inStock.length - 1; j >= 0; j--) {
                const codeFilter = inStock[j].itemCode === itemCode;
                const dateBuyFilter = Number(inStock[j].tradeDate) < exDividendDate;
                if (codeFilter && dateBuyFilter) {
                    inStock[j].dividend += lastDollar;
                }
            }
        }

        // 算總和
        const totalProfit = result.reduce((acc, current) => acc + Number(current.profit || 0), 0);
        const totalLast = Object.values(inStock).reduce((acc, current) => acc + current.dollar, 0);
        const currentProfit = Object.values(inStock).reduce(
            (acc, current) => acc + Number(current.lastProfit || 0),
            0
        );

        return {
            inStockList: inStock,
            settleList: result as Array<SettleItem>,
            totalProfit,
            totalLast,
            currentProfit,
        };
    }, [
        stockList,
        navList,
        itemName,
        buyStartDate,
        buyEndDate,
        sellStartDate,
        sellEndDate,
        dividendList,
    ]);

    return (
        <>
            <div className="my-2 text-right">
                <Button variant="contained" onClick={download} disabled={isLoadingDownload}>
                    <Download className="!text-base" />
                    下載
                </Button>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <h2 className="text-xl text-blue-500">庫存</h2>
                {twseDate && (
                    <span>
                        {String(formatDateTime(twseDate)).slice(5, -3)} /{' '}
                        {String(formatDateTime(tpexDate)).slice(5, -3)}
                    </span>
                )}
            </div>

            <SearchBar
                itemName={itemName}
                setItemName={setItemName}
                buyStartDate={buyStartDate}
                setBuyStartDate={setBuyStartDate}
                buyEndDate={buyEndDate}
                setBuyEndDate={setBuyEndDate}
                sellStartDate={sellStartDate}
                setSellStartDate={setSellStartDate}
                sellEndDate={sellEndDate}
                setSellEndDate={setSellEndDate}
            />

            <SwitchTransition>
                <CSSTransition
                    key={isLoadingStockList ? '1' : isLoadingNavList ? '2' : '3'}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="page"
                    unmountOnExit
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow ref={nodeRef}>
                                <TableCell>名稱</TableCell>
                                <TableCell>目前價格</TableCell>
                                <TableCell>購買日</TableCell>
                                <TableCell>購買價格</TableCell>
                                <TableCell align="right">
                                    購買成本
                                    <br />
                                    {resultList.totalLast
                                        ? Number(resultList.totalLast?.toFixed()).toLocaleString()
                                        : ''}
                                </TableCell>
                                <TableCell>購買股數</TableCell>
                                <TableCell>淨收</TableCell>
                                <TableCell align="right">
                                    目前盈虧
                                    <br />
                                    {resultList.currentProfit ? (
                                        Number(resultList.currentProfit?.toFixed()).toLocaleString()
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell>報酬率</TableCell>
                                <TableCell align="right">配息</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoadingStockList ? (
                                <TableRow ref={nodeRef}>
                                    <TableCell colSpan={9} align="center" height={'600px'}>
                                        <CircularProgress sx={{ color: '#005598' }} size={60} />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                resultList?.inStockList?.map((item, index) => {
                                    return (
                                        <TableRow
                                            ref={nodeRef}
                                            key={index}
                                            className={`${
                                                Number(item.lastProfit) > 0
                                                    ? 'bg-red-100'
                                                    : Number(item.lastProfit) <= 0
                                                    ? 'bg-green-100'
                                                    : ''
                                            }`}
                                        >
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell>
                                                {isLoadingNavList ? <Skeleton /> : item.lastPrice}
                                            </TableCell>
                                            <TableCell>
                                                {Number(item.details?.length) > 1 &&
                                                    item.details?.map((detail, detailIndex) => {
                                                        return (
                                                            <div key={detailIndex}>
                                                                {formatDate(detail.tradeDate)}
                                                            </div>
                                                        );
                                                    })}
                                                {formatDate(item.tradeDate)}
                                                <br />
                                            </TableCell>
                                            <TableCell align="right">
                                                {Number(item.details?.length) > 1 &&
                                                    item.details?.map((detail, detailIndex) => {
                                                        return (
                                                            <div key={detailIndex}>
                                                                {detail.price}
                                                            </div>
                                                        );
                                                    })}
                                                {item.price}
                                                <br />
                                            </TableCell>
                                            <TableCell align="right">
                                                {Number(item.details?.length) > 1 &&
                                                    item.details?.map((detail, detailIndex) => {
                                                        return (
                                                            <div key={detailIndex}>
                                                                {detail.dollar?.toLocaleString()}
                                                            </div>
                                                        );
                                                    })}
                                                {item.dollar?.toLocaleString()}
                                                <br />
                                            </TableCell>
                                            <TableCell align="right">
                                                {Number(item.details?.length) > 1 &&
                                                    item.details?.map((detail, detailIndex) => {
                                                        return (
                                                            <div key={detailIndex}>
                                                                {detail.amount?.toLocaleString()}
                                                            </div>
                                                        );
                                                    })}
                                                {item.amount?.toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                {isLoadingNavList ? (
                                                    <Skeleton />
                                                ) : (
                                                    Number(
                                                        item.lastDollar.toFixed()
                                                    ).toLocaleString()
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {isLoadingNavList ? (
                                                    <Skeleton />
                                                ) : (
                                                    Number(
                                                        item.lastProfit.toFixed()
                                                    ).toLocaleString()
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {isLoadingNavList ? (
                                                    <Skeleton />
                                                ) : (
                                                    `${(
                                                        (item.lastProfit / item.dollar) *
                                                        100
                                                    ).toFixed(2)}%`
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {(
                                                    Math.round(item.dividend * 100) / 100
                                                )?.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CSSTransition>
            </SwitchTransition>

            <h2 className="mt-12 text-xl text-blue-500">已實現</h2>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>名稱</TableCell>
                        <TableCell>目前價格</TableCell>
                        <TableCell>購買日</TableCell>
                        <TableCell>購買價格</TableCell>
                        <TableCell>購買成本</TableCell>
                        <TableCell>購買股數</TableCell>
                        <TableCell>售出日</TableCell>
                        <TableCell>售出價格</TableCell>
                        <TableCell>淨收</TableCell>
                        <TableCell align="right">
                            盈虧
                            <br />
                            {resultList.totalProfit ? resultList.totalProfit?.toLocaleString() : ''}
                        </TableCell>
                        <TableCell align="right">配息</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {resultList?.settleList?.map((item, index) => {
                        return (
                            <TableRow
                                key={index}
                                className={`${
                                    Number(item.profit) > 0
                                        ? 'bg-red-100'
                                        : Number(item.profit) <= 0
                                        ? 'bg-green-100'
                                        : ''
                                }`}
                            >
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{navList?.[item.itemCode]?.price}</TableCell>
                                <TableCell>{formatDate(item.tradeDate)}</TableCell>
                                <TableCell align="right"> {item.price}</TableCell>
                                <TableCell align="right">{item.dollar?.toLocaleString()}</TableCell>
                                <TableCell align="right">{item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{formatDate(item.sellDate || '')}</TableCell>
                                <TableCell align="right">{item.sellPrice}</TableCell>
                                <TableCell align="right">
                                    {item.sellDollar?.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    {item.profit?.toLocaleString()}
                                    <br />
                                    {((item.profit / item.dollar) * 100).toFixed(2)}%
                                    <br />
                                    {(
                                        ((item.profit / item.dollar) * 100 * 365) /
                                        ((new Date(item.sellDate).valueOf() -
                                            new Date(item.tradeDate).valueOf()) /
                                            86400000)
                                    ).toFixed(2)}
                                    %
                                </TableCell>
                                <TableCell align="right">
                                    {(Math.round(item.dividend * 100) / 100)?.toLocaleString()}
                                    <br />
                                    {(((item.profit + item.dividend) / item.dollar) * 100).toFixed(
                                        2
                                    )}
                                    %
                                    <br />
                                    {(
                                        (((item.profit + item.dividend) / item.dollar) *
                                            100 *
                                            365) /
                                        ((new Date(item.sellDate).valueOf() -
                                            new Date(item.tradeDate).valueOf()) /
                                            86400000)
                                    ).toFixed(2)}
                                    %
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default Summary;
