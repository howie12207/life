import { useMemo } from 'react';
import { formatDate } from '@/utils/format';
import { StockListRes } from '@/api/stock';

import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

type Props = {
    stockList: StockListRes['list'];
};

const Summary = ({ stockList }: Props) => {
    type PaymentItem = {
        itemCode: string;
        itemName: string;
        tradeDate: number;
        price: string;
        dollar: number;
        amount: number;
        sellDate: number;
        sellPrice: string;
        sellDollar: number;
        sellAmount: number;
        profit: number;
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

        // TODO 庫存 可依相同名稱在統整

        return [
            ...inventory.sort((a, b) => b.tradeDate - a.tradeDate),
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
    }, [stockList, paymentList]);

    return (
        <>
            {/* TODO */}
            <div>buy:{total.buyTotal?.toLocaleString()}</div>
            <div>sell:{total.sellTotal?.toLocaleString()}</div>
            <div>profit: {total.profitTotal?.toLocaleString()}</div>
            <div>last:{total.lastTotal?.toLocaleString()}</div>

            {/* TODO 補下載功能 */}
            <Table>
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
                                    item.profit > 0
                                        ? 'bg-red-100'
                                        : item.profit <= 0
                                        ? 'bg-green-100'
                                        : ''
                                }`}
                            >
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{formatDate(item.tradeDate)}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.dollar?.toLocaleString()}</TableCell>
                                <TableCell>{item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{formatDate(item.sellDate)}</TableCell>
                                <TableCell>{item.sellPrice}</TableCell>
                                <TableCell>{item.sellDollar?.toLocaleString()}</TableCell>
                                <TableCell>{item.profit?.toLocaleString()}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    );
};

export default Summary;
