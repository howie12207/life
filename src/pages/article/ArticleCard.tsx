import { NavLink } from 'react-router-dom';
import { formatDate } from '@/utils/format';
import { NavigateNext } from '@mui/icons-material';

import { ArticleItemParams } from '@/api/article';

import style from './articleCard.module.scss';

type Props = {
    data: ArticleItemParams;
    className: string;
};

const ArticleCard = ({ data, className }: Props) => {
    return (
        <article
            className={`articleCard overflow-hidden rounded bg-red-50 p-4 shadow transition hover:shadow-xl ${style.articleCard} ${className}`}
        >
            <div className="mb-4 flex justify-between">
                <h2 className="font-black text-red-700 sm:text-xl">{data.name}</h2>
                <time className="w-24 flex-shrink-0 text-right text-xs sm:text-sm">
                    {formatDate(data.createTime ?? 0)}
                </time>
            </div>

            <div
                className={`line-clamp-6 overflow-hidden overflow-ellipsis ${style.content}`}
                dangerouslySetInnerHTML={{ __html: data.content }}
            ></div>

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
        </article>
    );
};

export default ArticleCard;
