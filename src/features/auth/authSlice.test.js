import authReducer, {
    authOtpStateFn,
    authStateFn,
    logoutStateFn,
    maskedEmailStateFn,
    userIdStateFn,
} from './authSlice';

const initialState = {
    isActive: false,
    user: null,
    userId: null,
    userRole: null,
    maskedEmail: null,
    otpTimer: null,
};

const pendingOtpState = {
    ...initialState,
    userId: 'req-1',
    maskedEmail: 'ja****@example.com',
    otpTimer: 300,
};

describe('authSlice', () => {
    it('returns initial state for unknown actions', () => {
        expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('stores the pending OTP flow (reqId, masked email, timer)', () => {
        let state = authReducer(initialState, userIdStateFn('req-1'));
        state = authReducer(state, maskedEmailStateFn('ja****@example.com'));
        state = authReducer(state, authOtpStateFn(300));

        expect(state).toEqual(pendingOtpState);
        expect(state.isActive).toBe(false);
    });

    it('activates the session, captures the role and clears the OTP flow', () => {
        const user = { usrId: 'u-1', usrFullName: 'Jane Doe', role: 'ADMIN' };

        const next = authReducer(pendingOtpState, authStateFn(user));

        expect(next.user).toEqual(user);
        expect(next.isActive).toBe(true);
        expect(next.userRole).toBe('ADMIN');
        expect(next.userId).toBeNull();
        expect(next.maskedEmail).toBeNull();
        expect(next.otpTimer).toBeNull();
    });

    it('resets to initial state on logout', () => {
        const activeState = {
            ...pendingOtpState,
            isActive: true,
            user: { usrId: 'u-1' },
            userRole: 'ADMIN',
        };

        expect(authReducer(activeState, logoutStateFn())).toEqual(initialState);
    });
});
