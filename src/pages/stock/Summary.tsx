import { useEffect, useMemo, useState, useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { formatDate, formatDateTime } from '@/utils/format';
import { toXLSX } from '@/utils/toExcel';
import { apiGetNavList, StockListRes } from '@/api/stock';

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

type Props = {
    stockList: StockListRes['list'];
    isLoadingStockList: boolean;
};

const FEE = 0.995575;

const Summary = ({ stockList, isLoadingStockList }: Props) => {
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
    };
    const resultList = useMemo(() => {
        const result = [];
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
                inventory.push(recordItem[0]);
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
                                profit:
                                    lastDollar - (buyRecord.dollar / buyRecord.amount) * lastAmt,
                            });
                            break;
                        }
                    }
                }
            }

            buyRecords.forEach(item => {
                inventory.push(item);
            });
        }

        // 目前庫存
        const inStock = Object.values(inventory).reduce((acc, curr) => {
            if (!acc[curr.itemCode])
                acc[curr.itemCode] = {
                    ...curr,
                    details: [{ ...curr }],
                    lastPrice: navList[curr.itemCode]?.price,
                    lastDollar: Number(navList[curr.itemCode]?.price) * curr.amount * FEE,
                    lastProfit:
                        Number(navList[curr.itemCode]?.price) * curr.amount * FEE - curr.dollar,
                };
            else {
                const newAmt = acc[curr.itemCode].amount + curr.amount;
                acc[curr.itemCode].price = (
                    (Number(acc[curr.itemCode].price) * acc[curr.itemCode].amount +
                        Number(curr.price) * curr.amount) /
                    newAmt
                ).toFixed(2);
                acc[curr.itemCode].dollar += curr.dollar;
                acc[curr.itemCode].amount += curr.amount;
                acc[curr.itemCode].tradeDate = '';
                acc[curr.itemCode].details?.push(curr);
                acc[curr.itemCode].lastDollar = Number(acc[curr.itemCode].lastPrice) * newAmt * FEE;
                acc[curr.itemCode].lastProfit =
                    Number(acc[curr.itemCode].lastPrice) * newAmt * FEE - acc[curr.itemCode].dollar;
            }
            return acc;
        }, {} as { [key: string]: InStockItem });

        // 算總和
        const { totalBuy, totalSell } = stockList.reduce(
            (acc, current) => {
                if (current.itemType === 'sell') acc.totalSell += current.dollar;
                else if (current.itemType === 'buy' || current.itemType === 'allotment')
                    acc.totalBuy += current.dollar;
                return acc;
            },
            { totalBuy: 0, totalSell: 0 }
        );
        const totalProfit = result.reduce((acc, current) => {
            return acc + Number(current.profit || 0);
        }, 0);
        const totalLast = totalBuy - totalSell + totalProfit;
        const currentProfit = Object.values(inStock).reduce((acc, current) => {
            return acc + Number(current.lastProfit || 0);
        }, 0);

        return {
            inStockList: Object.values(inStock).sort(
                (a, b) => Number(b.tradeDate) - Number(a.tradeDate)
            ),
            settleList: result.sort(
                (a, b) => b.sellDate - a.sellDate || Number(b.tradeDate) - Number(a.tradeDate)
            ) as Array<SettleItem>,
            totalProfit,
            totalLast,
            currentProfit,
        };
    }, [stockList, navList]);

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
                                <TableCell>目前淨收</TableCell>
                                <TableCell align="right">
                                    目前盈虧
                                    <br />
                                    {resultList.currentProfit ? (
                                        Number(resultList.currentProfit?.toFixed()).toLocaleString()
                                    ) : (
                                        <Skeleton />
                                    )}
                                </TableCell>
                                <TableCell>目前報酬率</TableCell>
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
                        <TableCell>報酬率</TableCell>
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
                                <TableCell align="right">{item.profit?.toLocaleString()}</TableCell>
                                <TableCell>
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
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default Summary;
