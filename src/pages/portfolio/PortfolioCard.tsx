import { useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { PortfolioItemParams } from '@/api/portfolio';

import { Skeleton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import BaseImg from '@/components/baseImg/BaseImg';

type Props = {
    data: PortfolioItemParams;
    isLoadingData: boolean;
    setPopup?: () => void;
    setEditData?: () => void;
};

const PortfolioCard = ({ data, isLoadingData, setPopup, setEditData }: Props) => {
    const isLogin = useAppSelector(state => state.base.token);
    const nodeRef = useRef(null);

    const handleEdit = () => {
        if (setPopup && setEditData) {
            setPopup();
            setEditData();
        }
    };

    return (
        <article
            className={`relative h-full overflow-hidden rounded border border-red-50 bg-red-50 shadow transition hover:shadow-xl`}
        >
            <BaseImg src={data.img} alt={data.name} height={280} />
            <SwitchTransition>
                <CSSTransition
                    key={isLoadingData ? 'loading' : 'data'}
                    nodeRef={nodeRef}
                    classNames="page"
                    unmountOnExit
                    timeout={500}
                >
                    <>
                        <div ref={nodeRef} className=" p-4">
                            {isLoadingData ? (
                                <>
                                    <Skeleton width="60%" />
                                    <Skeleton width="30%" />
                                    <Skeleton width="30%" />
                                    <Skeleton width="30%" />
                                </>
                            ) : (
                                <>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-red-700">
                                            {data.name}
                                        </h2>
                                        {isLogin && (
                                            <Edit
                                                className="cursor-pointer text-blue-500"
                                                onClick={handleEdit}
                                            />
                                        )}
                                    </div>
                                    <div className="whitespace-pre-wrap">{data.content}</div>
                                    <div className="mt-2 flex gap-4 ">
                                        {data.pathDemo && (
                                            <a
                                                href={data.pathDemo}
                                                className="text-blue-500 hover:underline"
                                                title="demo"
                                                target="_blank"
                                            >
                                                Demo
                                            </a>
                                        )}
                                        {data.pathCode && (
                                            <a
                                                href={data.pathCode}
                                                className="text-blue-500 hover:underline"
                                                title="code"
                                                target="_blank"
                                            >
                                                Code
                                            </a>
                                        )}
                                        {data.url && (
                                            <a
                                                href={data.url}
                                                className="text-blue-500 hover:underline"
                                                title="article"
                                                target="_blank"
                                            >
                                                Article
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                </CSSTransition>
            </SwitchTransition>
        </article>
    );
};

export default PortfolioCard;
