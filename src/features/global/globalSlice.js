import { createSlice } from '@reduxjs/toolkit';

// 'system' follows the OS; 'light'/'dark' force a palette. Persisted by
// redux-persist, so a reload keeps the choice.
export const THEME_MODES = ['system', 'light', 'dark'];

const initialState = {
    sideBarOpen: false,
    themeMode: 'system',
    stateObj: {},
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        sideBarOpenFn: (state) => {
            state.sideBarOpen = !state.sideBarOpen;
        },
        themeModeFn: (state, action) => {
            state.themeMode = THEME_MODES.includes(action.payload)
                ? action.payload
                : 'system';
        },
        cycleThemeModeFn: (state) => {
            const next = THEME_MODES.indexOf(state.themeMode) + 1;

            state.themeMode = THEME_MODES[next % THEME_MODES.length];
        },
        handleStateObj: (state, action) => {
            state.stateObj = { ...state.stateObj, ...action.payload };
        },
        resetStateObj: (state) => {
            state.stateObj = {};
            state.sideBarOpen = false;
        },
    },
});

export default globalSlice.reducer;

export const {
    sideBarOpenFn,
    themeModeFn,
    cycleThemeModeFn,
    handleStateObj,
    resetStateObj,
} = globalSlice.actions;
