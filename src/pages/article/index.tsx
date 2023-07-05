import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetArticleList, ArticleListRes } from '@/api/article';

import { Button, Pagination, Box, Skeleton } from '@mui/material';
import { Add } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PopupEdit from './PopupEdit';
import ArticleCard from './ArticleCard';

const Article = () => {
    const isLogin = useAppSelector(state => state.base.token);

    const [isLoadingData, setIsLoadingData] = useState(true);

    // Page
    const [totalCount, setTotalCount] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [nowPage, setNowPage] = useState(1);
    const [perPage] = useState(20);
    const changePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setNowPage(newPage);
        window.scrollTo(0, 0);
    };

    const [articleList, setArticleList] = useState<ArticleListRes['list']>([]);
    const getArticleList = useCallback(async () => {
        setIsLoadingData(true);
        const params: { [key: string]: number } = { page: nowPage - 1, size: perPage };
        if (perPage === -1) {
            delete params.page;
            delete params.size;
        }
        const res = await apiGetArticleList(params);
        if (res) {
            setArticleList(res.list);
            setTotalCount(res.totalCount);
            setTotalPage(res.totalPage);
        }
        setIsLoadingData(false);
    }, [nowPage, perPage]);
    useEffect(() => {
        getArticleList();
    }, [getArticleList]);
    const nodeRef = useRef(null);
    const Article = useMemo(() => {
        const Loading = () => (
            <>
                {Array.from({ length: 5 }, (_, index) => (
                    <div
                        className="my-4 flex flex-col gap-4 overflow-hidden rounded bg-red-50 p-4 shadow transition hover:shadow-xl"
                        key={index}
                    >
                        <Skeleton height={28} />
                        <Skeleton height={24} />
                        <Skeleton height={24} />
                        <Skeleton height={24} />
                        <Skeleton height={24} />
                        <Skeleton height={24} />
                    </div>
                ))}
            </>
        );
        const Data = () =>
            articleList.map(item => {
                return <ArticleCard className="my-4" key={item._id} data={item} />;
            });
        return isLoadingData ? <Loading /> : <Data />;
    }, [isLoadingData, articleList]);

    // Popup
    const [popup, setPopup] = useState('');

    return (
        <section className={`p-6`}>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">文章清單</h1>
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
            <SwitchTransition>
                <CSSTransition
                    key={isLoadingData ? 'Loading' : 'DataDisplay'}
                    nodeRef={nodeRef}
                    classNames="page"
                    unmountOnExit
                    timeout={500}
                >
                    <div ref={nodeRef}>{Article}</div>
                </CSSTransition>
            </SwitchTransition>
            {totalCount > 0 && (
                <Box my={2} display="flex" justifyContent="center">
                    <Pagination count={totalPage} page={nowPage} onChange={changePage} />
                </Box>
            )}

            <PopupEdit popup={popup} setPopup={setPopup} getArticle={getArticleList} />
        </section>
    );
};

export default Article;
