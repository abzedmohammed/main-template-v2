import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { authService } from '../services/authService';
import { emitSessionExpired } from '../services/sessionEvents';
import { tokenService } from '../services/tokenService';
import {
    sessionExpiryCountdownSeconds,
    sessionIdleTimeoutMinutes,
    sessionMaxDurationMinutes,
    sessionWarningCountdownSeconds,
} from '../utils';
import { useTokenExpiryChecker } from './useTokenExpiryChecker';

vi.mock('../services/authService', () => ({
    authService: { logout: vi.fn() },
}));

const IDLE_MS = sessionIdleTimeoutMinutes * 60 * 1000;
const WARNING_MS = sessionWarningCountdownSeconds * 1000;
const MAX_MS = sessionMaxDurationMinutes * 60 * 1000;

function Host() {
    return useTokenExpiryChecker();
}

const renderChecker = ({ isActive = true } = {}) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
            auth: {
                isActive,
                user: null,
                userRole: isActive ? 'ADMIN' : null,
                userId: null,
                maskedEmail: null,
                otpTimer: null,
            },
        },
    });

    render(
        <Provider store={store}>
            <Host />
        </Provider>
    );
};

// Start a session whose last activity was `idleForMs` ago.
const startSessionIdleFor = (idleForMs) => {
    tokenService.set('token');
    tokenService.startSession(Date.now() - idleForMs);
};

// Start a session `ageMs` old whose user is active right now (only the cap applies).
const startActiveSessionAged = (ageMs) => {
    tokenService.set('token');
    tokenService.startSession(Date.now() - ageMs);
    tokenService.touchActivity(Date.now());
};

// Let the initial check (scheduled on a 0ms timeout) run.
const flush = () => act(() => vi.advanceTimersByTime(10));

describe('useTokenExpiryChecker', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders nothing when signed out', () => {
        renderChecker({ isActive: false });
        flush();

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('stays quiet during a fresh, active session', () => {
        startSessionIdleFor(0);
        renderChecker();
        flush();

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('warns before the idle limit and lets the user continue', async () => {
        startSessionIdleFor(IDLE_MS - WARNING_MS / 2);
        renderChecker();
        flush();

        expect(await screen.findByText('Session about to expire')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

        expect(screen.queryByText('Session about to expire')).not.toBeInTheDocument();
        expect(authService.logout).not.toHaveBeenCalled();
    });

    it('times out after the idle limit and logs out when the countdown ends', async () => {
        startSessionIdleFor(IDLE_MS + 1000);
        renderChecker();
        flush();

        expect(await screen.findByText('Session timed out')).toBeInTheDocument();

        for (let second = 0; second <= sessionExpiryCountdownSeconds; second += 1) {
            act(() => vi.advanceTimersByTime(1000));
        }

        expect(authService.logout).toHaveBeenCalledTimes(1);
    });

    it('warns an active user before the session cap and lets them continue', async () => {
        startActiveSessionAged(MAX_MS - WARNING_MS / 2);
        renderChecker();
        flush();

        expect(await screen.findByText('Secure session ending soon')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

        expect(screen.queryByText('Secure session ending soon')).not.toBeInTheDocument();
        expect(authService.logout).not.toHaveBeenCalled();
    });

    it('logs an active user out once the session cap is reached', async () => {
        startActiveSessionAged(MAX_MS + 1000);
        renderChecker();
        flush();

        expect(await screen.findByText('Session ended')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Continue' })
        ).not.toBeInTheDocument();

        for (let second = 0; second <= sessionExpiryCountdownSeconds; second += 1) {
            act(() => vi.advanceTimersByTime(1000));
        }

        expect(authService.logout).toHaveBeenCalledTimes(1);
    });

    it('treats a 401 during the session as a forced sign-out', async () => {
        startSessionIdleFor(0);
        renderChecker();
        flush();

        act(() => emitSessionExpired('forced-401'));

        expect(await screen.findByText('Session expired')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Log in again' }));

        expect(authService.logout).toHaveBeenCalledTimes(1);
    });

    it('ends the session when the token disappears', async () => {
        startSessionIdleFor(0);
        renderChecker();
        flush();

        act(() => {
            localStorage.removeItem('token');
            vi.advanceTimersByTime(1000);
        });

        expect(await screen.findByText('Session expired')).toBeInTheDocument();
    });
});
