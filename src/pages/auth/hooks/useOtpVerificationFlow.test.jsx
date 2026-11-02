import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../features/auth/authSlice';
import axiosInstance from '../../../instance';
import { useOtpVerificationFlow } from './useOtpVerificationFlow';

vi.mock('../../../instance', () => ({ default: { post: vi.fn() } }));

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../../../routes', async () => ({
    ROUTES: (await import('../../../routes/paths')).ROUTES,
}));

const ok = { data: { success: true, message: 'OK', data: { result: null } } };

const renderOtpHook = ({ otpTimer = 300, verifyAction } = {}) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: {
            auth: {
                isActive: false,
                user: null,
                userRole: null,
                userId: 'req-1',
                maskedEmail: 'ja****@example.com',
                otpTimer,
            },
        },
    });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const wrapper = ({ children }) => (
        <QueryClientProvider client={client}>
            <Provider store={store}>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        </QueryClientProvider>
    );

    const action = verifyAction ?? { mutationFn: vi.fn().mockResolvedValue(ok) };

    return {
        action,
        ...renderHook(() => useOtpVerificationFlow({ verifyAction: action }), {
            wrapper,
        }),
    };
};

describe('useOtpVerificationFlow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        axiosInstance.post.mockResolvedValue(ok);
    });

    it('exposes the pending flow from the store', () => {
        const { result } = renderOtpHook();

        expect(result.current.userId).toBe('req-1');
        expect(result.current.maskedEmail).toBe('ja****@example.com');
        expect(result.current.timer).toBe(300);
    });

    it('verifies with { reqId, otp }', async () => {
        const { result, action } = renderOtpHook();

        act(() => result.current.setOtp('1234'));
        act(() => result.current.handleVerifyOtp());

        await waitFor(() =>
            expect(action.mutationFn).toHaveBeenCalledWith(
                { reqId: 'req-1', otp: '1234' },
                expect.anything()
            )
        );
    });

    it('blocks resend while the countdown is running', () => {
        const { result } = renderOtpHook({ otpTimer: 300 });

        act(() => result.current.handleResendOtp());

        expect(axiosInstance.post).not.toHaveBeenCalled();
    });

    it('resends with { reqId } once the countdown is over', async () => {
        const { result } = renderOtpHook({ otpTimer: 0 });

        act(() => result.current.handleResendOtp());

        await waitFor(() =>
            expect(axiosInstance.post).toHaveBeenCalledWith('/auth/resend_otp', {
                reqId: 'req-1',
            })
        );
    });

    it('counts down once per second', () => {
        vi.useFakeTimers();
        const { result } = renderOtpHook({ otpTimer: 3 });

        act(() => vi.advanceTimersByTime(2000));

        expect(result.current.timer).toBe(1);
        vi.useRealTimers();
    });
});
