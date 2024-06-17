import { useState, useCallback, useEffect, useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetSalaryList } from '@/api/salary';
import { formatDate, formatToThousand, toStartTime } from '@/utils/format';

import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableFooter,
    TablePagination,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import PopupEdit from './PopupEdit';
import SearchBar from './SearchBar';
import { SalaryItemParams } from '@/api/salary';

const Salary = () => {
    const nodeRef = useRef(null);
    const isLogin = useAppSelector(state => state.base.token);

    // Search
    const [getStartDate, setGetStartDate] = useState<null | Date>(
        toStartTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3)) as Date
    );
    const [place, setPlace] = useState('');
    const [searchSwitch, setSearchSwitch] = useState(false);

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

    const [salaryList, setSalaryList] = useState([] as Array<SalaryItemParams>);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const getSalaryList = useCallback(
        async ({ page, size }: { page?: number; size?: number } = {}) => {
            setIsLoadingData(true);
            const params: { [key: string]: number | string } = {
                page: page ?? nowPage,
                size: size ?? perPage,
            };
            if (perPage === -1) {
                delete params.page;
                delete params.size;
            }
            if (getStartDate) params.startTime = (toStartTime(getStartDate) as Date).valueOf();
            if (place) params.place = place;

            const res = await apiGetSalaryList(params);
            if (res) {
                setSalaryList(res.list);
                setTotalCount(res.totalCount);
            }

            setIsLoadingData(false);
        },
        [nowPage, perPage, searchSwitch]
    );
    useEffect(() => {
        getSalaryList();
    }, [getSalaryList]);

    // Popup
    const [popup, setPopup] = useState('');

    return (
        <section className="p-4">
            {isLogin && (
                <div className="text-right">
                    <Button variant="contained" color="secondary" onClick={() => setPopup('add')}>
                        <Add className="!text-base" />
                        新增
                    </Button>
                </div>
            )}

            <SearchBar
                getStartDate={getStartDate}
                setGetStartDate={setGetStartDate}
                place={place}
                setPlace={setPlace}
                searchSwitch={searchSwitch}
                setSearchSwitch={setSearchSwitch}
            />

            <div className="overflow-x-auto">
                <SwitchTransition>
                    <CSSTransition
                        key={isLoadingData ? 'loading' : 'data'}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="page"
                    >
                        <Table ref={nodeRef}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>日期</TableCell>
                                    <TableCell>地方</TableCell>
                                    <TableCell>工作內容</TableCell>
                                    <TableCell className="w-20">金額</TableCell>
                                    <TableCell>備註</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {salaryList.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{formatDate(item.getDate)}</TableCell>
                                            <TableCell>{item.place}</TableCell>
                                            <TableCell>{item.content}</TableCell>
                                            <TableCell align="right">
                                                {formatToThousand(item.dollar)}
                                            </TableCell>
                                            <TableCell>{item.remark}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>總計：</TableCell>
                                    <TableCell colSpan={3} align="right">
                                        {formatToThousand(
                                            salaryList.reduce((prev, next) => prev + next.dollar, 0)
                                        )}
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            10,
                                            20,
                                            50,
                                            { label: 'All', value: -1 },
                                        ]}
                                        colSpan={5}
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
                    </CSSTransition>
                </SwitchTransition>
            </div>

            <PopupEdit popup={popup} setPopup={setPopup} getSalaryList={getSalaryList} />
        </section>
    );
};

export default Salary;
