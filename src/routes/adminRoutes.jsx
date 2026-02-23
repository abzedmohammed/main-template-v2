import { MainLayout } from '../components/layout';
import { ErrorPage, Profile } from '../pages';
import { AdminDashboard } from '../pages/admin';
import ProtectedRoute from './ProtectedRoute';

export const adminRoutes = [
    {
        path: '',
        element: <ProtectedRoute />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <MainLayout />,
                errorElement: <ErrorPage />,
                children: [
                    {
                        path: '',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'dashboard',
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'profile',
                        element: <Profile />,
                    },
                ],
            },
        ],
    },
];
