import axiosInstance from '../instance';
import { authStateFn, userIdStateFn } from '../features/auth/authSlice';
import { notifyError, notifySuccess } from '../utils';
import { jwtDecode } from 'jwt-decode';
import { ROUTES } from '../routes';

const handleLoginSuccess = ({ token, dispatch, navigate, successMessage }) => {
    if (token) {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        decoded.role = decoded?.role || 'ADMIN';

        notifySuccess(successMessage);
        dispatch(authStateFn(decoded));

        if (navigate) {
            navigate(ROUTES.DASHBOARD, { replace: true });
            return;
        }

        window.location.replace(`/#${ROUTES.DASHBOARD}`);
    } else {
        notifyError('Could not verify account');
    }
};

export const loginAction = {
    mutationFn: async (data) => axiosInstance.post('/auth/sign_in', data),
    onSuccess: ({ response, navigate, dispatch }) => {
        notifySuccess('Please verify your account');
        dispatch(userIdStateFn(response?.data?.usrId));
        navigate(ROUTES.AUTH.LOGIN_OTP_VERIFICATION);
    },
};

export const registerAction = {
    mutationFn: async (data) => axiosInstance.post('/auth/sign_up', data),
    onSuccess: ({ response, dispatch, navigate, form }) => {
        notifySuccess('Registration successful. Please verify your phone number');
        dispatch(userIdStateFn(response?.data?.usrId));
        form?.resetFields();
        navigate(ROUTES.AUTH.REGISTRATION_VERIFICATION);
    },
};

export const accountVerification = {
    mutationFn: async (data) => axiosInstance.post('/auth/sign_in_otp', data),
    onSuccess: ({ response, dispatch, navigate }) => {
        const token = response?.token || response?.data?.token;
        handleLoginSuccess({
            token,
            dispatch,
            navigate,
            successMessage: 'Account verification successful',
        });
    },
};

export const accountResendOtp = {
    mutationFn: async (body) => axiosInstance.post('/auth/resend_otp', body),
};

export const forgotPasswordAction = {
    mutationFn: async (data) => axiosInstance.post('/auth/reset_password', data),
    onSuccess: ({ response, dispatch, navigate }) => {
        dispatch(userIdStateFn(response?.data?.usrId));
        notifySuccess('OTP sent successfully');
        navigate(ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION);
    },
};

export const forgotPasswordVerificationAction = {
    mutationFn: async (data) => axiosInstance.post('/auth/sign_in_otp', data),
    onSuccess: ({ response, navigate }) => {
        if (!response) {
            notifyError('Could not verify account');
            return;
        }

        notifySuccess('Verification successful');
        navigate(ROUTES.AUTH.UPDATE_PASSWORD);
    },
};

export const updatePasswordAction = {
    mutationFn: async (data) => axiosInstance.post('/auth/update_password', data),
    onSuccess: ({ navigate }) => {
        notifySuccess('Password updated successfully');
        navigate(ROUTES.AUTH.LOGIN);
    },
};
