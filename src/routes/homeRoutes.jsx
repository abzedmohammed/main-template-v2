import { HomeLayout } from '../components/layout';
import { ErrorPage } from '../pages';
import { Login } from '../pages/auth';

export const homeRoutes = [
    {
        element: <HomeLayout />,
        errorElement: <ErrorPage />,
        children: [{ index: true, element: <Login /> }],
    },
];
