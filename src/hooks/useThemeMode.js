import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrefersDarkMode } from 'abzed-utils';
import {
    cycleThemeModeFn,
    THEME_MODES,
    themeModeFn,
} from '../features/global/globalSlice';

// `index.css` drives every colour off `--color-*` tokens that are redefined under
// `[data-theme]`, so forcing a theme is just a matter of setting that attribute on
// the root element — no per-component work.
const applyMode = (mode) => {
    const root = document.documentElement;

    if (mode === 'system') {
        delete root.dataset.theme;
        return;
    }

    root.dataset.theme = mode;
};

// `mode` is the user's choice (system | light | dark); `resolvedMode` is what's
// actually on screen, so a "system" choice still reports light vs dark — which is
// what AntD's algorithm and the toggle label need.
export const useThemeMode = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.global.themeMode) ?? 'system';
    const prefersDark = usePrefersDarkMode();

    const resolvedMode = mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode;

    const setMode = useCallback((next) => dispatch(themeModeFn(next)), [dispatch]);
    const cycleMode = useCallback(() => dispatch(cycleThemeModeFn()), [dispatch]);

    useEffect(() => {
        applyMode(mode);
    }, [mode]);

    return { mode, resolvedMode, setMode, cycleMode, themeModes: THEME_MODES };
};
