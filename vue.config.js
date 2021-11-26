module.exports = {
    pluginOptions: {
        configureMultiCompilerWebpack: [
            {
                entry: {
                    app: './src/zzz_entries/main.ts'
                },
                output: {
                    filename: 'app.js',
                    chunkFilename: 'app.[name].js',
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
                    chunkFilename: 'keepActiveItemsTime.[name].js',
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