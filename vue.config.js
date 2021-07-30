module.exports = {
    chainWebpack: config => {
        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css');
            extractCSSPlugin && extractCSSPlugin.tap(() => [{
                filename: '[name].css',
                chunkFilename: '[name].css',
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
                    chunkFilename: 'app.chunk-vendors.js'
                },
            },
            {
                entry: {
                    app: './src/zzz_entries/keepActiveItemsTime.ts'
                },
                output: {
                    filename: 'keepActiveItemsTime.js',
                    chunkFilename: 'keepActiveItemsTime.chunk-vendors.js'
                },
            },
            {
                entry: {
                    app: './src/zzz_entries/attach.ts'
                },
                output: {
                    filename: 'attach.js',
                    chunkFilename: 'attach.chunk-vendors.js'
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