import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import axiosInstance from '../../instance';
import { tokenService } from '../../services/tokenService';
import { ROUTES } from '../../routes/paths';
import {
    ForgotPassword,
    ForgotPasswordVerification,
    Login,
    LoginOTPVerification,
    RegistrationVerification,
    UpdatePassword,
} from '.';

vi.mock('../../instance', () => ({ default: { post: vi.fn() } }));

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../../routes', async () => ({
    ROUTES: (await import('../../routes/paths')).ROUTES,
}));

const signedOut = {
    isActive: false,
    user: null,
    userRole: null,
    userId: null,
    maskedEmail: null,
    otpTimer: null,
};

const pendingOtp = {
    ...signedOut,
    userId: 'req-1',
    maskedEmail: 'ja****@example.com',
    otpTimer: 300,
};

const renderPage = (path, element, auth = signedOut) => {
    const store = configureStore({
        reducer: { auth: authReducer },
        preloadedState: { auth: auth },
    });
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

    render(
        <QueryClientProvider client={client}>
            <Provider store={store}>
                <MemoryRouter initialEntries={[path]}>
                    <Routes>
                        <Route path={path} element={element} />
                        {path !== ROUTES.AUTH.LOGIN && (
                            <Route
                                path={ROUTES.AUTH.LOGIN}
                                element={<div>login screen</div>}
                            />
                        )}
                        <Route path="*" element={<div>other screen</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        </QueryClientProvider>
    );

    return store;
};

describe('auth pages', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        axiosInstance.post.mockResolvedValue({
            data: { success: true, message: 'OK', data: { result: null } },
        });
    });

    describe('Login', () => {
        it('ends any previous session on arrival', () => {
            tokenService.set('stale-token');

            const store = renderPage(ROUTES.AUTH.LOGIN, <Login />, {
                ...signedOut,
                isActive: true,
                userRole: 'ADMIN',
            });

            expect(tokenService.get()).toBeNull();
            expect(store.getState().auth).toEqual(signedOut);
        });

        it('posts { email, secret } to /auth/sign_in', async () => {
            renderPage(ROUTES.AUTH.LOGIN, <Login />);

            await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
            await userEvent.type(screen.getByLabelText('Password'), 'Password@123');
            await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

            await waitFor(() =>
                expect(axiosInstance.post).toHaveBeenCalledWith('/auth/sign_in', {
                    email: 'jane@example.com',
                    secret: 'Password@123',
                })
            );
        });
    });

    describe('ForgotPassword', () => {
        it('posts { email } to /auth/reset_password', async () => {
            renderPage(ROUTES.AUTH.FORGOT_PASSWORD, <ForgotPassword />);

            await userEvent.type(screen.getByLabelText('Email'), 'jane@example.com');
            await userEvent.click(screen.getByRole('button', { name: 'Send code' }));

            await waitFor(() =>
                expect(axiosInstance.post).toHaveBeenCalledWith('/auth/reset_password', {
                    email: 'jane@example.com',
                })
            );
        });
    });

    describe('UpdatePassword', () => {
        it('posts { reqId, password } to /auth/update_password', async () => {
            renderPage(ROUTES.AUTH.UPDATE_PASSWORD, <UpdatePassword />, pendingOtp);

            await userEvent.type(screen.getByLabelText('New password'), 'Password@123');
            await userEvent.type(
                screen.getByLabelText('Confirm password'),
                'Password@123'
            );
            await userEvent.click(
                screen.getByRole('button', { name: 'Update password' })
            );

            await waitFor(() =>
                expect(axiosInstance.post).toHaveBeenCalledWith('/auth/update_password', {
                    reqId: 'req-1',
                    password: 'Password@123',
                })
            );
        });

        it('does not submit mismatched passwords', async () => {
            renderPage(ROUTES.AUTH.UPDATE_PASSWORD, <UpdatePassword />, pendingOtp);

            await userEvent.type(screen.getByLabelText('New password'), 'Password@123');
            await userEvent.type(
                screen.getByLabelText('Confirm password'),
                'Password@124'
            );
            await userEvent.click(
                screen.getByRole('button', { name: 'Update password' })
            );

            expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
            expect(axiosInstance.post).not.toHaveBeenCalled();
        });
    });

    describe('pages that need a pending OTP flow', () => {
        it.each([
            [
                'LoginOTPVerification',
                ROUTES.AUTH.LOGIN_OTP_VERIFICATION,
                <LoginOTPVerification key="l" />,
            ],
            [
                'RegistrationVerification',
                ROUTES.AUTH.REGISTRATION_VERIFICATION,
                <RegistrationVerification key="r" />,
            ],
            [
                'ForgotPasswordVerification',
                ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION,
                <ForgotPasswordVerification key="f" />,
            ],
            ['UpdatePassword', ROUTES.AUTH.UPDATE_PASSWORD, <UpdatePassword key="u" />],
        ])('%s redirects to login without one', (_, path, element) => {
            renderPage(path, element);

            expect(screen.getByText('login screen')).toBeInTheDocument();
        });

        it('shows the OTP screen with the masked email when a flow is pending', () => {
            renderPage(
                ROUTES.AUTH.LOGIN_OTP_VERIFICATION,
                <LoginOTPVerification />,
                pendingOtp
            );

            expect(
                screen.getByRole('heading', { name: "Verify it's you" })
            ).toBeInTheDocument();
            expect(
                screen.getByText('Enter the 4-digit code we sent to ja****@example.com.')
            ).toBeInTheDocument();
        });
    });
});
