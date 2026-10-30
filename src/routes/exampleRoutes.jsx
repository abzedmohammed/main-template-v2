import { MainLayout } from '../components/layout';
import { ErrorPage } from '../pages';
import { Example } from '../pages/example';
import { ROUTES } from './paths';
import ProtectedRoute from './ProtectedRoute';

export const exampleRoutes = [
    {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'USER']} />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: <Example /> },
                    { path: ROUTES.DASHBOARD, element: <Example /> },
                ],
            },
        ],
    },
];
