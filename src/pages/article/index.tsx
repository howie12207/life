import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '@/app/hook';
import { apiGetArticleList, ArticleListRes } from '@/api/article';

import { Button, Pagination, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
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

    const [articleList, setArticleList] = useState([{}, {}, {}, {}, {}] as ArticleListRes['list']);
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

            {articleList.map((item, index) => {
                return (
                    <ArticleCard
                        className="my-4"
                        key={index}
                        data={item}
                        isLoadingData={isLoadingData}
                    />
                );
            })}

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
