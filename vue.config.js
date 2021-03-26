module.exports = {
    publicPath: '/', //TODO: 'chrome-extension://__MSG_@@extension_id__/',
    chainWebpack: config => {
        if (config.plugins.has('extract-css')) {
            const extractCSSPlugin = config.plugin('extract-css')
            extractCSSPlugin && extractCSSPlugin.tap(() => [{
                filename: '[name].css',
                chunkFilename: '[name].css',
            }])
        }
    },
    configureWebpack: {
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
        }
    }
};