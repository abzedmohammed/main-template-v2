// Readers for the standard API response envelope:
//   { success, message, data: { result }, total, token, ... }
//

import { defaultTimer } from "../../utils";

const ENVELOPE_MARKERS = ['success', 'data', 'token', 'message'];
const LIST_KEYS = ['result'];

export const getEnvelope = (response = {}) => {
    const data = response?.data;
    const isWrapped =
        data && typeof data === 'object' && ENVELOPE_MARKERS.some((key) => key in data);

    return isWrapped ? data : response;
};

export const getEnvelopeResult = (response = {}) => {
    const envelope = getEnvelope(response);
    return envelope?.data?.result ?? null;
};

export const getEnvelopeMessage = (response = {}, fallback = '') => {
    const raw = getEnvelope(response)?.message;
    return raw ?? fallback;
};

export const getEnvelopeTotal = (response = {}, fallback = 0) => {
    const envelopeTotal = getEnvelope(response)?.total;

    return Number(envelopeTotal ?? fallback);
};

export const extractList = (result) => {
    if (Array.isArray(result)) return result;

    for (const key of LIST_KEYS) {
        if (Array.isArray(result?.[key])) return result[key];
    }

    return [];
};

export const getResponseUserId = (response = {}) => {
    const result = getEnvelopeResult(response);

    return (
        result?.usrId ??
        result?.user?.usrId ??
        result?.reqId ??
        result?.user?.reqId ??
        null
    );
};

export const getResponseMaskedEmail = (response = {}) => {
    const result = getEnvelopeResult(response);

    return result?.maskedEmail ?? null;
};

export const getResponseOtpTimer = (response = {}) => {
    const result = getEnvelopeResult(response);

    let minutes = result?.otpTimer ?? null;

    if (minutes !== null && minutes !== undefined) {
        return Math.floor(minutes * 60);
    }
    
    return defaultTimer;
};

export const getResponseToken = (response = {}) => {
    const result = getEnvelopeResult(response);
    const envelope = getEnvelope(response);

    return (
        result?.accessToken ??
        result?.token ??
        envelope?.token ??
        envelope?.accessToken ??
        null
    );
};

export const getResponseRefreshToken = (response = {}) => {
    const result = getEnvelopeResult(response);
    const envelope = getEnvelope(response);

    return result?.refreshToken ?? envelope?.refreshToken ?? null;
};
