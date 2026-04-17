import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../instance';
import { authStateFn } from '../../features/auth/authSlice';
import { notifyError, notifySuccess } from '../../utils';
import { authService } from '../../services/authService';
import { tokenService } from '../../services/tokenService';

export const post =
    (path) =>
    async (data = {}) =>
        axiosInstance.post(path, data);

export const getEnvelopeResult = (response = {}) =>
    response?.data?.result ?? response?.data ?? null;

export const getResponseMessage = (response = {}, fallbackMessage = '') =>
    response?.message || response?.data?.message || fallbackMessage;

export const getResponseUserId = (response = {}) => {
    const result = getEnvelopeResult(response);

    return result?.usrId ?? result?.user?.usrId ?? response?.data?.usrId ?? null;
};

export const getResponseToken = (response = {}) => {
    const result = getEnvelopeResult(response);

    return (
        result?.accessToken ??
        result?.token ??
        response?.token ??
        response?.data?.token ??
        null
    );
};

const decodeTokenClaims = (token) => {
    if (!token) {
        return {};
    }

    try {
        return jwtDecode(token) ?? {};
    } catch {
        return {};
    }
};

export const buildSessionUser = (response = {}, token) => {
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

export const notifyOtpSent = (message = 'OTP sent successfully') => {
    notifySuccess(message);
};

export const completeAuthSession = ({
    response,
    dispatch,
    navigate,
    successMessage = 'Login successful',
}) => {
    const token = getResponseToken(response);

    if (!token) {
        notifyError('Could not verify account');
        return false;
    }

    tokenService.set(token);

    const sessionUser = buildSessionUser(response, token);

    dispatch(authStateFn(sessionUser));
    notifySuccess(getResponseMessage(response, successMessage));
    authService.redirectToDashboard({ navigate });

    return true;
};
