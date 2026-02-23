import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sideBarOpen: false,
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        sideBarOpenFn: (state) => {
            state.sideBarOpen = !state.sideBarOpen;
        },
    },
});

export default globalSlice.reducer;

export const { sideBarOpenFn } = globalSlice.actions;
