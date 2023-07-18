import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/app/hook';
import { updateIsOpenMenu } from '@/app/base';
import { throttle } from '@/utils/baseFunc';

import { Slide } from '@mui/material';
import { Menu } from '@mui/icons-material';

const Header = () => {
    const dispatch = useAppDispatch();
    const [show, setShow] = useState(true);
    const lastScrollYRef = useRef(0);

    const containerRef = useRef(null);

    useEffect(() => {
        const scrollHandle = () => {
            const nowScrollY = window.scrollY;

            if (nowScrollY < lastScrollYRef.current && !show) setShow(true);
            else if (nowScrollY > lastScrollYRef.current && show) setShow(false);

            lastScrollYRef.current = nowScrollY;
        };

        const throttledScroll = throttle(scrollHandle);
        window.addEventListener('scroll', throttledScroll);
        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [show]);

    const handleMenu = () => {
        dispatch(updateIsOpenMenu(true));
    };

    return (
        <>
            <div className="header h-14" ref={containerRef}>
                <Slide direction="down" in={show} container={containerRef.current}>
                    <header className="fixed z-10 flex h-14 w-full items-center bg-amber-400 px-4 shadow">
                        <span className="text-xl text-white">Howie</span>
                        <div className="!ml-auto">
                            <Menu className="cursor-pointer" onClick={handleMenu} />
                        </div>
                    </header>
                </Slide>
            </div>
        </>
    );
};

export default Header;
