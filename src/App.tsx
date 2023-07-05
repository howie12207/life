import { useRef, useEffect, lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Cookies from 'js-cookie';

import { useAppDispatch } from '@/app/hook';
import { updateToken } from '@/app/base';

import Header from '@/components/header/Header';
import GoTop from '@/components/goTop/GoTop';
import LoadingFull from '@/components/loadingFull/LoadingFull';

import { NavLink } from 'react-router-dom';

const App = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) dispatch(updateToken(token));
    }, [dispatch]);

    const Root = () => {
        const location = useLocation();
        const outlet = useOutlet();
        const emptyRef = useRef(null);
        const { nodeRef } = routes.find(route => route.path === location.pathname) ?? {
            nodeRef: emptyRef,
        };

        return (
            <>
                <Header />

                <div className="flex gap-2">
                    <NavLink to="/">home</NavLink>
                    <NavLink to="/cost">cost</NavLink>
                    <NavLink to="/article">article</NavLink>
                    <NavLink to="/fsada">error</NavLink>
                </div>

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
    const Error = lazy(() => import('@/pages/error'));

    const routes = [
        { path: '/', Component: Home, nodeRef: useRef(null) },
        { path: '/cost', Component: Cost, nodeRef: useRef(null) },
        {
            path: '/article',
            Component: Article,
            nodeRef: useRef(null),
        },
        {
            path: '/article/:id',
            Component: ArticleId,
            nodeRef: useRef(null),
        },
        { path: '*', Component: Error, nodeRef: useRef(null) },
    ];
    const router = createBrowserRouter([
        {
            path: '/',
            Component: Root,
            children: routes,
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
