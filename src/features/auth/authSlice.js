import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isActive: false,
    user: null,
    userId: null,
    userRole: null,
    maskedEmail: null,
    otpTimer: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userIdStateFn: (state, action) => {
            state.userId = action.payload;
        },
        maskedEmailStateFn: (state, action) => {
            state.maskedEmail = action.payload;
        },
        authOtpStateFn: (state, action) => {
            state.otpTimer = action.payload;
        },
        authStateFn: (state, action) => {
            state.user = action.payload;
            state.isActive = true;
            state.userId = null;
            state.maskedEmail = null;
            state.otpTimer = null;
            state.userRole = action.payload?.role;
        },
        logoutStateFn: () => {
            return initialState;
        },
    },
});

export default authSlice.reducer;

export const {
    userIdStateFn,
    maskedEmailStateFn,
    authOtpStateFn,
    authStateFn,
    logoutStateFn,
} = authSlice.actions;
