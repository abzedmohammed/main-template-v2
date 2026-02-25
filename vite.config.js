import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.{js,jsx}'],
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (
                        id.includes('node_modules/react/') ||
                        id.includes('node_modules/react-dom/') ||
                        id.includes('node_modules/react-router') ||
                        id.includes('node_modules/scheduler/')
                    ) {
                        return 'react';
                    }

                    if (
                        id.includes('node_modules/antd/') ||
                        id.includes('node_modules/@ant-design/') ||
                        id.includes('node_modules/rc-') ||
                        id.includes('node_modules/@rc-component/')
                    ) {
                        return 'antd-core';
                    }

                    if (
                        id.includes('node_modules/@reduxjs/toolkit/') ||
                        id.includes('node_modules/react-redux/') ||
                        id.includes('node_modules/redux-persist/')
                    ) {
                        return 'state';
                    }

                    if (
                        id.includes('node_modules/@tanstack/react-query/') ||
                        id.includes(
                            'node_modules/@tanstack/react-query-persist-client/'
                        ) ||
                        id.includes(
                            'node_modules/@tanstack/query-async-storage-persister/'
                        )
                    ) {
                        return 'query';
                    }

                    if (
                        id.includes('node_modules/abzed-utils/') ||
                        id.includes('node_modules/react-hot-toast/') ||
                        id.includes('node_modules/react-phone-number-input/')
                    ) {
                        return 'ui-kit';
                    }

                    if (
                        id.includes('node_modules/axios/') ||
                        id.includes('node_modules/jwt-decode/') ||
                        id.includes('node_modules/use-debounce/')
                    ) {
                        return 'network';
                    }

                    return 'vendor';
                },
            },
        },
    },
});
