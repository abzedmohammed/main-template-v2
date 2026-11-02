import {
    accountResendOtp,
    accountVerification,
    forgotPasswordAction,
    forgotPasswordVerificationAction,
    loginAction,
    refreshSessionAction,
    registerAction,
    updatePasswordAction,
} from './actions';
import {
    authOtpStateFn,
    authStateFn,
    maskedEmailStateFn,
    userIdStateFn,
} from '../../features/auth/authSlice';
import { tokenService } from '../../services/tokenService';
import { errorToast, successToast } from '../../utils';
import { ROUTES } from '../../routes';

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../../routes', async () => ({
    ROUTES: (await import('../../routes/paths')).ROUTES,
}));

// Toasts are the UI boundary — spy on them, keep the rest of utils real.
vi.mock('../../utils', async (importOriginal) => ({
    ...(await importOriginal()),
    errorToast: vi.fn(),
    successToast: vi.fn(),
}));

// Unsigned JWT — jwt-decode only reads the payload.
const fakeJwt = (claims) =>
    ['e30', btoa(JSON.stringify(claims)).replace(/=+$/, ''), 'sig'].join('.');

const envelope = (result, message = 'Request successful') => ({
    success: true,
    message,
    data: { result },
});

const initResult = { reqId: 'req-1', maskedEmail: 'ja****@example.com', otpTimer: 5 };

beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

describe.each([
    ['loginAction', loginAction, '/auth/sign_in', ROUTES.AUTH.LOGIN_OTP_VERIFICATION],
    [
        'registerAction',
        registerAction,
        '/auth/sign_up',
        ROUTES.AUTH.REGISTRATION_VERIFICATION,
    ],
    [
        'forgotPasswordAction',
        forgotPasswordAction,
        '/auth/reset_password',
        ROUTES.AUTH.FORGOT_PASSWORD_VERIFICATION,
    ],
])('%s (starts an OTP flow)', (_, action, endpoint, verifyRoute) => {
    it('targets the right endpoint', () => {
        expect(action.endpoint).toBe(endpoint);
        expect(action.errorToast).toBe(errorToast);
    });

    it('stores reqId, masked email and timer (in seconds), then opens verification', () => {
        const dispatch = vi.fn();
        const navigate = vi.fn();

        action.successToast({
            response: envelope(initResult, 'Verification code sent'),
            dispatch,
            navigate,
        });

        expect(dispatch).toHaveBeenCalledWith(userIdStateFn('req-1'));
        expect(dispatch).toHaveBeenCalledWith(maskedEmailStateFn('ja****@example.com'));
        expect(dispatch).toHaveBeenCalledWith(authOtpStateFn(300));
        expect(successToast).toHaveBeenCalledWith('Verification code sent');
        expect(navigate).toHaveBeenCalledWith(verifyRoute);
    });

    it('shows an error and stays put when the response has no reqId', () => {
        const navigate = vi.fn();

        action.successToast({ response: envelope(null), dispatch: vi.fn(), navigate });

        expect(errorToast).toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
    });
});

describe('accountVerification', () => {
    it('saves the access token and hydrates the session user', () => {
        const dispatch = vi.fn();
        const navigate = vi.fn();
        const accessToken = fakeJwt({ sub: 'u-1', role: 'ADMIN' });
        const user = {
            usrId: 'u-1',
            usrEmail: 'jane@example.com',
            usrFullName: 'Jane Doe',
            usrMobileNumber: '0712345678',
            usrRoleCode: 'ADMIN',
        };

        accountVerification.successToast({
            response: envelope({ accessToken, user }, 'Login successful'),
            dispatch,
            navigate,
        });

        expect(tokenService.get()).toBe(accessToken);
        expect(dispatch.mock.calls[0][0].type).toBe(authStateFn.type);
        expect(dispatch.mock.calls[0][0].payload).toMatchObject({
            ...user,
            role: 'ADMIN',
        });
        expect(successToast).toHaveBeenCalledWith('Login successful');
        expect(navigate).toHaveBeenCalledWith(ROUTES.DASHBOARD, { replace: true });
    });

    it('fills usrRoleCode from the JWT role claim when the user lacks it', () => {
        const dispatch = vi.fn();

        accountVerification.successToast({
            response: envelope({
                accessToken: fakeJwt({ role: 'USER' }),
                user: { usrId: 'u-1' },
            }),
            dispatch,
            navigate: vi.fn(),
        });

        expect(dispatch.mock.calls[0][0].payload.usrRoleCode).toBe('USER');
    });

    it('errors and stores nothing without a token', () => {
        const dispatch = vi.fn();

        accountVerification.successToast({
            response: envelope(null),
            dispatch,
            navigate: vi.fn(),
        });

        expect(errorToast).toHaveBeenCalledWith('Could not verify account');
        expect(tokenService.get()).toBeNull();
        expect(dispatch).not.toHaveBeenCalled();
    });
});

describe('accountResendOtp', () => {
    it('toasts the envelope message', () => {
        accountResendOtp.successToast({
            response: envelope(null, 'Verification code resent'),
        });

        expect(accountResendOtp.endpoint).toBe('/auth/resend_otp');
        expect(successToast).toHaveBeenCalledWith('Verification code resent');
    });
});

describe('forgotPasswordVerificationAction', () => {
    it('goes to the update-password screen (reset flow returns no session)', () => {
        const navigate = vi.fn();

        forgotPasswordVerificationAction.successToast({
            response: envelope(null, 'OTP verified'),
            navigate,
        });

        expect(tokenService.get()).toBeNull();
        expect(navigate).toHaveBeenCalledWith(ROUTES.AUTH.UPDATE_PASSWORD);
    });
});

describe('updatePasswordAction', () => {
    it('toasts and redirects to login', () => {
        updatePasswordAction.successToast({
            response: envelope(null, 'Password updated successfully'),
        });

        expect(successToast).toHaveBeenCalledWith('Password updated successfully');
        expect(updatePasswordAction.redirectTo).toBe(ROUTES.AUTH.LOGIN);
    });
});

describe('refreshSessionAction', () => {
    it('stores the re-issued token', () => {
        refreshSessionAction.successToast({
            response: envelope({ token: 'fresh-token' }),
        });

        expect(tokenService.get()).toBe('fresh-token');
    });

    it('leaves the stored token alone when none comes back', () => {
        tokenService.set('old-token');

        refreshSessionAction.successToast({ response: envelope(null) });

        expect(tokenService.get()).toBe('old-token');
    });
});
