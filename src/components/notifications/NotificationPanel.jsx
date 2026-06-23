import { DynamicBtn, EmptyState, TextDynamic } from 'abzed-utils';

// Presentational notification list. State + data come from useNotifications via
// the NotificationBellButton; this component just renders and emits intents.
export default function NotificationPanel({
    notifications = [],
    unreadCount = 0,
    isLoading = false,
    isMarkingAll = false,
    onMarkRead,
    onMarkAllRead,
}) {
    return (
        <div className="notification_panel">
            <div className="fx_btwn_center notification_panel_head">
                <TextDynamic
                    tagName="h3"
                    text="Notifications"
                    color="#121212"
                    className="txt_1_medium"
                />
                {unreadCount > 0 ? (
                    <DynamicBtn
                        type="button"
                        text="Mark all read"
                        className="plain_btn notification_mark_all"
                        onClick={onMarkAllRead}
                        loading={isMarkingAll}
                    />
                ) : null}
            </div>

            <div className="notification_panel_body">
                {isLoading ? (
                    <TextDynamic
                        tagName="p"
                        text="Loading…"
                        color="#697077"
                        className="txt_8125 notification_panel_status"
                    />
                ) : notifications.length === 0 ? (
                    <EmptyState description="You're all caught up" />
                ) : (
                    notifications.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => item.unread && onMarkRead?.(item.id)}
                            className={`notification_item ${item.unread ? 'notification_item_unread' : ''}`}
                        >
                            <div className="fx_btwn_center gap-2">
                                <TextDynamic
                                    tagName="span"
                                    text={item.title}
                                    color="#121212"
                                    className="txt_875_medium"
                                />
                                <TextDynamic
                                    tagName="span"
                                    text={item.timeLabel}
                                    color="#9aa0a6"
                                    className="txt_75"
                                />
                            </div>
                            {item.description ? (
                                <TextDynamic
                                    tagName="p"
                                    text={item.description}
                                    color="#697077"
                                    className="txt_8125"
                                />
                            ) : null}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
