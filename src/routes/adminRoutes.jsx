import { MainLayout } from '../components/layout';
import { ErrorPage, Profile } from '../pages';
import { AdminDashboard } from '../pages/admin';
import { ROUTES } from './paths';
import ProtectedRoute from './ProtectedRoute';

export const adminRoutes = [
    {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: ROUTES.DASHBOARD, element: <AdminDashboard /> },
                    { path: ROUTES.PROFILE, element: <Profile /> },
                ],
            },
        ],
    },
];
