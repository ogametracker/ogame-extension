/** @type{import('./stats/node_modules/@vue/cli-service').ProjectOptions} */
const config = {
    publicPath: '',
    configureWebpack: {
        devtool: 'inline-source-map',
        optimization: {
            splitChunks: {
                maxSize: 2_000_000, // Firefox extension requirement
            },
        },
    },
    css: {
        loaderOptions: {
            sass: {
                // for different styling depending on the browser environment
                prependData: `
                    $is-chrome: ${process.env.VUE_APP_BROWSER === 'chrome'};
                    $is-firefox: ${process.env.VUE_APP_BROWSER === 'firefox'};
                `
            },
        },
    },
};

module.exports = config;