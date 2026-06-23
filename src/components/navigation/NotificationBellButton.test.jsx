import { render, screen } from '@testing-library/react';
import NotificationBellButton from './NotificationBellButton';

vi.mock('../../hooks', () => ({
    useNotifications: () => ({
        notifications: [
            {
                id: '1',
                title: 'Welcome',
                description: 'Thanks for joining',
                timeLabel: 'Now',
                unread: true,
            },
        ],
        unreadCount: 3,
        isLoading: false,
        markNotificationRead: vi.fn(),
        markAllNotificationsRead: vi.fn(),
        isMarkingAllNotificationsRead: false,
    }),
}));

describe('NotificationBellButton', () => {
    it('shows the unread count badge', () => {
        render(<NotificationBellButton />);

        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders an accessible trigger', () => {
        render(<NotificationBellButton />);

        expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
    });
});
