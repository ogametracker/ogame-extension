module.exports = {
    chainWebpack: config => {
        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css');
            extractCSSPlugin && extractCSSPlugin.tap(() => [{
                filename: 'app.css',
                chunkFilename: 'app.css',
            }]);
        }

        config.plugins.delete('named-chunks');
    },
    pluginOptions: {
        configureMultiCompilerWebpack: [
            {
                entry: {
                    app: './src/zzz_entries/main.ts'
                },
                output: {
                    filename: 'app.js',
                    chunkFilename: 'app.chunk.[chunkhash].js',
                },
                optimization: {
                    splitChunks: {
                        maxSize: 2_000_000,
                    },
                },
            },
            {
                entry: {
                    app: './src/zzz_entries/keepActiveItemsTime.ts'
                },
                output: {
                    filename: 'keepActiveItemsTime.js',
                    chunkFilename: 'keepActiveItemsTime.chunk.[chunkhash].js',
                },
                optimization: {
                    splitChunks: {
                        maxSize: 2_000_000,
                    },
                },
            }
        ]
    },
    configureWebpack: {
        devtool: 'inline-source-map',

    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                    $is-chrome: ${process.env.VUE_APP_BROWSER === 'chrome'};
                    $is-firefox: ${process.env.VUE_APP_BROWSER === 'firefox'};
                `
            }
        }
    }
};