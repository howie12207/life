import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetPortfolioList, PortfolioListRes, PortfolioItemParams } from '@/api/portfolio';
import { useIntersectionObserver } from '@/hooks';

import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PortfolioCard from './PortfolioCard';
import PopupEdit from './PopupEdit';

const Portfolio = () => {
    const isLogin = useAppSelector(state => state.base.token);

    const [isLoadingData, setIsLoadingData] = useState(true);

    // Page
    const [totalCount, setTotalCount] = useState(0);
    const [nowPage, setNowPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const perPage = 10;

    const lastCardref = useRef<HTMLDivElement | null>(null);
    const { inView } = useIntersectionObserver(lastCardref);
    useEffect(() => {
        if (inView && totalPage > nowPage + 1) setNowPage(nowPage + 1);
    }, [inView]);

    const [portfolioList, setPortfolioList] = useState(
        Array.from({ length: 12 }, () => ({})) as PortfolioListRes['list']
    );
    const getPortfolioList = useCallback(
        async ({ page, size }: { page?: number; size?: number } = {}) => {
            if (page === 0) {
                window.scroll(0, 0);
                setNowPage(0);
            }

            if (nowPage === 0) setIsLoadingData(true);
            const params: { [key: string]: number } = {
                page: page ?? nowPage,
                size: size ?? perPage,
            };

            const res = await apiGetPortfolioList(params);
            if (res) {
                setPortfolioList(nowPage === 0 ? res.list : [...portfolioList, ...res.list]);
                setTotalCount(res.totalCount);
                setTotalPage(res.totalPage);
            }
            if (nowPage === 0) setIsLoadingData(false);
        },
        [nowPage, perPage]
    );
    useEffect(() => {
        getPortfolioList();
    }, [getPortfolioList]);

    const [popup, setPopup] = useState('');
    const [editData, setEditData] = useState({} as PortfolioItemParams);

    return (
        <section className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">作品清單</h1>
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

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portfolioList.map((item, index) => {
                    return (
                        <PortfolioCard
                            data={item}
                            isLoadingData={isLoadingData}
                            setPopup={() => setPopup('edit')}
                            setEditData={() => setEditData(item)}
                            key={index}
                        />
                    );
                })}

                <div ref={lastCardref} className="last-portfolio-card">
                    {totalCount > portfolioList.length && (
                        <PortfolioCard data={{} as PortfolioItemParams} isLoadingData={true} />
                    )}
                </div>
            </section>

            <PopupEdit
                popup={popup}
                setPopup={setPopup}
                getPortfolioList={() => getPortfolioList({ page: 0 })}
                editData={editData}
                setEditData={setEditData}
            />
        </section>
    );
};

export default Portfolio;
