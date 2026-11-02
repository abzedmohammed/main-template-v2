import { HomeLayout, RouteFallback } from '../components/layout';
import { ErrorPage } from '../pages';
import { lazyPage } from './lazyPage';

export const homeRoutes = [
    {
        element: <HomeLayout />,
        errorElement: <ErrorPage />,
        HydrateFallback: RouteFallback,
        children: [
            { index: true, lazy: lazyPage(() => import('../pages/auth'), 'Login') },
        ],
    },
];
