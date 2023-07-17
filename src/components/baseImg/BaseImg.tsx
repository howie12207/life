import { useRef, useState } from 'react';

import { Skeleton } from '@mui/material';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

type Props = {
    src: string;
    alt: string;
    height?: number;
};

const BaseImg = ({ src, alt, height }: Props) => {
    const nodeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const loaded = () => {
        setIsLoading(false);
    };

    return (
        <SwitchTransition>
            <CSSTransition
                key={isLoading ? 'loading' : 'data'}
                nodeRef={nodeRef}
                classNames="page"
                unmountOnExit
                timeout={500}
            >
                <div ref={nodeRef}>
                    <img
                        src={src}
                        alt={alt}
                        className={`${
                            isLoading ? '!absolute !opacity-0' : ''
                        } aspect-video w-full object-cover transition`}
                        loading="lazy"
                        onLoad={loaded}
                    />

                    <Skeleton
                        {...(height ? { height } : {})}
                        className={`${isLoading ? '' : '!absolute !hidden'} skeleton-custom`}
                    />
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
};

export default BaseImg;
