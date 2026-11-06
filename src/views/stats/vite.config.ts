import { env } from 'node:process';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const browser = env.BROWSER ?? 'chrome';
    if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error('Set BROWSER to chrome or firefox when building Stats.');
    }

    return {
        root: fileURLToPath(new URL('.', import.meta.url)),
        base: './',
        publicDir: fileURLToPath(new URL('../../../static', import.meta.url)),
        experimental: {
            renderBuiltUrl(filename, { type }) {
                if (type === 'public') {
                    return '/' + filename;
                }
            },
        },
        resolve: {
            alias: { '@stats': fileURLToPath(new URL('.', import.meta.url)) },
            dedupe: ['vue', 'pinia'],
        },
        plugins: [vue()],
        define: { __OGT_BROWSER__: JSON.stringify(browser) },
        build: {
            copyPublicDir: false,
            target: ['chrome109', 'firefox109'],
            minify: mode === 'production' && env.NODE_ENV !== 'development',
            sourcemap: true,
            rolldownOptions: {
                input: fileURLToPath(new URL('./stats.html', import.meta.url)),
            },
        },
    };
});
