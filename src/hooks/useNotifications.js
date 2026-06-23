import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    executeNotificationAction,
    fetchNotifications,
    fetchUnreadNotificationsCount,
    markAllNotificationsRead,
    markNotificationRead,
    notificationsQueryKeys,
} from '../actions/notifications';

const DEFAULT_LIST_PARAMS = {
    page: 0,
    size: 20,
    unreadOnly: false,
};

const getNotificationId = (item = {}) =>
    item?.inboxId ?? item?.notificationId ?? item?.id ?? item?.notId ?? null;

const getNotificationTitle = (item = {}) =>
    item?.title ??
    item?.subject ??
    item?.notTitle ??
    item?.notificationTitle ??
    'Notification';

const getNotificationDescription = (item = {}) =>
    item?.message ??
    item?.body ??
    item?.description ??
    item?.notMessage ??
    item?.notificationMessage ??
    '';

const getNotificationTimestamp = (item = {}) =>
    item?.createdAt ??
    item?.createdDate ??
    item?.timestamp ??
    item?.sentAt ??
    item?.dateCreated ??
    item?.notCreatedAt ??
    null;

const isNotificationUnread = (item = {}) => {
    if (typeof item?.unread === 'boolean') return item.unread;
    if (typeof item?.isRead === 'boolean') return !item.isRead;
    if (typeof item?.read === 'boolean') return !item.read;

    const status = String(
        item?.status ?? item?.notificationStatus ?? item?.notStatus ?? ''
    ).toUpperCase();

    return status === 'UNREAD' || status === 'NEW' || status === 'PENDING';
};

const getSectionLabel = (timestamp) => {
    if (!timestamp) return 'RECENT';

    const value = dayjs(timestamp);
    if (!value.isValid()) return 'RECENT';
    if (value.isSame(dayjs(), 'day')) return 'TODAY';
    if (value.isSame(dayjs().subtract(1, 'day'), 'day')) return 'YESTERDAY';
    return value.format('DD MMM YYYY').toUpperCase();
};

const getTimeLabel = (timestamp) => {
    if (!timestamp) return '';

    const value = dayjs(timestamp);
    if (!value.isValid()) return '';
    return value.format('h:mm A');
};

const parseNotificationActionPayload = (payload) => {
    if (!payload) {
        return { options: [], requiresFields: [] };
    }

    let normalizedPayload = payload;

    if (typeof payload === 'string') {
        try {
            normalizedPayload = JSON.parse(payload);
        } catch {
            return { options: [], requiresFields: [] };
        }
    }

    const options = Array.isArray(normalizedPayload?.options)
        ? normalizedPayload.options.map((option, index) => ({
              key: option?.key ?? option?.label ?? `option-${index}`,
              label: option?.label ?? 'Continue',
              method: String(option?.method ?? 'POST').toUpperCase(),
              body: option?.body ?? {},
          }))
        : [];

    return {
        options,
        requiresFields: Array.isArray(normalizedPayload?.requiresFields)
            ? normalizedPayload.requiresFields
            : [],
    };
};

const mapNotificationToDisplay = (item = {}) => ({
    id: getNotificationId(item),
    title: getNotificationTitle(item),
    description: getNotificationDescription(item),
    timeLabel: getTimeLabel(getNotificationTimestamp(item)),
    sectionLabel: getSectionLabel(getNotificationTimestamp(item)),
    unread: isNotificationUnread(item),
    category: item?.category ?? item?.referenceType ?? 'GENERAL',
    priority: String(item?.priority ?? 'NORMAL').toUpperCase(),
    actionRequired: Boolean(item?.actionRequired),
    actionKind: item?.actionKind ?? null,
    actionUrl: item?.actionUrl ?? null,
    actionConfig: parseNotificationActionPayload(item?.actionPayload),
    raw: item,
});

export function useNotifications({
    listParams = DEFAULT_LIST_PARAMS,
    enabled = true,
    refetchInterval = false,
} = {}) {
    const queryClient = useQueryClient();

    const listQuery = useQuery({
        queryKey: [...notificationsQueryKeys.list, listParams],
        queryFn: () => fetchNotifications(listParams),
        enabled,
        refetchInterval,
        refetchOnWindowFocus: true,
    });

    const unreadCountQuery = useQuery({
        queryKey: notificationsQueryKeys.unreadCount,
        queryFn: fetchUnreadNotificationsCount,
        enabled,
        refetchInterval,
        refetchOnWindowFocus: true,
    });

    const invalidateNotifications = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: notificationsQueryKeys.list,
            }),
            queryClient.invalidateQueries({
                queryKey: notificationsQueryKeys.unreadCount,
            }),
        ]);
    };

    const markReadMutation = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: invalidateNotifications,
    });

    const markAllReadMutation = useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: invalidateNotifications,
    });

    const actionMutation = useMutation({
        mutationFn: executeNotificationAction,
        onSuccess: invalidateNotifications,
    });

    const items = useMemo(
        () =>
            Array.isArray(listQuery.data?.content)
                ? listQuery.data.content.map(mapNotificationToDisplay)
                : [],
        [listQuery.data]
    );

    const unreadCount = Number(
        unreadCountQuery.data?.count ?? items.filter((item) => item.unread).length
    );

    return {
        ...listQuery,
        notifications: items,
        unreadCount,
        total: Number(listQuery.data?.total ?? items.length),
        totalPages: Number(listQuery.data?.totalPages ?? 0),
        currentPage: Number(listQuery.data?.currentPage ?? 0),
        markNotificationRead: markReadMutation.mutateAsync,
        markAllNotificationsRead: markAllReadMutation.mutateAsync,
        executeNotificationAction: actionMutation.mutateAsync,
        isMarkingNotificationRead: markReadMutation.isPending,
        isMarkingAllNotificationsRead: markAllReadMutation.isPending,
        isExecutingNotificationAction: actionMutation.isPending,
    };
}
