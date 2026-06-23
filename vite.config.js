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

// https://vite.dev/config/
export default defineConfig({
    plugins: [stashEnvLocalDuringBuild(), react(), tailwindcss()],
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
    },
});
