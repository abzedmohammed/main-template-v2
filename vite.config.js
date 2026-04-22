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
        setupFiles: ['./src/test/setup.js'],
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    }
});
