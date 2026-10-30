import { jwtDecode } from 'jwt-decode';
import {
    authOtpStateFn,
    authStateFn,
    maskedEmailStateFn,
    userIdStateFn,
} from '../../features/auth/authSlice';
import { ROUTES } from '../../routes';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';
import { errorToast, successToast } from '../../utils';
import {
    getEnvelopeMessage,
    getEnvelopeResult,
    getResponseMaskedEmail,
    getResponseOtpTimer,
    getResponseToken,
    getResponseUserId,
    post,
    postWithoutBody,
} from '../shared';

const decodeTokenClaims = (token) => {
    if (!token) return {};

    try {
        return jwtDecode(token) ?? {};
    } catch {
        return {};
    }
};

const buildSessionUser = (response, token) => {
    const user = getEnvelopeResult(response)?.user ?? {};
    const claims = decodeTokenClaims(token);

    return {
        ...claims,
        ...user,
        usrRoleCode: user.usrRoleCode ?? claims.role ?? null,
    };
};

const completeAuthSession = ({
    response,
    dispatch,
    navigate,
    successMessage = 'Login successful',
}) => {
    const token = getResponseToken(response);

    if (!token) {
        errorToast('Could not verify account');
        return false;
    }

    tokenService.set(token);
    dispatch(authStateFn(buildSessionUser(response, token)));
    successToast(getEnvelopeMessage(response, successMessage));
    authService.redirectToDashboard({ navigate });

    return true;
};

const startVerificationFlow =
    ({ failureMessage, successMessage, redirectTo }) =>
    ({ response, dispatch, navigate }) => {
        const reqId = getResponseUserId(response);

        if (!reqId) {
            errorToast(failureMessage);
            return;
        }

        dispatch(userIdStateFn(reqId));
        dispatch(maskedEmailStateFn(getResponseMaskedEmail(response)));
        dispatch(authOtpStateFn(getResponseOtpTimer(response)));
        successToast(getEnvelopeMessage(response, successMessage));
        navigate(redirectTo);
    };

export const loginAction = {
    method: 'POST',
    endpoint: '/auth/sign_in',
    mutationFn: post('/auth/sign_in'),
    errorToast,
    successToast: startVerificationFlow({
        failureMessage: 'Could not start login verification',
        successMessage: 'Verification code sent',
        redirectTo: ROUTES.AUTH.LOGIN_OTP_VERIFICATION,
    }),
};

export const registerAction = {
    method: 'POST',
    endpoint: '/auth/sign_up',
    mutationFn: post('/auth/sign_up'),
    errorToast,
    successToast: startVerificationFlow({
        failureMessage: 'Could not start registration verification',
        successMessage: 'Verification code sent',
        redirectTo: ROUTES.AUTH.REGISTRATION_VERIFICATION,
    }),
};

export const accountVerification = {
    method: 'POST',
    endpoint: '/auth/sign_in_otp',
    mutationFn: post('/auth/sign_in_otp'),
    errorToast,
    successToast: ({ response, dispatch, navigate }) =>
        completeAuthSession({
            response,
            dispatch,
            navigate,
            successMessage: 'Account verification successful',
        }),
};

export const accountResendOtp = {
    method: 'POST',
    endpoint: '/auth/resend_otp',
    mutationFn: post('/auth/resend_otp'),
    errorToast,
    successToast: ({ response }) =>
        successToast(getEnvelopeMessage(response, 'Verification code resent')),
};

export const forgotPasswordAction = {
    method: 'POST',
    endpoint: '/auth/reset_password',
    mutationFn: post('/auth/reset_password'),
    errorToast,
    successToast: startVerificationFlow({
        failureMessage: 'Could not start password reset verification',
        successMessage: 'Verification code sent',
        redirectTo: ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION,
    }),
};

export const forgotPasswordVerificationAction = {
    method: 'POST',
    endpoint: '/auth/sign_in_otp',
    mutationFn: post('/auth/sign_in_otp'),
    errorToast,
    successToast: ({ response, navigate }) => {
        successToast(getEnvelopeMessage(response, 'OTP verified'));
        navigate(ROUTES.AUTH.UPDATE_PASSWORD);
    },
};

export const updatePasswordAction = {
    method: 'POST',
    endpoint: '/auth/update_password',
    mutationFn: post('/auth/update_password'),
    errorToast,
    redirectTo: ROUTES.AUTH.LOGIN,
    successToast: ({ response }) => {
        successToast(getEnvelopeMessage(response, 'Password updated successfully'));
    },
};

export const refreshSessionAction = {
    method: 'POST',
    endpoint: '/auth/refresh-session',
    mutationFn: postWithoutBody('/auth/refresh-session'),
    errorToast,
    successToast: ({ response }) => {
        const token = getResponseToken(response);

        if (token) tokenService.set(token);
    },
};
