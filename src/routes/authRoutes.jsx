import { HomeLayout } from '../components/layout';
import { ErrorPage } from '../pages';
import {
    ForgotPassword,
    ForgotPasswordVerification,
    Login,
    LoginOTPVerification,
    Register,
    RegisterOptions,
    RegistrationVerification,
    RegistrationVerificationEmail,
    UpdatePassword,
} from '../pages/auth';
import { ROUTES } from './paths';

export const authRoutes = [
    {
        element: <HomeLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: ROUTES.AUTH.LOGIN, element: <Login /> },
            {
                path: ROUTES.AUTH.LOGIN_OTP_VERIFICATION,
                element: <LoginOTPVerification />,
            },
            { path: ROUTES.AUTH.REGISTER_OPTIONS, element: <RegisterOptions /> },
            { path: ROUTES.AUTH.REGISTER, element: <Register /> },
            { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
            {
                path: ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION,
                element: <ForgotPasswordVerification />,
            },
            {
                path: ROUTES.AUTH.REGISTRATION_VERIFICATION,
                element: <RegistrationVerification />,
            },
            {
                path: ROUTES.AUTH.REGISTRATION_VERIFICATION_EMAIL,
                element: <RegistrationVerificationEmail />,
            },
            { path: ROUTES.AUTH.UPDATE_PASSWORD, element: <UpdatePassword /> },
        ],
    },
];
