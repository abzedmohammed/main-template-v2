import { MoonSvg, ScreenSvg, SunSvg } from './svgs';

export const THEME_MODE_META = {
    system: { label: 'System', Icon: ScreenSvg },
    light: { label: 'Light', Icon: SunSvg },
    dark: { label: 'Dark', Icon: MoonSvg },
};

export const ANTD_THEME_TOKENS = {
    light: {
        colorPrimary: '#4f46e5',
        colorInfo: '#3b82f6',
        colorSuccess: '#22c55e',
        colorWarning: '#f59e0b',
        colorError: '#ee1d52',
        colorTextBase: '#121212',
        colorBgBase: '#ffffff',
        colorBorder: '#e5e5e5',
    },
    dark: {
        colorPrimary: '#7c74ff',
        colorInfo: '#60a5fa',
        colorSuccess: '#4ade80',
        colorWarning: '#fbbf24',
        colorError: '#fb7185',
        colorTextBase: '#f5f7fa',
        colorBgBase: '#0f1115',
        colorBorder: '#2f3645',
    },
};
