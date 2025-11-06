import { MainLayout } from '../components/layout';
import { ErrorPage, Profile } from '../pages';
import ProtectedRoute from '../ProtectedRoute';
import { AdminDashboard } from '../pages/admin';

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
