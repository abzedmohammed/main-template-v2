import authReducer, {
    authStateFn,
    logoutStateFn,
    userIdStateFn,
} from './authSlice';

const initialState = {
    isActive: false,
    user: null,
    userId: null,
    userRole: null,
};

describe('authSlice', () => {
    it('returns initial state for unknown actions', () => {
        expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('stores userId when userIdStateFn is dispatched', () => {
        const next = authReducer(initialState, userIdStateFn('user-42'));

        expect(next.userId).toBe('user-42');
        expect(next.isActive).toBe(false);
    });

    it('activates the session and captures the role when authStateFn runs', () => {
        const user = { usrId: 'user-42', usrFullName: 'Ada', role: 'ADMIN' };

        const next = authReducer(initialState, authStateFn(user));

        expect(next.user).toEqual(user);
        expect(next.isActive).toBe(true);
        expect(next.userRole).toBe('ADMIN');
        expect(next.userId).toBeNull();
    });

    it('resets to initial state on logout', () => {
        const activeState = {
            isActive: true,
            user: { usrId: 'u' },
            userId: 'u',
            userRole: 'ADMIN',
        };

        expect(authReducer(activeState, logoutStateFn())).toEqual(initialState);
    });
});
