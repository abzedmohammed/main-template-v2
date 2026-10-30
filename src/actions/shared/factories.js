import axiosInstance from '../../instance';
import { errorToast, successToast } from '../../utils';
import {
    extractList,
    getEnvelopeMessage,
    getEnvelopeResult,
    getEnvelopeTotal,
} from './envelope';
import { deleteRequest, post, postWithoutBody } from './http';

const REQUEST_BUILDERS = { POST: post, DELETE: deleteRequest };

const dedupeQueryKeys = (queryKeys = []) => {
    const seen = new Set();

    return queryKeys.filter((key) => {
        const id = JSON.stringify(key ?? null);

        if (seen.has(id)) return false;

        seen.add(id);
        return true;
    });
};

export const createMutationAction = ({
    path,
    method = 'POST',
    successMessage,
    invalidateQueryKeys = [],
    mapPayload,
    withBody = true,
    onSuccess: onSuccessOverride,
}) => {
    const build = REQUEST_BUILDERS[method] ?? post;
    const mutationFn =
        withBody || method === 'DELETE' ? build(path, mapPayload) : postWithoutBody(path);

    return {
        method,
        endpoint: path,
        mutationFn,
        errorToast,
        invalidateQueryKeys: dedupeQueryKeys(invalidateQueryKeys),
        ...(onSuccessOverride
            ? { onSuccess: onSuccessOverride }
            : successMessage
              ? {
                    onSuccess: ({ response }) =>
                        successToast(getEnvelopeMessage(response, successMessage)),
                }
              : {}),
    };
};

export const createFetchAction = ({
    queryKey,
    path,
    method = 'POST',
    sanitizeBody = (body) => body,
}) => {
    const requestFn = (body = {}) =>
        method === 'GET'
            ? axiosInstance.get(path, { params: sanitizeBody(body) })
            : axiosInstance.post(path, sanitizeBody(body));

    return { method, endpoint: path, queryKey, requestFn, queryFn: requestFn };
};

// Await a request and return just the business payload (envelope.data.result).
export const readResult = async (request) => getEnvelopeResult(await request);

// Await a list request and return a normalised { result, total }.
export const readList = async (request) => {
    const response = await request;

    return {
        result: extractList(getEnvelopeResult(response)),
        total: getEnvelopeTotal(response),
    };
};
