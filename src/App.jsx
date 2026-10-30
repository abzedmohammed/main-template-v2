import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import './App.css';
import './text.css';
import './antd.css';
import { ANTD_THEME_TOKENS } from './data';
import { useThemeMode } from './hooks';
import { router, createRoleBasedRouter } from './routes';

const App = () => {
    const { userRole, isActive } = useSelector((state) => state.auth);
    // Mounted here so the whole app (AntD included) re-themes from one place; the
    // toggle button reads the same Redux state.
    const { resolvedMode } = useThemeMode();

    const dynamicRouter = useMemo(() => {
        if (isActive && userRole) {
            return createRoleBasedRouter(userRole);
        }
        return router;
    }, [userRole, isActive]);

    const antdTheme = useMemo(
        () => ({
            algorithm:
                resolvedMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: ANTD_THEME_TOKENS[resolvedMode],
        }),
        [resolvedMode]
    );

    return (
        <ConfigProvider theme={antdTheme}>
            <RouterProvider router={dynamicRouter} />
        </ConfigProvider>
    );
};

export default App;
