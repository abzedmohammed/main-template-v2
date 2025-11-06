import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeEvent: {},
    activeEventDetails: {},
    sideBarOpen: false,
    initLoading: false,
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        activeEventFn: (state, action) => {
            state.activeEvent = action.payload;
        },
        activeEventDetailsFn: (state, action) => {
            state.activeEventDetails = action.payload;
        },
        sideBarOpenFn: (state) => {
            state.sideBarOpen = !state.sideBarOpen;
        },
        initLoadingFn: (state, action) => {
            state.initLoading = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder;
    },
});

export default globalSlice.reducer;

export const {
    activeEventFn,
    activeEventDetailsFn,
    sideBarOpenFn,
    initLoadingFn,
} = globalSlice.actions;
