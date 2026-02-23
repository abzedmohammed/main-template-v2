import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isActive: false,
    user: null,
    userId: null,
    userRole: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userIdStateFn: (state, action) => {
            state.userId = action.payload;
        },
        authStateFn: (state, action) => {
            state.user = action.payload;
            state.isActive = true;
            state.userId = null;
            state.userRole = action.payload?.role;
        },
        logoutStateFn: () => {
            return initialState;
        },
    },
});

export default authSlice.reducer;

export const { userIdStateFn, authStateFn, logoutStateFn } = authSlice.actions;
