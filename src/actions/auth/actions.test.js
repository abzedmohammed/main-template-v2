import {
    accountVerification,
    loginAction,
    readOtpFlow,
    updatePasswordAction,
} from './actions';
import { tokenService } from '../../services/tokenService';
import { onError, onSuccess } from '../../utils';
import { ROUTES } from '../../routes';

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../../routes', async () => ({
    ROUTES: (await import('../../routes/paths')).ROUTES,
}));

// Toasts are the UI boundary — spy on them, keep the rest of utils real.
vi.mock('../../utils', async (importOriginal) => ({
    ...(await importOriginal()),
    onError: vi.fn(),
    onSuccess: vi.fn(),
}));

// Unsigned JWT — jwt-decode only reads the payload.
const fakeJwt = (claims) =>
    ['e30', btoa(JSON.stringify(claims)).replace(/=+$/, ''), 'sig'].join('.');

const envelope = (result, message = 'Request successful') => ({
    success: true,
    message,
    data: { result },
});

beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
});

describe('readOtpFlow', () => {
    it('reads reqId, maskedEmail and otpTimer from the init result', () => {
        const response = envelope({
            reqId: 'req-1',
            maskedEmail: 'ja****@example.com',
            otpTimer: 5,
        });

        expect(readOtpFlow(response)).toEqual({
            reqId: 'req-1',
            maskedEmail: 'ja****@example.com',
            otpTimer: 5,
        });
    });

    it('returns null when there is no reqId', () => {
        expect(readOtpFlow(envelope(null))).toBeNull();
    });
});

describe('loginAction', () => {
    it('stores the OTP flow and goes to login verification', () => {
        const dispatch = vi.fn();
        const navigate = vi.fn();

        loginAction.onSuccess({
            response: envelope(
                { reqId: 'req-1', maskedEmail: 'ja****@example.com', otpTimer: 5 },
                'Verification code sent'
            ),
            dispatch,
            navigate,
        });

        expect(dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: {
                    reqId: 'req-1',
                    maskedEmail: 'ja****@example.com',
                    otpTimer: 5,
                },
            })
        );
        expect(onSuccess).toHaveBeenCalledWith('Verification code sent');
        expect(navigate).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN_OTP_VERIFICATION);
    });

    it('shows an error and stays put when the response has no reqId', () => {
        const navigate = vi.fn();

        loginAction.onSuccess({ response: envelope(null), dispatch: vi.fn(), navigate });

        expect(onError).toHaveBeenCalledWith('Could not start login verification');
        expect(navigate).not.toHaveBeenCalled();
    });
});

describe('accountVerification', () => {
    it('saves the access token and hydrates the user with usrRoleCode', () => {
        const dispatch = vi.fn();
        const accessToken = fakeJwt({ sub: 'u-1', role: 'ADMIN' });
        const user = {
            usrId: 'u-1',
            usrEmail: 'jane@example.com',
            usrFullName: 'Jane Doe',
            usrMobileNumber: '0712345678',
            usrRoleCode: 'ADMIN',
        };

        accountVerification.onSuccess({
            response: envelope({ accessToken, user }, 'Login successful'),
            dispatch,
            navigate: vi.fn(),
        });

        expect(tokenService.get()).toBe(accessToken);
        expect(dispatch.mock.calls[0][0].payload).toMatchObject(user);
        expect(onSuccess).toHaveBeenCalledWith('Login successful');
    });

    it('falls back to the role claim when the user has no usrRoleCode', () => {
        const dispatch = vi.fn();

        accountVerification.onSuccess({
            response: envelope({
                accessToken: fakeJwt({ role: 'USER' }),
                user: { usrId: 'u-1' },
            }),
            dispatch,
            navigate: vi.fn(),
        });

        expect(dispatch.mock.calls[0][0].payload.usrRoleCode).toBe('USER');
    });

    it('errors without a token', () => {
        accountVerification.onSuccess({
            response: envelope(null),
            dispatch: vi.fn(),
            navigate: vi.fn(),
        });

        expect(onError).toHaveBeenCalledWith('Could not verify account');
        expect(tokenService.get()).toBeNull();
    });
});

describe('updatePasswordAction', () => {
    it('clears the OTP flow and redirects to login', () => {
        const dispatch = vi.fn();

        updatePasswordAction.onSuccess({
            response: envelope(null, 'Password updated successfully'),
            dispatch,
        });

        expect(dispatch.mock.calls[0][0].payload).toBeNull();
        expect(onSuccess).toHaveBeenCalledWith('Password updated successfully');
        expect(updatePasswordAction.redirectTo).toBe(ROUTES.AUTH.LOGIN);
    });
});
