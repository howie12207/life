import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { formatDate } from '@/utils/format';
import { ArticleItemParams } from '@/api/article';

import { Skeleton } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import style from './articleCard.module.scss';

type Props = {
    data: ArticleItemParams;
    className: string;
    isLoadingData: boolean;
};

const ArticleCard = ({ data, className, isLoadingData }: Props) => {
    const nodeRef = useRef(null);

    return (
        <section
            className={`articleCard overflow-hidden rounded bg-red-50 p-4 shadow transition hover:shadow-xl ${style.articleCard} ${className}`}
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
                        <div className="mb-4 flex justify-between gap-4">
                            {isLoadingData ? (
                                <>
                                    <Skeleton width={400} />
                                    <Skeleton width={96} />
                                </>
                            ) : (
                                <>
                                    <h2 className="font-black text-red-700 sm:text-xl">
                                        {data.name}
                                    </h2>
                                    <time className="flex-shrink-0 text-right text-xs sm:text-sm">
                                        {formatDate(data.createTime ?? 0)}
                                    </time>
                                </>
                            )}
                        </div>

                        {isLoadingData ? (
                            <>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton width={'70%'} />
                                <Skeleton width={'30%'} />
                                <Skeleton width={'50%'} />
                            </>
                        ) : (
                            <div
                                className={`line-clamp-6 overflow-hidden overflow-ellipsis ${style.content}`}
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            ></div>
                        )}

                        {!isLoadingData && (
                            <>
                                <NavLink
                                    to={`/article/${data._id}`}
                                    className="my-2 flex w-max items-center text-red-400 underline"
                                    title={data.name}
                                >
                                    閱讀更多
                                    <NavigateNext />
                                </NavLink>

                                <div className="flex flex-wrap gap-4">
                                    {data.sorts?.map((item, index) => {
                                        return (
                                            <span key={index} className="text-blue-800">
                                                #{item}
                                            </span>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </article>
                </CSSTransition>
            </SwitchTransition>
        </section>
    );
};

export default ArticleCard;
