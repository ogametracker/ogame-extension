const path = require('node:path');

const browser = process.env.BROWSER ?? 'chrome';
if (browser !== 'chrome' && browser !== 'firefox') {
    throw new Error('Set BROWSER to chrome or firefox.');
}

module.exports = {
    publicPath: '',
    pages: {
        stats: {
            entry: './main.ts',
            filename: 'stats.html',
            title: 'stats Page',
            template: path.join(__dirname, 'index.html'),
        },
    },
    configureWebpack: {
        devtool: 'inline-source-map',
        optimization: {
            splitChunks: {
                maxSize: 2_000_000, // Firefox extension requirement
            },
        },
        resolve: {
            alias: {
                '@stats': __dirname,
                vue$: require.resolve('vue/dist/vue.runtime.esm.js'),
            },
        },
        output: {
            devtoolModuleFilenameTemplate: info => {
                const isVue = info.resourcePath.endsWith('.vue')
                    && info.resource.includes('type=script') && info.moduleId === '';
                if (isVue || info.resourcePath.endsWith('.ts')) {
                    return `ogame-tracker:///${info.resourcePath}`;
                }
                return null;
            },
            devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]',
        },
    },
    chainWebpack: config => {
        config.plugin('define').tap(([definitions]) => [{
            ...definitions,
            __OGT_BROWSER__: JSON.stringify(browser),
        }]);
        for (const rule of ['ts', 'tsx']) {
            config.module.rule(rule).use('ts-loader').tap(options => ({
                ...options,
                configFile: path.join(__dirname, 'tsconfig.json'),
                context: __dirname,
            }));
        }
    },
    css: {
        loaderOptions: {
            sass: { additionalData: `$browser: ${browser};` },
        },
    },
};
