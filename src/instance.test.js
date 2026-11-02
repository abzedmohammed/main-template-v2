import axiosInstance from './instance';
import { subscribeSessionExpired } from './services/sessionEvents';
import { tokenService } from './services/tokenService';

const [requestInterceptor] = axiosInstance.interceptors.request.handlers;
const [responseInterceptor] = axiosInstance.interceptors.response.handlers;

const unauthorized = { response: { status: 401 } };

describe('axios instance', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('sends the stored token as a Bearer header', () => {
        tokenService.set('abc');

        const config = requestInterceptor.fulfilled({ headers: {} });

        expect(config.headers.Authorization).toBe('Bearer abc');
    });

    it('sends no Authorization header when signed out', () => {
        const config = requestInterceptor.fulfilled({ headers: {} });

        expect(config.headers.Authorization).toBeUndefined();
    });

    it('signals a forced sign-out on a 401 during a session', async () => {
        tokenService.set('abc');
        const listener = vi.fn();
        const unsubscribe = subscribeSessionExpired(listener);

        await expect(responseInterceptor.rejected(unauthorized)).rejects.toBe(
            unauthorized
        );

        expect(listener).toHaveBeenCalledWith('forced-401');
        unsubscribe();
    });

    it('does not signal on a 401 without a session (e.g. wrong password)', async () => {
        const listener = vi.fn();
        const unsubscribe = subscribeSessionExpired(listener);

        await expect(responseInterceptor.rejected(unauthorized)).rejects.toBe(
            unauthorized
        );

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
    });
});
