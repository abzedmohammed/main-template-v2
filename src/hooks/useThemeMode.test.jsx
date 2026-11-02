import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../features/global/globalSlice';
import { useThemeMode } from './useThemeMode';

const renderThemeHook = () => {
    const store = configureStore({ reducer: { global: globalReducer } });
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

    return renderHook(() => useThemeMode(), { wrapper });
};

describe('useThemeMode', () => {
    afterEach(() => {
        delete document.documentElement.dataset.theme;
    });

    it('follows the system by default and leaves the root untouched', () => {
        const { result } = renderThemeHook();

        expect(result.current.mode).toBe('system');
        // The test matchMedia never matches, so the OS reads as light.
        expect(result.current.resolvedMode).toBe('light');
        expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it('forces a theme by setting data-theme on the root', () => {
        const { result } = renderThemeHook();

        act(() => result.current.setMode('dark'));

        expect(result.current.mode).toBe('dark');
        expect(result.current.resolvedMode).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('clears data-theme when switching back to system', () => {
        const { result } = renderThemeHook();

        act(() => result.current.setMode('light'));
        act(() => result.current.setMode('system'));

        expect(document.documentElement.dataset.theme).toBeUndefined();
    });

    it('cycles through the modes', () => {
        const { result } = renderThemeHook();

        act(() => result.current.cycleMode());
        expect(result.current.mode).toBe('light');

        act(() => result.current.cycleMode());
        expect(result.current.mode).toBe('dark');
    });
});
