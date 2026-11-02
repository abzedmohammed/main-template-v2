import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast, { Toaster } from 'react-hot-toast';
import { errorNotification, infoNotification, successNotification } from '.';

describe('toast notifications', () => {
    beforeEach(() => {
        render(<Toaster />);
    });

    afterEach(() => {
        act(() => toast.remove());
    });

    it('shows a success toast with the message capitalised', async () => {
        act(() => successNotification('profile saved'));

        expect(await screen.findByText('Profile saved')).toBeInTheDocument();
        expect(screen.getByRole('status')).toHaveClass('toast_card_success');
    });

    it('announces errors as alerts', async () => {
        act(() => errorNotification('Request failed'));

        expect(await screen.findByRole('alert')).toHaveTextContent('Request failed');
    });

    it('falls back to the tone default for an empty message', async () => {
        act(() => infoNotification('   '));

        expect(
            await screen.findByText('You have a new notification.')
        ).toBeInTheDocument();
    });

    it('shows one toast for the same message raised twice', async () => {
        act(() => {
            successNotification('Saved');
            successNotification('Saved');
        });

        expect(await screen.findAllByText('Saved')).toHaveLength(1);
    });

    it('closes from the close button', async () => {
        act(() => infoNotification('Heads up'));
        await screen.findByText('Heads up');

        await userEvent.click(screen.getByRole('button', { name: 'Close notification' }));

        await waitFor(() =>
            expect(screen.getByRole('status')).toHaveClass('toast_card_exit')
        );
    });
});
