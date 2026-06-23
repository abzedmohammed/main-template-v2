import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import SessionLockScreen from './SessionLockScreen';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';

vi.mock('../services/authService', () => ({
    authService: { logout: vi.fn() },
}));

function renderLock(onUnlocked = vi.fn()) {
    const noopSlice = createSlice({ name: 'noop', initialState: {}, reducers: {} });
    const store = configureStore({ reducer: { noop: noopSlice.reducer } });

    render(
        <Provider store={store}>
            <SessionLockScreen onUnlocked={onUnlocked} />
        </Provider>
    );

    return { onUnlocked };
}

describe('SessionLockScreen', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });

    it('shows the secured-session message', () => {
        renderLock();

        expect(screen.getByText('Session secured')).toBeInTheDocument();
    });

    it('refreshes the session and unlocks on "Continue working"', async () => {
        const refreshSession = vi.spyOn(tokenService, 'refreshSession');
        const { onUnlocked } = renderLock();

        await userEvent.click(screen.getByRole('button', { name: 'Continue working' }));

        expect(refreshSession).toHaveBeenCalled();
        expect(onUnlocked).toHaveBeenCalled();
    });

    it('logs out on "Log out"', async () => {
        renderLock();

        await userEvent.click(screen.getByRole('button', { name: 'Log out' }));

        expect(authService.logout).toHaveBeenCalled();
    });
});
