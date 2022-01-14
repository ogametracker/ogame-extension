const fs = require('fs');

const viewsDir = './src/views';
const views = fs.readdirSync(viewsDir, { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(dir => dir.name);
const vuePages = views.reduce((acc, view) => {
    acc[view] = {
        entry: `src/views/${view}/main.ts`,
        filename: `${view}.html`,
        title: `DEV: ${view} Page`,
        template: `src/views/index.html`,
    };
    return acc;
}, {});

/** @type{import('@vue/cli-service').ProjectOptions} */
const config = {
    publicPath: '',
    outputDir: 'dist/views',
    pages: vuePages,
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
                additionalData: `
                    $is-chrome: ${process.env.VUE_APP_BROWSER === 'chrome'};
                    $is-firefox: ${process.env.VUE_APP_BROWSER === 'firefox'};
                `
            },
        },
    },
};

module.exports = config;