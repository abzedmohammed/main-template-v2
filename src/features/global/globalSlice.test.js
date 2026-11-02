import globalReducer, {
    cycleThemeModeFn,
    handleStateObj,
    resetStateObj,
    sideBarOpenFn,
    themeModeFn,
} from './globalSlice';

const initialState = { sideBarOpen: false, themeMode: 'system', stateObj: {} };

describe('globalSlice', () => {
    it('starts closed, following the system theme, with empty shared state', () => {
        expect(globalReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('toggles the sidebar on repeat dispatches', () => {
        const afterOpen = globalReducer(undefined, sideBarOpenFn());
        expect(afterOpen.sideBarOpen).toBe(true);

        const afterClose = globalReducer(afterOpen, sideBarOpenFn());
        expect(afterClose.sideBarOpen).toBe(false);
    });

    it('sets a valid theme mode and falls back to system for anything else', () => {
        expect(globalReducer(initialState, themeModeFn('dark')).themeMode).toBe('dark');
        expect(globalReducer(initialState, themeModeFn('neon')).themeMode).toBe('system');
    });

    it('cycles system → light → dark → system', () => {
        let state = globalReducer(initialState, cycleThemeModeFn());
        expect(state.themeMode).toBe('light');

        state = globalReducer(state, cycleThemeModeFn());
        expect(state.themeMode).toBe('dark');

        state = globalReducer(state, cycleThemeModeFn());
        expect(state.themeMode).toBe('system');
    });

    it('merges into stateObj instead of replacing it', () => {
        let state = globalReducer(initialState, handleStateObj({ tab: 'details' }));
        state = globalReducer(state, handleStateObj({ recordId: 7 }));

        expect(state.stateObj).toEqual({ tab: 'details', recordId: 7 });
    });

    it('resetStateObj clears shared state and closes the sidebar', () => {
        const busy = { ...initialState, sideBarOpen: true, stateObj: { recordId: 7 } };

        expect(globalReducer(busy, resetStateObj())).toEqual(initialState);
    });
});
