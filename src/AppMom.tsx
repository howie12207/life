import { useRef, useEffect, lazy, Suspense } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLocation,
    useOutlet,
    useNavigate,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Cookies from 'js-cookie';
import { setNavigate } from '@/utils/navigateHelper';

import { useAppDispatch } from '@/app/hook';
import { updateToken } from '@/app/base';

import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import GoTop from '@/components/goTop/GoTop';
import LoadingFull from '@/components/loadingFull/LoadingFull';

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = Cookies.get('accessToken');
        if (token) dispatch(updateToken(token));
    }, [dispatch]);

    const Root = () => {
        // navigate without hooks
        const navigate = useNavigate();
        setNavigate(navigate);

        const location = useLocation();
        const outlet = useOutlet();
        const emptyRef = useRef(null);
        const { nodeRef } = routes.find(route => route.path === location.pathname) ?? {
            nodeRef: emptyRef,
        };

        useEffect(() => {
            let pathname = location.pathname;
            const articleIdReg = /^\/article\/.+$/;
            if (articleIdReg.test(pathname)) pathname = '/article/:id';

            const title = routes.find(route => route.path === pathname)?.title || '錯誤頁';
            document.title = `${title} | Howie`;
        }, [location.pathname]);

        return (
            <>
                <Header />
                <Sidebar />

                <SwitchTransition>
                    <CSSTransition
                        key={location.pathname}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="page"
                        unmountOnExit
                    >
                        <Suspense>
                            <main ref={nodeRef}>{outlet}</main>
                        </Suspense>
                    </CSSTransition>
                </SwitchTransition>

                <GoTop />
                <LoadingFull />
            </>
        );
    };

    const Home = lazy(() => import('@/pages/home'));
    const Stock = lazy(() => import('@/pages/stock'));
    const Error = lazy(() => import('@/pages/error'));

    const routes = [
        { path: '/', Component: Home, title: '首頁', nodeRef: useRef(null) },
        {
            path: '/stock',
            Component: Stock,
            title: '股票清單',
            nodeRef: useRef(null),
        },
        { path: '*', Component: Error, nodeRef: useRef(null) },
    ];
    const router = createBrowserRouter(
        [
            {
                path: '/',
                Component: Root,
                children: routes,
            },
        ],
        { basename: import.meta.env.VITE_BASE_URL }
    );

    return <RouterProvider router={router} />;
};

export default App;
