import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hook';
import { updateIsOpenMenu } from '@/app/base';
import { NavLink } from 'react-router-dom';
import { apiDownloadDb } from '@/api/base';

import { Button, Drawer, IconButton } from '@mui/material';
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
        {
            name: '便條紙',
            link: '/memo',
        },
        // {
        //     name: '計算機',
        //     link: '/calculator',
        // },
        {
            name: '價目表',
            link: '/priceList',
        },
        {
            name: '資產',
            link: '/assets',
        },
        // {
        //     name: '薪水',
        //     link: '/salary',
        // },
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
            <Drawer
                anchor={'right'}
                open={isOpenSidebar}
                onClose={() => dispatch(updateIsOpenMenu(false))}
            >
                <aside className="flex h-screen w-[15rem] flex-col overflow-y-auto  bg-gray-400 outline-none">
                    <div className="flex h-[4rem] items-center justify-between border-b-4 border-red-900 px-4">
                        <LoginBox />
                        <IconButton onClick={() => dispatch(updateIsOpenMenu(false))}>
                            <Close />
                        </IconButton>
                    </div>

                    <nav className="flex-grow">
                        <ul>
                            {menuList.map(item => {
                                return (
                                    <li
                                        className="border-b border-gray-900 transition hover:bg-white hover:text-red-900"
                                        key={item.name}
                                    >
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
                        />
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
            </Drawer>
            <PopupLogin popup={popup} setPopup={setPopup} />
        </>
    );
};

export default Sidebar;
