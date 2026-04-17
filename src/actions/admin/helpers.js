import axiosInstance from '../../instance';
import { notifyError, notifySuccess } from '../../utils';

export const post =
    (path, mapPayload = (data) => data) =>
    async (data = {}) =>
        axiosInstance.post(path, mapPayload(data));

export const put =
    (path, mapPayload = (data) => data) =>
    async (data = {}) =>
        axiosInstance.put(path, mapPayload(data));

export const stripPaginationParams = (body = {}) => {
    const { start: _start, limit: _limit, searchTerm: _searchTerm, ...rest } = body ?? {};

    return rest;
};

export const createFetchAction = ({
    queryKey,
    path,
    method = 'POST',
    sanitizeBody = (body) => body,
}) => {
    const requestFn = async (body = {}) => {
        if (method === 'GET') {
            return axiosInstance.get(path, {
                params: sanitizeBody(body),
            });
        }

        return axiosInstance.post(path, sanitizeBody(body));
    };

    return {
        method,
        endpoint: path,
        queryKey,
        requestFn,
        queryFn: async (body = {}) => requestFn(body),
    };
};

export const createMutationAction = ({
    path,
    method = 'POST',
    successMessage,
    invalidateQueryKeys = [],
    mapPayload = (data) => data,
}) => {
    const mutationFn = method === 'PUT' ? put(path, mapPayload) : post(path, mapPayload);

    return {
        method,
        endpoint: path,
        mutationFn,
        onError: notifyError,
        invalidateQueryKeys: dedupeQueryKeys(invalidateQueryKeys),
        ...(successMessage
            ? {
                  onSuccess: ({ response }) => {
                      notifySuccess(response?.message || successMessage);
                  },
              }
            : {}),
    };
};

const dedupeQueryKeys = (queryKeys = []) => {
    const seen = new Set();

    return queryKeys.filter((queryKey) => {
        const serialized = JSON.stringify(queryKey ?? null);

        if (seen.has(serialized)) {
            return false;
        }

        seen.add(serialized);
        return true;
    });
};
