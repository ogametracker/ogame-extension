import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const resolve = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig(({ mode }) => {
    const browser = process.env.BROWSER;
    if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error('Set BROWSER to chrome or firefox when building Notifications.');
    }

    return {
        base: './',
        publicDir: false,
        plugins: [vue()],
        resolve: {
            alias: {
                '@': resolve('../../'),
                vue: resolve('./node_modules/vue/dist/vue.runtime.esm-bundler.js'),
            },
        },
        define: { 'process.env.BROWSER': JSON.stringify(browser) },
        css: {
            preprocessorOptions: { scss: { additionalData: `$browser: ${browser};` } },
        },
        build: {
            target: ['chrome109', 'firefox109'],
            outDir: resolve('../../../dist/views'),
            emptyOutDir: false,
            minify: mode === 'production',
            sourcemap: true,
            rollupOptions: { input: resolve('./notifications.html') },
        },
    };
});
