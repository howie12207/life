import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetCostList, CostListRes, CostItemParams } from '@/api/cost';
// import { isRequired } from '@/utils/validate';

import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination,
    Skeleton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PopupEdit from './PopupEdit';
// import { BaseInputType } from '@/components/baseInput/BaseInput';
// import { BaseDateRange } from '@/components/baseDateRange/BaseDateRange';

const Cost = () => {
    const nodeRef = useRef(null);
    const isLogin = useAppSelector(state => state.base.token);

    const [isLoadingData, setIsLoadingData] = useState(true);

    // Page
    const [totalCount, setTotalCount] = useState(0);
    const [nowPage, setNowPage] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const changePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setNowPage(newPage);
    };
    const changePerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPage(parseInt(e.target.value, 10));
        setNowPage(0);
    };

    const [costList, setCostList] = useState<CostListRes['list']>([]);
    const getCostList = useCallback(async () => {
        setIsLoadingData(true);
        const params: { [key: string]: number } = { page: nowPage, size: perPage };
        if (perPage === -1) {
            delete params.page;
            delete params.size;
        }
        const res = await apiGetCostList(params);
        if (res) {
            setCostList(res.list);
            setTotalCount(res.totalCount);
        }
        setIsLoadingData(false);
    }, [nowPage, perPage]);
    // const renderRef = useRef(false);
    useEffect(() => {
        // if (renderRef.current) return;
        // renderRef.current = true;
        getCostList();
    }, [getCostList]);

    // Date range 暫無使用TODO
    // const dateRangeRef: Ref<BaseInputType> = useRef(null);
    // const [dateRange, setDateRange] = useState([new Date(), new Date()] as Array<Date | null>);
    // const [dateRangeIsValid, setDateRangeIsValid] = useState(false);
    // const dateRangeRules = [{ validate: isRequired, message: '請選擇日期' }];

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as CostItemParams);
    const openHandle = (list: CostItemParams, target: string) => {
        setEditData(list);
        setPopup(target);
    };

    const TableData = () => {
        const Loading = () => {
            return Array.from({ length: 10 }, (_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: isLogin ? 5 : 4 }, (_, indexCell) => (
                        <TableCell key={indexCell}>
                            <Skeleton />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        };

        const DataDisplay = () => {
            return (
                <>
                    {costList.map((list, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <time>{list.costDate}</time>
                                </TableCell>
                                <TableCell>{list.itemName}</TableCell>
                                <TableCell>${list.price?.toLocaleString()}</TableCell>
                                <TableCell className="whitespace-pre">{list.note}</TableCell>
                                {isLogin && (
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            <Edit
                                                className="cursor-pointer"
                                                color="primary"
                                                onClick={() =>
                                                    openHandle(list as CostItemParams, 'edit')
                                                }
                                            />
                                            <Delete
                                                className="cursor-pointer"
                                                color="error"
                                                onClick={() =>
                                                    openHandle(list as CostItemParams, 'delete')
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </>
            );
        };

        return isLoadingData ? <Loading /> : <DataDisplay />;
    };

    return (
        <section className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">花費清單</h1>
                {isLogin && (
                    <div className="text-right">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setPopup('add')}
                        >
                            <Add className="!text-base" />
                            新增
                        </Button>
                    </div>
                )}
            </div>

            {/* <div className="my-4 sm:text-right">
                <BaseDateRange
                    ref={dateRangeRef}
                    label="花費日期區間"
                    value={dateRange}
                    setValue={setDateRange}
                    isValid={dateRangeIsValid}
                    setIsValid={setDateRangeIsValid}
                    rules={dateRangeRules}
                    placeholder="請選擇花費日期"
                />
            </div> */}

            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>花費日期</TableCell>
                            <TableCell>項目名稱</TableCell>
                            <TableCell>金額</TableCell>
                            <TableCell>備註</TableCell>
                            {isLogin && <TableCell>操作</TableCell>}
                        </TableRow>
                    </TableHead>

                    <SwitchTransition>
                        <CSSTransition
                            key={isLoadingData ? 'Loading' : 'DataDisplay'}
                            nodeRef={nodeRef}
                            classNames="page"
                            unmountOnExit
                            timeout={500}
                        >
                            <TableBody ref={nodeRef}>
                                <TableData />
                            </TableBody>
                        </CSSTransition>
                    </SwitchTransition>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50, { label: 'All', value: -1 }]}
                                colSpan={isLogin ? 5 : 4}
                                count={totalCount}
                                rowsPerPage={perPage}
                                page={nowPage}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={changePage}
                                onRowsPerPageChange={changePerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            <PopupEdit
                popup={popup}
                setPopup={setPopup}
                getCostList={getCostList}
                editData={editData}
                setEditData={setEditData}
            />
        </section>
    );
};

export default Cost;
