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

export const authRoutes = [
	{
		path: 'auth',
		element: <HomeLayout />,
		errorElement: <ErrorPage />,
		children: [
			{ path: 'login', element: <Login /> },
			{
				path: 'login/otp-verification',
				element: <LoginOTPVerification />,
			},
			{
				path: 'registration/choose',
				element: <RegisterOptions />,
			},
			{ path: 'register', element: <Register /> },
			{
				path: 'forgot-password',
				element: <ForgotPassword />,
			},
			{
				path: 'forgot-password/verification',
				element: <ForgotPasswordVerification />,
			},
			{
				path: 'registration/verification',
				element: <RegistrationVerification />,
			},
			{
				path: 'registration/verification/email',
				element: <RegistrationVerificationEmail />,
			},
			{
				path: 'update-password',
				element: <UpdatePassword />,
			},
		],
	},
];
