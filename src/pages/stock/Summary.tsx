import { useMemo } from 'react';
import { formatDate } from '@/utils/format';
import { StockListRes, StockItemParams } from '@/api/stock';

import { Table, TableRow, TableCell, TableBody } from '@mui/material';

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

    // TODO
    // const total = useMemo(() => {
    //     const { buyTotal, sellTotal } = stockList.reduce(
    //         (acc, current) => {
    //             if (current.itemType === 'sell') {
    //                 acc.buyTotal += current.dollar;
    //             } else if (current.itemType === 'buy' || current.itemType === 'allotment') {
    //                 acc.sellTotal += current.dollar;
    //             }
    //         },
    //         { buyTotal: 0, sellTotal: 0 }
    //     );

    //     return { buyTotal, sellTotal };
    //     // return {};
    // }, [stockList]);

    return (
        <>
            {/* TODO */}
            {/* <div>buy:{total.buyTotal?.toLocaleString()}</div>
            <div>sell:{total.sellTotal?.toLocaleString()}</div> */}
            {/* <div>profit: {totalProfit.toLocaleString()}</div>
            <div>last:{lastTotal?.toLocaleString()}</div> */}

            {/* TODO 補下載功能 */}
            <Table>
                <TableBody>
                    {paymentList.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell
                                    className={`${
                                        item.profit > 0
                                            ? '!text-red-500'
                                            : item.profit <= 0
                                            ? '!text-green-500'
                                            : ''
                                    }`}
                                >
                                    {item.itemName}
                                </TableCell>
                                <TableCell>{formatDate(item.tradeDate)}</TableCell>
                                <TableCell>{item.dollar?.toLocaleString()}</TableCell>
                                <TableCell>{item.amount?.toLocaleString()}</TableCell>
                                <TableCell>{formatDate(item.sellDate)}</TableCell>
                                <TableCell>{item.sellDollar?.toLocaleString()}</TableCell>
                                <TableCell>{item.sellAmount?.toLocaleString()}</TableCell>
                                <TableCell
                                    className={`${
                                        item.profit > 0 ? '!text-red-500' : '!text-green-500'
                                    }`}
                                >
                                    {item.profit?.toLocaleString()}
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
