import { jwtDecode } from 'jwt-decode';
import { authStateFn, userIdStateFn } from '../../features/auth/authSlice';
import { ROUTES } from '../../routes';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';
import { onError, onSuccess } from '../../utils';
import {
    getEnvelopeMessage,
    getEnvelopeResult,
    getResponseToken,
    getResponseUserId,
    post,
} from '../shared';

// ---------------------------------------------------------------------------
// Feature-local helpers
// ---------------------------------------------------------------------------

const decodeTokenClaims = (token) => {
    if (!token) return {};

    try {
        return jwtDecode(token) ?? {};
    } catch {
        return {};
    }
};

const buildSessionUser = (response, token) => {
    const result = getEnvelopeResult(response) ?? {};
    const user = result?.user ?? result?.usr ?? result;
    const claims = decodeTokenClaims(token);
    const role =
        claims?.usrRoleCode ?? claims?.role ?? user?.usrRoleCode ?? user?.role ?? 'ADMIN';

    return {
        ...user,
        ...claims,
        usrId: user?.usrId ?? claims?.usrId ?? null,
        usrEmail: user?.usrEmail ?? claims?.usrEmail ?? '',
        usrFullName:
            user?.usrFullName ??
            claims?.usrFullName ??
            [
                user?.usrFirstName ?? claims?.usrFirstName,
                user?.usrLastName ?? claims?.usrLastName,
            ]
                .filter(Boolean)
                .join(' '),
        role,
    };
};

// Persist the token, hydrate auth state, toast, and route to the dashboard.
const completeAuthSession = ({
    response,
    dispatch,
    navigate,
    successMessage = 'Login successful',
}) => {
    const token = getResponseToken(response);

    if (!token) {
        onError('Could not verify account');
        return false;
    }

    tokenService.set(token);
    dispatch(authStateFn(buildSessionUser(response, token)));
    onSuccess(getEnvelopeMessage(response, successMessage));
    authService.redirectToDashboard({ navigate });

    return true;
};

// onSuccess handler shared by every "start a flow, then verify via OTP" action:
// require a usrId, stash it, toast, and navigate to the verification screen.
const startVerificationFlow =
    ({ failureMessage, successMessage, redirectTo }) =>
    ({ response, dispatch, navigate }) => {
        const usrId = getResponseUserId(response);

        if (!usrId) {
            onError(failureMessage);
            return;
        }

        dispatch(userIdStateFn(usrId));
        onSuccess(getEnvelopeMessage(response, successMessage));
        navigate(redirectTo);
    };

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export const loginAction = {
    method: 'POST',
    endpoint: '/auth/sign_in',
    mutationFn: post('/auth/sign_in'),
    onError,
    onSuccess: startVerificationFlow({
        failureMessage: 'Could not start login verification',
        successMessage: 'Please verify your account',
        redirectTo: ROUTES.AUTH.LOGIN_OTP_VERIFICATION,
    }),
};

export const registerAction = {
    method: 'POST',
    endpoint: '/auth/sign_up',
    mutationFn: post('/auth/sign_up'),
    onError,
    onSuccess: startVerificationFlow({
        failureMessage: 'Could not start registration verification',
        successMessage: 'Registration successful. Please verify your phone number',
        redirectTo: ROUTES.AUTH.REGISTRATION_VERIFICATION,
    }),
};

export const accountVerification = {
    method: 'POST',
    endpoint: '/auth/sign_in_otp',
    mutationFn: post('/auth/sign_in_otp'),
    onError,
    onSuccess: ({ response, dispatch, navigate }) =>
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
    onError,
    onSuccess: ({ response }) =>
        onSuccess(getEnvelopeMessage(response, 'OTP sent successfully')),
};

export const forgotPasswordAction = {
    method: 'POST',
    endpoint: '/auth/reset_password',
    mutationFn: post('/auth/reset_password'),
    onError,
    onSuccess: startVerificationFlow({
        failureMessage: 'Could not start password reset verification',
        successMessage: 'OTP sent successfully',
        redirectTo: ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION,
    }),
};

export const forgotPasswordVerificationAction = {
    method: 'POST',
    endpoint: '/auth/sign_in_otp',
    mutationFn: post('/auth/sign_in_otp'),
    onError,
    onSuccess: ({ response, navigate }) => {
        onSuccess(getEnvelopeMessage(response, 'Verification successful'));
        navigate(ROUTES.AUTH.UPDATE_PASSWORD);
    },
};

export const updatePasswordAction = {
    method: 'POST',
    endpoint: '/auth/update_password',
    mutationFn: post('/auth/update_password'),
    onError,
    redirectTo: ROUTES.AUTH.LOGIN,
    onSuccess: ({ response }) =>
        onSuccess(getEnvelopeMessage(response, 'Password updated successfully')),
};
