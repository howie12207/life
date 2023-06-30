import { useRef, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Cookies from 'js-cookie';

import { useAppDispatch } from '@/app/hook';
import { updateToken } from '@/app/base';

import Header from '@/components/header/Header';
import GoTop from '@/components/goTop/GoTop';
import LoadingFull from '@/components/loadingFull/LoadingFull';

import Home from '@/pages/home';
import Cost from '@/pages/cost';
import Error from '@/pages/error';

export default function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) dispatch(updateToken(token));
    }, [dispatch]);

    function Root() {
        const location = useLocation();
        const outlet = useOutlet();
        const { nodeRef } = routes.find(route => route.path === location.pathname) ?? {};

        return (
            <>
                <Header />

                <SwitchTransition>
                    <CSSTransition
                        key={location.pathname}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="page"
                        unmountOnExit
                    >
                        <main ref={nodeRef}>{outlet}</main>
                    </CSSTransition>
                </SwitchTransition>

                <GoTop />
                <LoadingFull />
            </>
        );
    }

    const routes = [
        { path: '/', Component: Home, nodeRef: useRef(null) },
        { path: '/cost', Component: Cost, nodeRef: useRef(null) },
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
}
