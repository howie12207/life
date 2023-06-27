import { Slide } from '@mui/material';
import { ArrowDropUp } from '@mui/icons-material';

import { useState, useEffect, useRef } from 'react';
import scrollTo from '@/utils/scrollTo';

type Props = {
    target?: string;
    visible?: number;
};

const GoTop = ({ visible = 100, target = '.header' }: Props) => {
    const [show, setShow] = useState(false);

    const renderRef = useRef(false);
    useEffect(() => {
        if (renderRef.current) return;
        renderRef.current = true;
        const showHandle = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) setShow(false);
                else setShow(true);
            });
        };
        const observer = new IntersectionObserver(showHandle, {
            rootMargin: `${visible}px`,
            threshold: 0,
        });
        const targetEl = document.querySelector(target) as Element;
        if (targetEl) observer.observe(targetEl);
    }, [target, visible]);

    return (
        <Slide direction="up" in={show}>
            <div
                className="fixed bottom-8 right-4 z-20 flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-white bg-black/60 text-4xl text-white transition hover:bg-black md:bottom-4 md:text-xl"
                onClick={() => scrollTo({ target: 'body' })}
            >
                <ArrowDropUp fontSize="inherit" />
                <span className="hidden -translate-y-1 text-sm md:inline-block">Top</span>
            </div>
        </Slide>
    );
};

export default GoTop;
