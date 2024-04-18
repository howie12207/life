import { useRef, lazy, Suspense } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    useLocation,
    useOutlet,
    useNavigate,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { setNavigate } from '@/utils/navigateHelper';
import { getToken } from '@/utils/lsHandle';
// import { urlBase64ToUint8Array } from './utils/baseFunc';
// import { apiAddSubscription } from './api/subscribe';

import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';
import GoTop from '@/components/goTop/GoTop';
import LoadingFull from '@/components/loadingFull/LoadingFull';

const App = () => {
    getToken();

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

        let pathname = location.pathname;
        const articleIdReg = /^\/article\/.+$/;
        if (articleIdReg.test(pathname)) pathname = '/article/:id';

        const title = routes.find(route => route.path === pathname)?.title || '錯誤頁';
        document.title = `${title} | Howie`;

        // BfCache
        const handleBfCache = (e: PageTransitionEvent) => {
            if (e.persisted) window.location.reload();
        };
        window.addEventListener('pageshow', handleBfCache);

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
    const Cost = lazy(() => import('@/pages/cost'));
    const Article = lazy(() => import('@/pages/article'));
    const ArticleId = lazy(() => import('@/pages/article/_id'));
    const Portfolio = lazy(() => import('@/pages/portfolio'));
    const Diary = lazy(() => import('@/pages/diary'));
    const Stock = lazy(() => import('@/pages/stock'));
    const Memo = lazy(() => import('@/pages/memo'));
    // const Test = lazy(() => import('@/pages/test'));
    const Calculator = lazy(() => import('@/pages/calculator'));
    const PriceList = lazy(() => import('@/pages/priceList'));
    const Assets = lazy(() => import('@/pages/assets'));
    const Error = lazy(() => import('@/pages/error'));

    const routes = [
        { path: '/', Component: Home, title: '首頁', nodeRef: useRef(null) },
        { path: '/cost', Component: Cost, title: '花費清單', nodeRef: useRef(null) },
        {
            path: '/article',
            Component: Article,
            title: '文章清單',
            nodeRef: useRef(null),
        },
        {
            path: '/article/:id',
            Component: ArticleId,
            title: '文章',
            nodeRef: useRef(null),
        },
        {
            path: '/portfolio',
            Component: Portfolio,
            title: '作品清單',
            nodeRef: useRef(null),
        },
        {
            path: '/diary',
            Component: Diary,
            title: '日曆',
            nodeRef: useRef(null),
        },
        {
            path: '/stock',
            Component: Stock,
            title: '股票清單',
            nodeRef: useRef(null),
        },
        {
            path: '/memo',
            Component: Memo,
            title: '便條紙',
            nodeRef: useRef(null),
        },
        // TODO
        // {
        //     path: '/test',
        //     Component: Test,
        //     title: '測試',
        //     nodeRef: useRef(null),
        // },
        {
            path: '/calculator',
            Component: Calculator,
            title: '計算機',
            nodeRef: useRef(null),
        },
        {
            path: '/priceList',
            Component: PriceList,
            title: '價目表',
            nodeRef: useRef(null),
        },
        {
            path: '/assets',
            Component: Assets,
            title: '資產',
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

    // const swFunction = () => {
    //     const hasGranted = Notification.permission === 'granted';
    //     if (!hasGranted) Notification.requestPermission(() => ({}));

    //     if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker
    //             .register(`${import.meta.env.VITE_DOMAIN}${import.meta.env.VITE_BASE_URL}/sw.js`)
    //             .then(registration => {
    //                 return registration.pushManager.subscribe({
    //                     userVisibleOnly: true,
    //                     applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_KEY),
    //                 });
    //             })
    //             .then(pushSubscription => {
    //                 if (!hasGranted) {
    //                     apiAddSubscription(pushSubscription);
    //                     // window.alert(pushSubscription);
    //                 }
    //                 console.log(pushSubscription);
    //                 return pushSubscription;
    //             });
    //     }
    // };
    // useEffect(() => {
    //     swFunction();
    // }, []);

    return <RouterProvider router={router} />;
};

export default App;
