import axiosInstance from '../../instance';
import { getEnvelope, getEnvelopeMessage } from './envelope';

const identity = (data) => data;

// Throw on a `{ success: false }` envelope so the mutation/query onError path
// handles it instead of every call site checking the flag by hand.
const assertSuccess = (response) => {
    if (getEnvelope(response)?.success === false) {
        throw new Error(getEnvelopeMessage(response, 'Request failed'));
    }

    return response;
};

export const post =
    (path, mapPayload = identity) =>
    async (data = {}) =>
        assertSuccess(await axiosInstance.post(path, mapPayload(data)));

export const put =
    (path, mapPayload = identity) =>
    async (data = {}) =>
        assertSuccess(await axiosInstance.put(path, mapPayload(data)));

export const postWithoutBody = (path) => async () =>
    assertSuccess(await axiosInstance.post(path));

// Drop pagination params for endpoints that reject them (e.g. GET fetches).
export const stripPaginationParams = (body = {}) => {
    const { start: _start, limit: _limit, searchTerm: _searchTerm, ...rest } = body ?? {};

    return rest;
};

// Download a binary payload (PDF / blob export). Returns the Blob or null.
export const downloadBlob = async (path, body = {}) => {
    const response = await axiosInstance.post(path, body, { responseType: 'blob' });

    return response?.data ?? null;
};

// Multipart upload — clears the JSON Content-Type default so the browser sets
// the multipart boundary itself. Returns the (success-asserted) response.
export const uploadFile = async (path, formData) =>
    assertSuccess(
        await axiosInstance.post(path, formData, {
            headers: { 'Content-Type': undefined },
        })
    );
