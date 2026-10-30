import axiosInstance from '../../instance';
import { getEnvelope, getEnvelopeMessage } from './envelope';

const identity = (data) => data;

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

export const postWithoutBody = (path) => async () =>
    assertSuccess(await axiosInstance.post(path));

// Fill `{param}` placeholders in a path from `params`: '/api/delete/{id}' + { id: 7 } → '/api/delete/7'.
export const fillPath = (path, params = {}) =>
    path.replace(/\{(\w+)\}/g, (_, key) => {
        const value = params?.[key];

        if (value === undefined || value === null || value === '') {
            throw new Error(`Missing "${key}" for ${path}`);
        }

        return encodeURIComponent(value);
    });

export const deleteRequest =
    (path, mapPayload = identity) =>
    async (data = {}) =>
        assertSuccess(await axiosInstance.delete(fillPath(path, mapPayload(data))));

export const stripPaginationParams = (body = {}) => {
    const { start: _start, limit: _limit, searchTerm: _searchTerm, ...rest } = body ?? {};

    return rest;
};

export const downloadBlob = async (path, body = {}) => {
    const response = await axiosInstance.post(path, body, { responseType: 'blob' });

    return response?.data ?? null;
};

export const uploadFile = async (path, formData) =>
    assertSuccess(
        await axiosInstance.post(path, formData, {
            headers: { 'Content-Type': undefined },
        })
    );
