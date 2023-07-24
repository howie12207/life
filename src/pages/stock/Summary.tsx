import { useMemo } from 'react';
import { formatDate } from '@/utils/format';
import { StockListRes } from '@/api/stock';

import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@mui/material';

type Props = {
    stockList: StockListRes['list'];
};

const Summary = ({ stockList }: Props) => {
    type PaymentItem = {
        itemCode: string;
        itemName?: string;
        tradeDate: number | string;
        price: string;
        dollar: number;
        amount: number;
        sellDate?: number;
        sellPrice?: string;
        sellDollar?: number;
        sellAmount?: number;
        profit?: number;
        details?: Array<{ [key: string]: string | number }>;
    };
    const paymentList = useMemo(() => {
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
            if (!acc[curr.itemCode]) acc[curr.itemCode] = { ...curr, details: [{ ...curr }] };
            else {
                acc[curr.itemCode].price = (
                    (Number(acc[curr.itemCode].price) * acc[curr.itemCode].amount +
                        Number(curr.price) * curr.amount) /
                    (acc[curr.itemCode].amount + curr.amount)
                ).toFixed(2);
                acc[curr.itemCode].dollar += curr.dollar;
                acc[curr.itemCode].amount += curr.amount;
                acc[curr.itemCode].tradeDate = '';
                acc[curr.itemCode].details?.push(curr);
                console.log(acc[curr.itemCode]);
            }
            return acc;
        }, {} as { [key: string]: PaymentItem });

        return [
            ...Object.values(inStock).sort((a, b) => Number(b.tradeDate) - Number(a.tradeDate)),
            ...result.sort(
                (a, b) => b.sellDate - a.sellDate || Number(b.tradeDate) - Number(a.tradeDate)
            ),
        ] as Array<PaymentItem>;
    }, [stockList]);

    const total = useMemo(() => {
        const { buyTotal, sellTotal } = stockList.reduce(
            (acc, current) => {
                if (current.itemType === 'sell') acc.sellTotal += current.dollar;
                else if (current.itemType === 'buy' || current.itemType === 'allotment')
                    acc.buyTotal += current.dollar;
                return acc;
            },
            { buyTotal: 0, sellTotal: 0 }
        );

        const profitTotal = paymentList.reduce((acc, current) => {
            return acc + Number(current.profit || 0);
        }, 0);

        const lastTotal = buyTotal - sellTotal + profitTotal;

        return { buyTotal, sellTotal, profitTotal, lastTotal };
    }, [paymentList, stockList]);

    return (
        <>
            {/* TODO 補下載功能 */}
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>名稱</TableCell>
                        <TableCell>購買日</TableCell>
                        <TableCell>購買價格</TableCell>
                        <TableCell>購買成本</TableCell>
                        <TableCell>購買股數</TableCell>
                        <TableCell>售出日</TableCell>
                        <TableCell>售出價格</TableCell>
                        <TableCell>淨收</TableCell>
                        <TableCell>盈虧</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paymentList.map((item, index) => {
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
                                <TableCell>
                                    {Number(item.details?.length) > 1 &&
                                        item.details?.map(detail => {
                                            return (
                                                <>
                                                    {formatDate(detail.tradeDate)}
                                                    <br />
                                                </>
                                            );
                                        })}
                                    {formatDate(item.tradeDate)}
                                    <br />
                                </TableCell>
                                <TableCell align="right">
                                    {Number(item.details?.length) > 1 &&
                                        item.details?.map(detail => {
                                            return (
                                                <>
                                                    {detail.price}
                                                    <br />
                                                </>
                                            );
                                        })}
                                    {item.price}
                                    <br />
                                </TableCell>
                                <TableCell align="right">
                                    {Number(item.details?.length) > 1 &&
                                        item.details?.map(detail => {
                                            return (
                                                <>
                                                    {detail.dollar?.toLocaleString()}
                                                    <br />
                                                </>
                                            );
                                        })}
                                    {item.dollar?.toLocaleString()}
                                    <br />
                                </TableCell>
                                <TableCell align="right">
                                    {Number(item.details?.length) > 1 &&
                                        item.details?.map(detail => {
                                            return (
                                                <>
                                                    {detail.amount?.toLocaleString()}
                                                    <br />
                                                </>
                                            );
                                        })}
                                    {item.amount?.toLocaleString()}
                                </TableCell>
                                <TableCell>{formatDate(item.sellDate || '')}</TableCell>
                                <TableCell align="right">{item.sellPrice}</TableCell>
                                <TableCell align="right">
                                    {item.sellDollar?.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">{item.profit?.toLocaleString()}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} align="right">
                            <div>目前成本</div>
                            {total.lastTotal?.toLocaleString()}
                        </TableCell>
                        <TableCell colSpan={2} align="right">
                            {total.buyTotal?.toLocaleString()}
                        </TableCell>
                        <TableCell colSpan={4} align="right">
                            {total.sellTotal?.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                            <div>目前獲利</div>
                            {total.profitTotal?.toLocaleString()}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    );
};

export default Summary;
