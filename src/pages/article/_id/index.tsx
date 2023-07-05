import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';
import { formatDate, formatDateTime } from '@/utils/format';
import { apiGetArticleItem, ArticleItemParams } from '@/api/article';

import { Skeleton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import PopupEdit from '../PopupEdit';

import style from '../articleCard.module.scss';

const ArticleId = () => {
    const nodeRef = useRef(null);

    const params = useParams();
    const [articleData, setArticleData] = useState({} as ArticleItemParams);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const getArticle = useCallback(async () => {
        const _id = params.id || '';
        setIsLoadingData(true);
        const res = await apiGetArticleItem(_id);
        setIsLoadingData(false);
        if (res) setArticleData(res);
    }, [params.id]);
    useEffect(() => {
        getArticle();
    }, [getArticle]);

    // Popup
    const [popup, setPopup] = useState('');
    const isLogin = useAppSelector(state => state.base.token);

    return (
        <section
            className={`m-4 min-h-[calc(100vh-2rem-3.5rem)] rounded bg-red-50 p-4 ${style.articleId}`}
        >
            <SwitchTransition>
                <CSSTransition
                    key={isLoadingData ? 'loading' : 'data'}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames="page"
                    unmountOnExit
                >
                    <article ref={nodeRef}>
                        {!isLoadingData && isLogin && (
                            <div className="my-2 flex justify-end gap-2">
                                <Edit
                                    className="cursor-pointer"
                                    color="primary"
                                    onClick={() => setPopup('edit')}
                                />
                                <Delete
                                    className="cursor-pointer"
                                    color="error"
                                    onClick={() => setPopup('delete')}
                                />
                            </div>
                        )}

                        <div className="mb-4 flex justify-between gap-x-4">
                            {isLoadingData ? (
                                <>
                                    <Skeleton width={400} />
                                    <Skeleton width={96} />
                                </>
                            ) : (
                                <>
                                    <h1 className="font-black text-red-700 sm:text-2xl">
                                        {articleData.name}
                                    </h1>
                                    <time className="flex-shrink-0 text-right text-sm sm:text-base">
                                        {formatDate(articleData.createTime || 0)}
                                    </time>
                                </>
                            )}
                        </div>
                        {isLoadingData ? (
                            <>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton width={'70%'} style={{ marginBottom: '2rem' }} />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton width={'70%'} style={{ marginBottom: '2rem' }} />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton width={'70%'} style={{ marginBottom: '2rem' }} />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton width={'70%'} />
                            </>
                        ) : (
                            <div
                                className={`${style.content}`}
                                dangerouslySetInnerHTML={{ __html: articleData.content }}
                            ></div>
                        )}
                        {!isLoadingData && (
                            <>
                                <div className="my-4 flex flex-wrap gap-4">
                                    {articleData.sorts?.map((item, index) => {
                                        return (
                                            <span key={index} className="text-blue-800">
                                                #{item}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="text-right">
                                    最後更新時間：
                                    <time>{formatDateTime(articleData.updateTime || 0)}</time>
                                </div>
                            </>
                        )}
                    </article>
                </CSSTransition>
            </SwitchTransition>

            <PopupEdit
                popup={popup}
                setPopup={setPopup}
                editData={articleData}
                getArticle={getArticle}
            />
        </section>
    );
};

export default ArticleId;
