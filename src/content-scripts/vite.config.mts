import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { env } from 'node:process';
import { fileURLToPath } from 'node:url';
import { defineConfig, type EnvironmentOptions } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));
const entries = readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(resolve(root, entry.name, 'options.json')))
    .map(({ name }) => ({ name, environment: name.replaceAll('-', '_') }));

export default defineConfig(({ mode }) => {
    const browser = env.BROWSER ?? 'chrome';
    if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error('Set BROWSER to chrome or firefox when building content scripts.');
    }
    const protocol = browser === 'chrome' ? 'chrome' : 'moz';

    return {
        root,
        base: './',
        publicDir: resolve(root, '../../static'),
        define: { __OGT_BROWSER__: JSON.stringify(browser) },
        experimental: {
            renderBuiltUrl(filename, { hostType, type }) {
                if (hostType === 'css' && type === 'public') {
                    return `${protocol}-extension://__MSG_@@extension_id__/${filename}`;
                }
            },
        },
        build: {
            copyPublicDir: false,
            target: ['chrome109', 'firefox109'],
            minify: mode === 'production' && env.NODE_ENV !== 'development',
            sourcemap: 'inline',
        },
        // The manifest injects each entry as a classic script at its own match and run_at.
        environments: Object.fromEntries(
            entries.map(({ name, environment }, index) => [
                environment,
                {
                    consumer: 'client',
                    build: {
                        emptyOutDir: index === 0,
                        lib: {
                            entry: resolve(root, name, 'main.ts'),
                            formats: ['iife'],
                            name: 'OGameTrackerContentScript',
                            fileName: () => `${name}.js`,
                            cssFileName: name,
                        },
                    },
                } satisfies EnvironmentOptions,
            ]),
        ),
        builder: {
            async buildApp(builder) {
                for (const { environment } of entries) {
                    await builder.build(builder.environments[environment]);
                }
            },
        },
    };
});
