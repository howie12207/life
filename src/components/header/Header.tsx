import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/app/hook';
import { Slide, Button } from '@mui/material';
import PopupLogin from '@/components/popup/login/PopupLogin';
import { throttle } from '@/utils/baseFunc';

const Header = () => {
    const [show, setShow] = useState(true);
    const lastScrollYRef = useRef(0);
    const username = useAppSelector(state => state.base.username);

    const containerRef = useRef(null);

    const [popup, setPopup] = useState('');

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

    const LoginBox = () => {
        return username ? (
            <span className="!ml-auto">您好，{username}</span>
        ) : (
            <Button className="!ml-auto" variant="contained" onClick={() => setPopup('login')}>
                管理員登入
            </Button>
        );
    };

    return (
        <>
            <div className="header h-14" ref={containerRef}>
                <Slide direction="down" in={show} container={containerRef.current}>
                    <header className="fixed z-10 flex h-14 w-full items-center bg-amber-400 px-4 shadow">
                        <span className="text-xl text-white">Howie</span>
                        <LoginBox />
                    </header>
                </Slide>
            </div>

            <PopupLogin popup={popup} setPopup={setPopup} />
        </>
    );
};

export default Header;
