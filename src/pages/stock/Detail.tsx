import { useState } from 'react';
import { StockListRes, StockItemParams } from '@/api/stock';
import { useAppSelector } from '@/app/hook';

import { Button, Table, TableRow, TableCell, TableBody } from '@mui/material';
import { Add, Download, Edit } from '@mui/icons-material';
import PopupEdit from './PopupEdit';

type Props = {
    stockList: StockListRes['list'];
    getStockList: () => unknown;
};

const Detail = ({ stockList, getStockList }: Props) => {
    const isLogin = useAppSelector(state => state.base.token);

    // Download
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const download = () => {
        setIsLoadingDownload(true);
        setIsLoadingDownload(false);
    };

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as StockItemParams);
    const openHandle = (list: StockItemParams, target: string) => {
        setEditData(list);
        setPopup(target);
    };

    return (
        <>
            {isLogin && (
                <div className="text-right">
                    <Button variant="contained" color="secondary" onClick={() => setPopup('add')}>
                        <Add className="!text-base" />
                        新增
                    </Button>
                </div>
            )}

            <div className="my-2 text-right">
                <Button variant="contained" onClick={download} disabled={isLoadingDownload}>
                    <Download className="!text-base" />
                    下載
                </Button>
            </div>

            <Table>
                <TableBody>
                    {stockList.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell
                                    className={`${
                                        item.itemType === 'sell'
                                            ? '!text-green-500'
                                            : '!text-red-500'
                                    }`}
                                >
                                    {item.tradeDateString}
                                </TableCell>
                                <TableCell
                                    className={`${
                                        item.itemType === 'sell'
                                            ? '!text-green-500'
                                            : '!text-red-500'
                                    }`}
                                >
                                    {item.itemName}
                                </TableCell>
                                <TableCell
                                    className={`${
                                        item.itemType === 'sell'
                                            ? '!text-green-500'
                                            : '!text-red-500'
                                    }`}
                                >
                                    {item.price}
                                </TableCell>
                                <TableCell
                                    className={`${
                                        item.itemType === 'sell'
                                            ? '!text-green-500'
                                            : '!text-red-500'
                                    }`}
                                >
                                    {item.amount.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    className={`${
                                        item.itemType === 'sell'
                                            ? '!text-green-500'
                                            : '!text-red-500'
                                    }`}
                                >
                                    {item.dollar.toLocaleString()}
                                </TableCell>
                                <TableCell>{item.note}</TableCell>
                                {isLogin && (
                                    <TableCell>
                                        <Edit
                                            className="cursor-pointer"
                                            color="primary"
                                            onClick={() =>
                                                openHandle(item as StockItemParams, 'edit')
                                            }
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <PopupEdit
                popup={popup}
                setPopup={setPopup}
                getStockList={getStockList}
                editData={editData}
                setEditData={setEditData}
            />
        </>
    );
};
export default Detail;
