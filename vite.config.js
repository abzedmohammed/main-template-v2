import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function stashEnvLocalDuringBuild() {
    const cwd = process.cwd();
    const localPath = path.resolve(cwd, '.env.local');
    const stashedPath = path.resolve(cwd, '.env.local.build-stashed');
    let stashed = false;

    const restore = () => {
        if (!stashed) return;
        if (fs.existsSync(stashedPath)) {
            try {
                fs.renameSync(stashedPath, localPath);
            } catch {
                // best-effort — the stash file is human-readable so the
                // user can rename it back manually if this fails.
            }
        }
        stashed = false;
    };

    // Restore on Ctrl-C / crash so the user never finds `.env.local`
    // missing after an aborted build.
    process.once('exit', restore);
    process.once('SIGINT', () => {
        restore();
        process.exit(130);
    });
    process.once('SIGTERM', () => {
        restore();
        process.exit(143);
    });

    return {
        name: 'stash-env-local-during-build',
        apply: 'build',
        // `config` runs before Vite reads any `.env*` file, so the rename
        // happens early enough to gate which files load.
        config() {
            if (!fs.existsSync(localPath)) return;
            // A stale stash from a previously-crashed build would clobber
            // the current `.env.local` rename — drop it and stash fresh.
            if (fs.existsSync(stashedPath)) {
                fs.unlinkSync(stashedPath);
            }
            fs.renameSync(localPath, stashedPath);
            stashed = true;
        },
        closeBundle: restore,
        buildEnd(error) {
            if (error) restore();
        },
    };
}

// Long-lived vendor chunks: they change far less often than app code, so they stay
// cached across deploys and download in parallel. Higher priority wins on overlap.
const VENDOR_CHUNKS = [
    {
        name: 'vendor-react',
        test: /node_modules[\\/](react|react-dom|scheduler|react-router(-dom)?)[\\/]/,
        priority: 40,
    },
    {
        name: 'vendor-antd',
        test: /node_modules[\\/](antd|@ant-design|@rc-component|rc-[^\\/]+|dayjs)[\\/]/,
        priority: 30,
    },
    {
        name: 'vendor-phone',
        test: /node_modules[\\/](react-phone-number-input|libphonenumber-js|input-format)[\\/]/,
        priority: 20,
    },
    {
        name: 'vendor-data',
        test: /node_modules[\\/](axios|@tanstack|@reduxjs|react-redux|redux|redux-persist|immer|reselect)[\\/]/,
        priority: 10,
    },
];

// https://vite.dev/config/
export default defineConfig({
    plugins: [stashEnvLocalDuringBuild(), react(), tailwindcss()],
    build: {
        // vendor-antd (~930 kB, ~300 kB gzipped) is AntD itself and can't usefully split
        // further; everything else is far below this, so a real regression still warns.
        chunkSizeWarningLimit: 1000,
        rolldownOptions: {
            output: {
                codeSplitting: { groups: VENDOR_CHUNKS },
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.{js,jsx}'],
        setupFiles: ['./src/test/setup.js'],
        testTimeout: 20000,
        hookTimeout: 20000,
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    },
});
