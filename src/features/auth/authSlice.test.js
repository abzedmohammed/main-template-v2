import authReducer, { authStateFn, logoutStateFn, otpFlowStateFn } from './authSlice';

const initialState = {
    isActive: false,
    user: null,
    otpFlow: null,
    userRole: null,
};

const otpFlow = { reqId: 'req-1', maskedEmail: 'ja****@example.com', otpTimer: 5 };

describe('authSlice', () => {
    it('returns initial state for unknown actions', () => {
        expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('stores the pending OTP flow when otpFlowStateFn is dispatched', () => {
        const next = authReducer(initialState, otpFlowStateFn(otpFlow));

        expect(next.otpFlow).toEqual(otpFlow);
        expect(next.isActive).toBe(false);
    });

    it('activates the session, reads usrRoleCode and clears the OTP flow', () => {
        const user = { usrId: 'user-42', usrFullName: 'Ada', usrRoleCode: 'ADMIN' };

        const next = authReducer({ ...initialState, otpFlow }, authStateFn(user));

        expect(next.user).toEqual(user);
        expect(next.isActive).toBe(true);
        expect(next.userRole).toBe('ADMIN');
        expect(next.otpFlow).toBeNull();
    });

    it('falls back to the role claim when usrRoleCode is absent', () => {
        const next = authReducer(initialState, authStateFn({ role: 'USER' }));

        expect(next.userRole).toBe('USER');
    });

    it('resets to initial state on logout', () => {
        const activeState = {
            isActive: true,
            user: { usrId: 'u' },
            otpFlow,
            userRole: 'ADMIN',
        };

        expect(authReducer(activeState, logoutStateFn())).toEqual(initialState);
    });
});
