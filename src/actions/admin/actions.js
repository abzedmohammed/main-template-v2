import {
    createFetchAction,
    createMutationAction,
    stripPaginationParams,
} from '../shared';
import { adminQueryKeys } from './queryKeys';

// --- Queries ---

export const fetchInAppNotificationsAction = createFetchAction({
    queryKey: adminQueryKeys.inAppNotifications,
    path: '/fetch_in_app_notification',
    method: 'GET',
    sanitizeBody: stripPaginationParams,
});

// --- Mutations ---

export const adminSaveAction = createMutationAction({ path: '/save' });

export const updateInAppNotificationAction = createMutationAction({
    path: '/update_in_app_notification',
    method: 'PUT',
    invalidateQueryKeys: [adminQueryKeys.inAppNotifications],
});

export const adminRefreshTokenAction = createMutationAction({
    path: '/auth/refresh-session',
});
