import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Header from '@/components/header/Header';
import GoTop from '@/components/goTop/GoTop';
import LoadingFull from '@/components/loadingFull/LoadingFull';

import Home from '@/pages/home';
import Cost from '@/pages/cost';
import Error from '@/pages/error';

import { NavLink } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        children: [
            { path: '/', Component: Home },
            { path: '/cost', Component: Cost },
            { path: '*', Component: Error },
        ],
    },
]);

function Root() {
    return (
        <>
            <Header />
            <NavLink to="/">home</NavLink>
            <NavLink to="/cost">cost</NavLink>

            <main>
                <Outlet />
            </main>

            <GoTop />
            <LoadingFull />
        </>
    );
}

export default function App() {
    return <RouterProvider router={router} />;
}
