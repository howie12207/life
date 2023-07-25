import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hook';
import { updateIsOpenMenu } from '@/app/base';
import { NavLink } from 'react-router-dom';
import { apiDownloadDb } from '@/api/base';

import { Fade, Modal, Button } from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import PopupLogin from '@/components/popup/login/PopupLogin';

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector(state => state.base.token);
    const isOpenSidebar = useAppSelector(state => state.base.isOpenMenu);

    const menuList = [
        {
            name: '首頁',
            link: '/',
        },
        {
            name: '花費清單',
            link: '/cost',
        },
        {
            name: '文章清單',
            link: '/article',
        },
        {
            name: '作品清單',
            link: '/portfolio',
        },
        {
            name: '日曆',
            link: '/diary',
        },
        {
            name: '股票清單',
            link: '/stock',
        },
    ];

    const LoginBox = () => {
        return isLogin ? (
            <span>Admin</span>
        ) : (
            <Button variant="contained" size="small" onClick={handleLogin}>
                <Person />
            </Button>
        );
    };

    // Download
    const [isloadingDownload, setIsLoadingDownload] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');
    const downloadRef = useRef(null);
    const downloadDb = async () => {
        setIsLoadingDownload(true);
        const res = await apiDownloadDb();
        if (res) {
            const url = URL.createObjectURL(res);
            setDownloadLink(url);
            setTimeout(() => {
                if (downloadRef.current) (downloadRef.current as HTMLAnchorElement).click();
            }, 0);
        }
        setIsLoadingDownload(false);
    };

    // Popup
    const [popup, setPopup] = useState('');
    const handleLogin = () => {
        dispatch(updateIsOpenMenu(false));
        setPopup('login');
    };

    return (
        <>
            <Modal
                open={isOpenSidebar}
                onClose={() => dispatch(updateIsOpenMenu(false))}
                closeAfterTransition
            >
                <Fade in={isOpenSidebar}>
                    <aside className="fixed right-0 top-0 z-10 flex h-screen w-[15rem] flex-col overflow-y-auto rounded-bl rounded-tl bg-blue-100 outline-none">
                        <div className="flex h-[4rem] items-center justify-between border-b border-gray-400 px-4">
                            <LoginBox />
                            <Close
                                className="cursor-pointer"
                                onClick={() => dispatch(updateIsOpenMenu(false))}
                            />
                        </div>

                        <nav className="flex-grow">
                            <ul>
                                {menuList.map(item => {
                                    return (
                                        <li className="border-b border-gray-400" key={item.name}>
                                            <NavLink
                                                to={item.link}
                                                className="block p-4"
                                                onClick={() => dispatch(updateIsOpenMenu(false))}
                                            >
                                                {item.name}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                            <a
                                ref={downloadRef}
                                href={downloadLink}
                                download="db.zip"
                                className="hidden"
                            ></a>
                        </nav>

                        {isLogin && (
                            <Button
                                variant="contained"
                                className="!mb-4 self-center"
                                onClick={downloadDb}
                                disabled={isloadingDownload}
                            >
                                下載
                            </Button>
                        )}
                    </aside>
                </Fade>
            </Modal>
            <PopupLogin popup={popup} setPopup={setPopup} />
        </>
    );
};

export default Sidebar;
