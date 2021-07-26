module.exports = {
    chainWebpack: config => {
        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css');
            extractCSSPlugin && extractCSSPlugin.tap(() => [{
                filename: '[name].css',
                chunkFilename: '[name].css',
            }]);
        }
    },
    pluginOptions: {
        configureMultiCompilerWebpack: [
            {
                entry: {
                    app: './src/main.ts'
                },
                output: {
                    filename: 'app.js',
                    chunkFilename: 'app.chunk-vendors.js'
                },
            },
            {
                entry: {
                    app: './src/keepActiveItemsTime.ts'
                },
                output: {
                    filename: 'keepActiveItemsTime.js',
                    chunkFilename: 'keepActiveItemsTime.chunk-vendors.js'
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
                    $is-production: ${process.env.NODE_ENV === 'production'};
                `
            }
        }
    }
};