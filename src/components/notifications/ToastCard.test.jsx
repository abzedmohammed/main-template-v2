import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastCard from './ToastCard';

const renderCard = (props = {}) =>
    render(
        <ToastCard
            toastObj={{ id: 'a', visible: true, message: 'Saved!' }}
            tone="success"
            durationMs={4000}
            onClose={() => {}}
            {...props}
        />
    );

describe('ToastCard', () => {
    it('shows the message', () => {
        renderCard();

        expect(screen.getByText('Saved!')).toBeVisible();
    });

    it('announces errors as alerts and other tones as status', () => {
        const { unmount } = renderCard({ tone: 'error' });
        expect(screen.getByRole('alert')).toBeInTheDocument();
        unmount();

        renderCard({ tone: 'success' });
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('falls back to the info style for an unknown tone', () => {
        renderCard({ tone: 'weird' });

        expect(screen.getByRole('status')).toHaveClass('toast_card_info');
    });

    it('calls onClose when the close button is clicked', async () => {
        const onClose = vi.fn();
        renderCard({ onClose });

        await userEvent.click(screen.getByRole('button', { name: 'Close notification' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
