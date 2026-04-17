import { createMutationAction } from './helpers';
import { adminQueryKeys } from './queryKeys';

export const adminSaveAction = createMutationAction({
    path: '/save',
});

export const updateInAppNotificationAction = createMutationAction({
    path: '/update_in_app_notification',
    method: 'PUT',
    invalidateQueryKeys: [adminQueryKeys.inAppNotifications],
});

export const adminRefreshTokenAction = createMutationAction({
    path: '/auth/refresh-session',
});
