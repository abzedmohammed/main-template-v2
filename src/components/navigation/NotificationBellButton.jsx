import { useState } from 'react';
import { Badge, Popover } from 'antd';
import { useNotifications } from '../../hooks';
import { NotificationPanel } from '../notifications';
import { BellSvg } from '../../svgs';

// Header widget: bell + unread badge that opens the NotificationPanel. Owns the
// useNotifications data layer so the panel stays purely presentational.
export default function NotificationBellButton() {
    const [open, setOpen] = useState(false);
    const {
        notifications,
        unreadCount,
        isLoading,
        markNotificationRead,
        markAllNotificationsRead,
        isMarkingAllNotificationsRead,
    } = useNotifications({ enabled: true });

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            trigger="click"
            placement="bottomRight"
            content={
                <NotificationPanel
                    notifications={notifications}
                    unreadCount={unreadCount}
                    isLoading={isLoading}
                    isMarkingAll={isMarkingAllNotificationsRead}
                    onMarkRead={(id) => markNotificationRead({ inboxId: id })}
                    onMarkAllRead={() => markAllNotificationsRead()}
                />
            }
        >
            <button
                type="button"
                aria-label="Notifications"
                className="notification_bell"
            >
                <Badge count={unreadCount} size="small" overflowCount={99}>
                    <BellSvg />
                </Badge>
            </button>
        </Popover>
    );
}
