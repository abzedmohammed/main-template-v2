import axiosInstance from '../../instance';
import {
    extractList,
    getEnvelope,
    getEnvelopeMessage,
    getEnvelopeResult,
    post,
    postWithoutBody,
} from '../shared';

const fetchNotificationsRequest = post('/notifications/list');
const fetchUnreadCountRequest = postWithoutBody('/notifications/unread-count');
const markNotificationReadRequest = post('/notifications/read');
const markAllNotificationsReadRequest = postWithoutBody('/notifications/read-all');

// --- Queries ---

export const fetchNotifications = async ({
    page = 0,
    size = 20,
    unreadOnly = false,
} = {}) => {
    const response = await fetchNotificationsRequest({ page, size, unreadOnly });
    const result = getEnvelopeResult(response);
    const items = extractList(result);

    return {
        content: items,
        total: Number(
            result?.totalElements ??
                result?.total ??
                getEnvelope(response)?.data?.total ??
                items.length
        ),
        totalPages: Number(result?.totalPages ?? 0),
        currentPage: Number(result?.currentPage ?? page),
    };
};

export const fetchUnreadNotificationsCount = async () => {
    const response = await fetchUnreadCountRequest();
    const result = getEnvelopeResult(response);

    return {
        count: Number(
            result?.count ??
                result?.unreadCount ??
                getEnvelope(response)?.data?.total ??
                0
        ),
    };
};

// --- Mutations ---

export const markNotificationRead = ({ inboxId } = {}) =>
    markNotificationReadRequest({ inboxId });

export const markAllNotificationsRead = () => markAllNotificationsReadRequest();

// Execute a server-driven notification action — the notification payload
// carries its own `actionUrl` + HTTP method + body (e.g. "approve request").
export const executeNotificationAction = async ({
    actionUrl,
    method = 'POST',
    body,
} = {}) => {
    if (!actionUrl) {
        throw new Error('Notification action URL is missing.');
    }

    const normalizedMethod = String(method).toUpperCase();
    const config = { url: actionUrl, method: normalizedMethod };

    if (!['GET', 'HEAD'].includes(normalizedMethod)) {
        config.data = body ?? {};
    }

    const response = await axiosInstance.request(config);

    if (response?.data?.success === false) {
        throw new Error(
            getEnvelopeMessage(response, 'Could not complete notification action')
        );
    }

    return response;
};
