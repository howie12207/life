import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetDividendList, DividendItemParams, DividendListRes } from '@/api/stock';
import { formatDate } from '@/utils/format';

import { Button, Table, TableHead, TableRow, TableCell, TableBody, Skeleton } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import PopupDividendEdit from './PopupEdit';
import SearchBar from './SearchBar';

const Dividend = () => {
    const nodeRef = useRef(null);
    const isLogin = useAppSelector(state => state.base.token);

    // Search
    const [itemName, setItemName] = useState('');
    const [startDate, setStartDate] = useState<null | Date>(null);
    const [endDate, setEndDate] = useState<null | Date>(null);

    // list
    const [dividendList, setDividendList] = useState(
        Array.from({ length: 15 }, () => ({ itemName: '' })) as DividendListRes['list']
    );
    const filterList = useMemo(() => {
        return dividendList.filter(item => {
            const nameFilter =
                item.itemName?.includes(itemName) || item.itemCode?.includes(itemName);
            const startDateFilter = startDate
                ? startDate.valueOf() <= Number(item.tradeDate)
                : true;
            const endDateFilter = endDate ? endDate.valueOf() >= Number(item.tradeDate) : true;
            return nameFilter && startDateFilter && endDateFilter;
        });
    }, [dividendList, itemName, startDate, endDate]);
    const [isLoadingDividendList, setIsLoadingDividendList] = useState(true);
    const getDividendList = useCallback(async () => {
        setIsLoadingDividendList(true);
        const res = await apiGetDividendList();
        if (res) {
            setDividendList(res.list);
        }
        setIsLoadingDividendList(false);
    }, []);
    useEffect(() => {
        getDividendList();
    }, [getDividendList]);

    const totalDollar = useMemo(() => {
        return filterList.reduce((acc, current) => {
            return acc + current.dollar;
        }, 0);
    }, [filterList]);

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as DividendItemParams);
    const openHandle = (list: DividendItemParams, target: string) => {
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

            <SearchBar
                itemName={itemName}
                setItemName={setItemName}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />

            <Table stickyHeader>
                <TableHead>
                    <TableRow ref={nodeRef}>
                        <TableCell>發放日</TableCell>
                        <TableCell>除息日</TableCell>
                        <TableCell>名稱</TableCell>
                        <TableCell>持有股數</TableCell>
                        <TableCell align="right">
                            金額
                            <br />
                            {isLoadingDividendList ? <Skeleton /> : totalDollar.toLocaleString()}
                        </TableCell>
                        <TableCell>備註</TableCell>
                        {isLogin && <TableCell>操作</TableCell>}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filterList.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {isLoadingDividendList ? <Skeleton /> : item.tradeDateString}
                                </TableCell>
                                <TableCell>
                                    {isLoadingDividendList ? (
                                        <Skeleton />
                                    ) : (
                                        formatDate(item.exDividendDate)
                                    )}
                                </TableCell>
                                <TableCell>
                                    {isLoadingDividendList ? <Skeleton /> : item.itemName}
                                </TableCell>
                                <TableCell>
                                    {isLoadingDividendList ? (
                                        <Skeleton />
                                    ) : (
                                        item.amount.toLocaleString()
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {isLoadingDividendList ? (
                                        <Skeleton />
                                    ) : (
                                        item.dollar.toLocaleString()
                                    )}
                                </TableCell>
                                <TableCell>
                                    {isLoadingDividendList ? <Skeleton /> : item.note}
                                </TableCell>
                                {isLogin && !isLoadingDividendList && (
                                    <TableCell>
                                        <Edit
                                            className="cursor-pointer"
                                            color="primary"
                                            onClick={() =>
                                                openHandle(item as DividendItemParams, 'edit')
                                            }
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <PopupDividendEdit
                popup={popup}
                setPopup={setPopup}
                editData={editData}
                setEditData={setEditData}
                getDividendList={getDividendList}
            />
        </>
    );
};

export default Dividend;
