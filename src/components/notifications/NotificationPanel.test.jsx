import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotificationPanel from './NotificationPanel';

const items = [
    {
        id: '1',
        title: 'New message',
        description: 'Hello there',
        timeLabel: '9:00 AM',
        unread: true,
    },
    {
        id: '2',
        title: 'Payment received',
        description: 'KES 100',
        timeLabel: 'Yesterday',
        unread: false,
    },
];

describe('NotificationPanel', () => {
    it('renders the notifications', () => {
        render(<NotificationPanel notifications={items} unreadCount={1} />);

        expect(screen.getByText('New message')).toBeInTheDocument();
        expect(screen.getByText('Payment received')).toBeInTheDocument();
    });

    it('shows an empty state when there are none', () => {
        render(<NotificationPanel notifications={[]} unreadCount={0} />);

        expect(screen.getByText("You're all caught up")).toBeInTheDocument();
    });

    it('marks a single unread notification read on click', async () => {
        const onMarkRead = vi.fn();
        render(
            <NotificationPanel
                notifications={items}
                unreadCount={1}
                onMarkRead={onMarkRead}
            />
        );

        await userEvent.click(screen.getByText('New message'));

        expect(onMarkRead).toHaveBeenCalledWith('1');
    });

    it('does not mark an already-read notification', async () => {
        const onMarkRead = vi.fn();
        render(
            <NotificationPanel
                notifications={items}
                unreadCount={1}
                onMarkRead={onMarkRead}
            />
        );

        await userEvent.click(screen.getByText('Payment received'));

        expect(onMarkRead).not.toHaveBeenCalled();
    });

    it('calls onMarkAllRead from the header action', async () => {
        const onMarkAllRead = vi.fn();
        render(
            <NotificationPanel
                notifications={items}
                unreadCount={1}
                onMarkAllRead={onMarkAllRead}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: 'Mark all read' }));

        expect(onMarkAllRead).toHaveBeenCalled();
    });

    it('hides the mark-all action when nothing is unread', () => {
        render(<NotificationPanel notifications={items} unreadCount={0} />);

        expect(
            screen.queryByRole('button', { name: 'Mark all read' })
        ).not.toBeInTheDocument();
    });
});
