import { useMemo } from 'react';
import { formatDate } from '@/utils/format';
import { StockListRes, StockItemParams } from '@/api/stock';

import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

type Props = {
    stockList: StockListRes['list'];
};

const Summary = ({ stockList }: Props) => {
    type PaymentItem = {
        itemCode: string;
        itemName: string;
        tradeDate: number;
        dollar: number;
        amount: number;
        sellDate: number;
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
                const { itemName, itemCode, itemType, tradeDate, dollar, amount } = record;

                if (itemType === 'buy' || itemType === 'allotment') {
                    buyRecords.push(record);
                } else if (itemType === 'sell') {
                    let matchedBuyRecord = null as null | StockItemParams;

                    for (const buyRecord of buyRecords) {
                        if (buyRecord.amount === amount) {
                            matchedBuyRecord = buyRecord;
                            break;
                        } else if (buyRecord.amount > amount) {
                            // TODO 賣一半
                        }
                    }

                    if (matchedBuyRecord !== null) {
                        buyRecords = buyRecords.filter(buyRecord => buyRecord !== matchedBuyRecord);
                        const profit = dollar - matchedBuyRecord.dollar;

                        result.push({
                            itemCode,
                            itemName,
                            tradeDate: matchedBuyRecord.tradeDate,
                            dollar: matchedBuyRecord.dollar,
                            amount: matchedBuyRecord.amount,
                            sellDate: tradeDate,
                            sellDollar: dollar,
                            sellAmount: amount,
                            profit,
                        });
                    }
                }
            }

            buyRecords.forEach(item => {
                inventory.push(item);
            });
        }

        return [
            ...inventory.sort((a, b) => b.tradeDate - a.tradeDate),
            ...result.sort((a, b) => b.tradeDate - a.tradeDate),
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
                        <TableCell>購買成本</TableCell>
                        <TableCell>購買股數</TableCell>
                        <TableCell>售出日</TableCell>
                        <TableCell>淨收</TableCell>
                        <TableCell>售出股數</TableCell>
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
                                <TableCell>{item.dollar?.toLocaleString()}</TableCell>
                                <TableCell>{item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{formatDate(item.sellDate)}</TableCell>
                                <TableCell>{item.sellDollar?.toLocaleString()}</TableCell>
                                <TableCell>{item.sellAmount?.toLocaleString()}</TableCell>
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