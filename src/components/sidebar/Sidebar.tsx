import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hook';
import { updateIsOpenMenu } from '@/app/base';
import { NavLink } from 'react-router-dom';
import { apiDownloadDb } from '@/api/base';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Fade, Modal, Button } from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import PopupLogin from '@/components/popup/login/PopupLogin';

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isLogin = useAppSelector(state => state.base.token);
    const isOpenSidebar = useAppSelector(state => state.base.isOpenMenu);

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
    const downloadDb = async () => {
        setIsLoadingDownload(true);
        const res = await apiDownloadDb();
        const zip = new JSZip();
        Object.entries(res).forEach(item => {
            zip.file(`${item[0]}.json`, JSON.stringify(item[1]));
        });
        zip.generateAsync({ type: 'blob' })
            .then(content => {
                saveAs(content, 'data.zip');
            })
            .finally(() => {
                setIsLoadingDownload(false);
            });
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
                        <div className="flex h-[4rem] items-center justify-between px-4">
                            <LoginBox />
                            <Close
                                className="cursor-pointer"
                                onClick={() => dispatch(updateIsOpenMenu(false))}
                            />
                        </div>

                        <nav className="flex-grow">
                            <ul>
                                <li className="border-b border-t border-gray-400">
                                    <NavLink
                                        to="/"
                                        className="block p-4"
                                        onClick={() => dispatch(updateIsOpenMenu(false))}
                                    >
                                        首頁
                                    </NavLink>
                                </li>
                                <li className="border-b border-gray-400">
                                    <NavLink
                                        to="/cost"
                                        className="block p-4"
                                        onClick={() => dispatch(updateIsOpenMenu(false))}
                                    >
                                        花費清單
                                    </NavLink>
                                </li>
                                <li className="border-b border-gray-400">
                                    <NavLink
                                        to="/article"
                                        className="block p-4"
                                        onClick={() => dispatch(updateIsOpenMenu(false))}
                                    >
                                        文章清單
                                    </NavLink>
                                </li>
                                <li className="border-b border-gray-400">
                                    <NavLink
                                        to="/portfolio"
                                        className="block p-4"
                                        onClick={() => dispatch(updateIsOpenMenu(false))}
                                    >
                                        作品清單
                                    </NavLink>
                                </li>
                                <li className="border-b border-gray-400">
                                    <NavLink
                                        to="/diary"
                                        className="block p-4"
                                        onClick={() => dispatch(updateIsOpenMenu(false))}
                                    >
                                        日曆
                                    </NavLink>
                                </li>
                            </ul>
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
