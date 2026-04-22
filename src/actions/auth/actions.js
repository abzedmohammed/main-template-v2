import { userIdStateFn } from '../../features/auth/authSlice';
import { ROUTES } from '../../routes';
import { onError, onSuccess } from '../../utils';
import {
    completeAuthSession,
    getResponseMessage,
    getResponseUserId,
    notifyOtpSent,
    post,
} from './helpers';

export const loginAction = {
    method: 'POST',
    endpoint: '/auth/sign_in',
    mutationFn: post('/auth/sign_in'),
    onError: onError,
    onSuccess: ({ response, dispatch, navigate }) => {
        const usrId = getResponseUserId(response);

        if (!usrId) {
            onError('Could not start login verification');
            return;
        }

        onSuccess(getResponseMessage(response, 'Please verify your account'));
        dispatch(userIdStateFn(usrId));
        navigate(ROUTES.AUTH.LOGIN_OTP_VERIFICATION);
    },
};

export const registerAction = {
    method: 'POST',
    endpoint: '/auth/sign_up',
    mutationFn: post('/auth/sign_up'),
    onError: onError,
    onSuccess: ({ response, dispatch, navigate }) => {
        const usrId = getResponseUserId(response);

        if (!usrId) {
            onError('Could not start registration verification');
            return;
        }

        onSuccess(
            getResponseMessage(
                response,
                'Registration successful. Please verify your phone number'
            )
        );
        dispatch(userIdStateFn(usrId));
        navigate(ROUTES.AUTH.REGISTRATION_VERIFICATION);
    },
};

export const accountVerification = {
    method: 'POST',
    endpoint: '/auth/sign_in_otp',
    mutationFn: post('/auth/sign_in_otp'),
    onError: onError,
    onSuccess: ({ response, dispatch, navigate }) => {
        completeAuthSession({
            response,
            dispatch,
            navigate,
            successMessage: 'Account verification successful',
        });
    },
};

export const accountResendOtp = {
    method: 'POST',
    endpoint: '/auth/resend_otp',
    mutationFn: post('/auth/resend_otp'),
    onError: onError,
    onSuccess: ({ response }) => {
        notifyOtpSent(getResponseMessage(response, 'OTP sent successfully'));
    },
};

export const forgotPasswordAction = {
    method: 'POST',
    endpoint: '/auth/reset_password',
    mutationFn: post('/auth/reset_password'),
    onError: onError,
    onSuccess: ({ response, dispatch, navigate }) => {
        const usrId = getResponseUserId(response);

        if (!usrId) {
            onError('Could not start password reset verification');
            return;
        }

        dispatch(userIdStateFn(usrId));
        notifyOtpSent(getResponseMessage(response, 'OTP sent successfully'));
        navigate(ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION);
    },
};

export const forgotPasswordVerificationAction = {
    method: 'POST',
    endpoint: '/auth/sign_in_otp',
    mutationFn: post('/auth/sign_in_otp'),
    onError: onError,
    onSuccess: ({ response, navigate }) => {
        onSuccess(getResponseMessage(response, 'Verification successful'));
        navigate(ROUTES.AUTH.UPDATE_PASSWORD);
    },
};

export const updatePasswordAction = {
    method: 'POST',
    endpoint: '/auth/update_password',
    mutationFn: post('/auth/update_password'),
    onError: onError,
    redirectTo: ROUTES.AUTH.LOGIN,
    onSuccess: ({ response }) => {
        onSuccess(getResponseMessage(response, 'Password updated successfully'));
    },
};
