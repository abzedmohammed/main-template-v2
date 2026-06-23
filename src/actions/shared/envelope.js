// Readers for the standard API response envelope:
//   { success, message, data: { result }, total, token, ... }
//
// These work whether you hand them the raw Axios response (fetch functions) or
// the already-unwrapped envelope (useDynamicMutation passes `response` =
// axiosResponse.data to onSuccess). `getEnvelope` sniffs which one it received.

const ENVELOPE_MARKERS = ['success', 'data', 'token', 'message'];
const LIST_KEYS = ['result', 'content', 'items', 'results', 'rows', 'notifications'];

export const getEnvelope = (response = {}) => {
    const data = response?.data;
    const isWrapped =
        data && typeof data === 'object' && ENVELOPE_MARKERS.some((key) => key in data);

    return isWrapped ? data : response;
};

export const getEnvelopeResult = (response = {}) => {
    const envelope = getEnvelope(response);

    return envelope?.data?.result ?? envelope?.data ?? null;
};

export const getEnvelopeMessage = (response = {}, fallback = '') => {
    const raw = getEnvelope(response)?.message;

    if (typeof raw === 'string') return raw || fallback;

    return raw?.message ?? fallback;
};

export const getEnvelopeTotal = (response = {}, fallback = 0) => {
    const envelope = getEnvelope(response);
    const result = getEnvelopeResult(response);

    return Number(
        envelope?.total ??
            envelope?.data?.total ??
            result?.total ??
            result?.totalElements ??
            fallback
    );
};

// Normalise any list payload (array, or wrapped in result/content/items/…) to
// a flat array.
export const extractList = (result) => {
    if (Array.isArray(result)) return result;

    for (const key of LIST_KEYS) {
        if (Array.isArray(result?.[key])) return result[key];
    }

    return [];
};

export const getResponseUserId = (response = {}) => {
    const result = getEnvelopeResult(response);
    const envelope = getEnvelope(response);

    return (
        result?.userId ??
        result?.usrId ??
        result?.user?.usrId ??
        envelope?.data?.userId ??
        envelope?.data?.usrId ??
        null
    );
};

export const getResponseToken = (response = {}) => {
    const result = getEnvelopeResult(response);
    const envelope = getEnvelope(response);

    return (
        result?.accessToken ??
        result?.token ??
        envelope?.token ??
        envelope?.data?.token ??
        null
    );
};

export const getResponseRefreshToken = (response = {}) => {
    const result = getEnvelopeResult(response);
    const envelope = getEnvelope(response);

    return (
        result?.refreshToken ??
        envelope?.refreshToken ??
        envelope?.data?.refreshToken ??
        null
    );
};
