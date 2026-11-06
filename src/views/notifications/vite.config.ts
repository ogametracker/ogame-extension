import { env } from 'node:process';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const browser = env.BROWSER ?? 'chrome';
    if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error('Set BROWSER to chrome or firefox when building Notifications.');
    }

    return {
        root: fileURLToPath(new URL('.', import.meta.url)),
        base: './',
        publicDir: false,
        plugins: [vue()],
        define: { __OGT_BROWSER__: JSON.stringify(browser) },
        css: {
            preprocessorOptions: {
                scss: { additionalData: `$browser: ${browser};` },
            },
        },
        build: {
            target: ['chrome109', 'firefox109'],
            minify: mode === 'production' && env.NODE_ENV !== 'development',
            sourcemap: true,
            rolldownOptions: {
                input: fileURLToPath(new URL('./notifications.html', import.meta.url)),
            },
        },
    };
});
