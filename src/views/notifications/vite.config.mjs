import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const resolve = (path) => fileURLToPath(new URL(path, import.meta.url));
const require = createRequire(import.meta.url);

export default defineConfig(({ mode }) => {
    const browser = process.env.BROWSER ?? 'chrome';
    if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error('Set BROWSER to chrome or firefox when building Notifications.');
    }

    return {
        base: './',
        publicDir: false,
        plugins: [vue()],
        resolve: {
            alias: {
                vue: require.resolve('vue/dist/vue.runtime.esm-bundler.js'),
            },
        },
        define: { __OGT_BROWSER__: JSON.stringify(browser) },
        css: {
            preprocessorOptions: { scss: { additionalData: `$browser: ${browser};` } },
        },
        build: {
            target: ['chrome109', 'firefox109'],
            outDir: resolve('./dist'),
            emptyOutDir: true,
            minify: mode === 'production' && process.env.NODE_ENV !== 'development',
            sourcemap: true,
            rollupOptions: { input: resolve('./notifications.html') },
        },
    };
});
