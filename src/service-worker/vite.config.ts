import { env } from 'node:process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const browser = env.BROWSER ?? 'chrome';
    if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error('Set BROWSER to chrome or firefox when building the service worker.');
    }

    return {
        root: fileURLToPath(new URL('.', import.meta.url)),
        publicDir: false,
        define: { __OGT_BROWSER__: JSON.stringify(browser) },
        build: {
            target: ['chrome109', 'firefox109'],
            minify: mode === 'production' && env.NODE_ENV !== 'development',
            sourcemap: 'inline',
            lib: {
                entry: fileURLToPath(new URL('./main.ts', import.meta.url)),
                formats: ['iife'],
                name: 'OGameTrackerServiceWorker',
                fileName: () => 'service-worker.js',
            },
        },
    };
});
