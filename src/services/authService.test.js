import { authService } from './authService';
import { tokenService } from './tokenService';

vi.mock('../features/auth/authSlice', () => ({
    logoutStateFn: () => ({ type: 'auth/logout' }),
}));

describe('authService', () => {
    it('clears token and dispatches logout', () => {
        const dispatch = vi.fn();
        tokenService.set('abc123');

        authService.logout({ dispatch, redirect: false });

        expect(tokenService.get()).toBeNull();
        expect(dispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
    });

    it('redirects to dashboard with navigate when provided', () => {
        const navigate = vi.fn();

        authService.redirectToDashboard({ navigate });

        expect(navigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
});
