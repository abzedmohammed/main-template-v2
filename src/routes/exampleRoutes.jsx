import { MainLayout, RouteFallback } from '../components/layout';
import { ErrorPage } from '../pages';
import { lazyPage } from './lazyPage';
import { ROUTES } from './paths';
import ProtectedRoute from './ProtectedRoute';

const examplePage = (name) => lazyPage(() => import('../pages/example'), name);

export const exampleRoutes = [
    {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'USER']} />,
        errorElement: <ErrorPage />,
        HydrateFallback: RouteFallback,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { index: true, lazy: examplePage('Example') },
                    { path: ROUTES.DASHBOARD, lazy: examplePage('Example') },
                ],
            },
        ],
    },
];
