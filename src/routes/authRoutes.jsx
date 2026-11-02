import { AuthLayout, RouteFallback } from '../components/layout';
import { ErrorPage } from '../pages';
import { lazyPage } from './lazyPage';
import { ROUTES } from './paths';

const authPage = (name) => lazyPage(() => import('../pages/auth'), name);

export const authRoutes = [
    {
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        HydrateFallback: RouteFallback,
        children: [
            { path: ROUTES.AUTH.LOGIN, lazy: authPage('Login') },
            {
                path: ROUTES.AUTH.LOGIN_OTP_VERIFICATION,
                lazy: authPage('LoginOTPVerification'),
            },
            { path: ROUTES.AUTH.REGISTER, lazy: authPage('Register') },
            { path: ROUTES.AUTH.FORGOT_PASSWORD, lazy: authPage('ForgotPassword') },
            {
                path: ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION,
                lazy: authPage('ForgotPasswordVerification'),
            },
            {
                path: ROUTES.AUTH.REGISTRATION_VERIFICATION,
                lazy: authPage('RegistrationVerification'),
            },
            { path: ROUTES.AUTH.UPDATE_PASSWORD, lazy: authPage('UpdatePassword') },
        ],
    },
];
