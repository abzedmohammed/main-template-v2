import { HomeLayout } from '../components/layout';
import { ErrorPage } from '../pages';
import { Login } from '../pages/auth';
export const homeRoutes = [
	{
		path: '',
		element: <HomeLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '',
				element: <Login />,
			},
		],
	},
];
