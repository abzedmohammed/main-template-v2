import axiosInstance from '../../instance';
import { onError, onSuccess } from '../../utils';
import {
    extractList,
    getEnvelopeMessage,
    getEnvelopeResult,
    getEnvelopeTotal,
} from './envelope';
import { post, postWithoutBody, put } from './http';

const REQUEST_BUILDERS = { POST: post, PUT: put };

const dedupeQueryKeys = (queryKeys = []) => {
    const seen = new Set();

    return queryKeys.filter((key) => {
        const id = JSON.stringify(key ?? null);

        if (seen.has(id)) return false;

        seen.add(id);
        return true;
    });
};

// Build a useDynamicMutation action config from a path. Pass `successMessage`
// for a toast, `invalidateQueryKeys` to refresh lists, `mapPayload` to reshape
// the body, `withBody: false` for bodyless POSTs, or a full `onSuccess`
// override for custom post-success flows.
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
    const mutationFn = withBody ? build(path, mapPayload) : postWithoutBody(path);

    return {
        method,
        endpoint: path,
        mutationFn,
        onError,
        invalidateQueryKeys: dedupeQueryKeys(invalidateQueryKeys),
        ...(onSuccessOverride
            ? { onSuccess: onSuccessOverride }
            : successMessage
              ? {
                    onSuccess: ({ response }) =>
                        onSuccess(getEnvelopeMessage(response, successMessage)),
                }
              : {}),
    };
};

// Build a usePaginatedQuery / useQuery-compatible fetch action.
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
