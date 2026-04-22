import globalReducer, { sideBarOpenFn } from './globalSlice';

describe('globalSlice', () => {
    it('starts with the sidebar closed', () => {
        expect(globalReducer(undefined, { type: '@@INIT' })).toEqual({
            sideBarOpen: false,
        });
    });

    it('toggles the sidebar on repeat dispatches', () => {
        const afterOpen = globalReducer(undefined, sideBarOpenFn());
        expect(afterOpen.sideBarOpen).toBe(true);

        const afterClose = globalReducer(afterOpen, sideBarOpenFn());
        expect(afterClose.sideBarOpen).toBe(false);
    });
});
