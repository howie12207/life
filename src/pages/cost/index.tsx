import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetCostList, CostListRes, CostItemParams } from '@/api/cost';
// import { isRequired } from '@/utils/validate';
import { toXLSX } from '@/utils/toExcel';
import { formatDate } from '@/utils/format';

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
import { Add, Edit, Delete, Download } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PopupEdit from './PopupEdit';
// import { BaseInputType } from '@/components/baseInput/BaseInput';
// import { BaseDateRange } from '@/components/baseDateRange/BaseDateRange';

const Cost = () => {
    const isLogin = useAppSelector(state => state.base.token);
    const nodeRef = useRef(null);

    const [isLoadingData, setIsLoadingData] = useState(true);

    // Page
    const [totalCount, setTotalCount] = useState(0);
    const [nowPage, setNowPage] = useState(0);
    const [perPage, setPerPage] = useState(20);
    const changePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setNowPage(newPage);
        window.scrollTo(0, 0);
    };
    const changePerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPage(parseInt(e.target.value, 10));
        changePage(null, 0);
    };

    const [costList, setCostList] = useState(
        Array.from({ length: 15 }, () => ({})) as CostListRes['list']
    );
    const getCostList = useCallback(
        async ({ page, size }: { page?: number; size?: number } = {}) => {
            setIsLoadingData(true);
            const params: { [key: string]: number } = {
                page: page ?? nowPage,
                size: size ?? perPage,
            };
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
        },
        [nowPage, perPage]
    );
    useEffect(() => {
        getCostList();
    }, [getCostList]);

    // Date range 暫無使用TODO
    // const dateRangeRef: Ref<BaseInputType> = useRef(null);
    // const [dateRange, setDateRange] = useState([new Date(), new Date()] as Array<Date | null>);
    // const [dateRangeIsValid, setDateRangeIsValid] = useState(false);
    // const dateRangeRules = [{ validate: isRequired, message: '請選擇日期' }];

    // Download
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const download = async () => {
        setIsLoadingDownload(true);
        const downloadList = await apiGetCostList();
        if (downloadList && downloadList.list) {
            const newData = downloadList.list.map(item => {
                return {
                    花費日期: item.costDate,
                    項目名稱: item.itemName,
                    金額: item.price,
                    備註: item.note,
                };
            });
            toXLSX(newData, {
                sheetName: '花費清單',
                fileName: `花費清單${formatDate(new Date())}`,
            });
        }
        setIsLoadingDownload(false);
    };

    // Popup
    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as CostItemParams);
    const openHandle = (list: CostItemParams, target: string) => {
        setEditData(list);
        setPopup(target);
    };

    const TableData = useMemo(() => {
        const Data = () => {
            return (
                <>
                    <TableBody ref={nodeRef}>
                        {costList.map((list, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell width="15%">
                                        {isLoadingData ? (
                                            <Skeleton />
                                        ) : (
                                            <time>{list.costDate}</time>
                                        )}
                                    </TableCell>
                                    <TableCell width="15%">
                                        {isLoadingData ? <Skeleton /> : list.itemName}
                                    </TableCell>
                                    <TableCell width="15%">
                                        {isLoadingData ? (
                                            <Skeleton />
                                        ) : (
                                            `$${list.price?.toLocaleString()}`
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-pre-wrap" width="40%">
                                        {isLoadingData ? <Skeleton /> : list.note}
                                    </TableCell>
                                    {isLogin && (
                                        <TableCell width="15%">
                                            {isLoadingData ? (
                                                <Skeleton />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    <Edit
                                                        className="cursor-pointer"
                                                        color="primary"
                                                        onClick={() =>
                                                            openHandle(
                                                                list as CostItemParams,
                                                                'edit'
                                                            )
                                                        }
                                                    />
                                                    <Delete
                                                        className="cursor-pointer"
                                                        color="error"
                                                        onClick={() =>
                                                            openHandle(
                                                                list as CostItemParams,
                                                                'delete'
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
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
                </>
            );
        };

        const Empty = () => {
            return (
                <TableBody ref={nodeRef}>
                    <TableRow>
                        <TableCell className="h-[160px]" colSpan={isLogin ? 5 : 4} align="center">
                            暫無資料
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        };

        return (
            <SwitchTransition>
                <CSSTransition
                    nodeRef={nodeRef}
                    key={isLoadingData ? 'loading' : 'data'}
                    classNames="page"
                    timeout={300}
                    unmountOnExit
                >
                    {costList.length === 0 ? <Empty /> : <Data />}
                </CSSTransition>
            </SwitchTransition>
        );
    }, [costList, isLoadingData, isLogin]);

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

            <div className="my-2 text-right">
                <Button variant="contained" onClick={download} disabled={isLoadingDownload}>
                    <Download className="!text-base" />
                    下載
                </Button>
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

                    {TableData}
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
