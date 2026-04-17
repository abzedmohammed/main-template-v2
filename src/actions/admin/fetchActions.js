import { createFetchAction, stripPaginationParams } from './helpers';
import { adminQueryKeys } from './queryKeys';

export const fetchInAppNotificationsAction = createFetchAction({
    queryKey: adminQueryKeys.inAppNotifications,
    path: '/fetch_in_app_notification',
    method: 'GET',
    sanitizeBody: stripPaginationParams,
});
