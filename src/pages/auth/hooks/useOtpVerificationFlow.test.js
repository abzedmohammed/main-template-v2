import { getResendSeconds } from './useOtpVerificationFlow';
import { defaultTimer } from '../../../utils';

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../../../routes', async () => ({
    ROUTES: (await import('../../../routes/paths')).ROUTES,
}));

describe('getResendSeconds', () => {
    it('converts the backend otpTimer (minutes) to seconds', () => {
        expect(getResendSeconds(5)).toBe(300);
    });

    it('falls back to VITE_DEFAULT_TIMER when otpTimer is missing or invalid', () => {
        expect(getResendSeconds(undefined)).toBe(defaultTimer);
        expect(getResendSeconds(0)).toBe(defaultTimer);
        expect(getResendSeconds('abc')).toBe(defaultTimer);
    });
});
