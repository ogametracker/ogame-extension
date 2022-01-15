const fs = require('fs');

const viewsDir = './src/views';
const views = fs.readdirSync(viewsDir, { withFileTypes: true })
    // only directories that have a main.ts
    .filter(file => file.isDirectory()
        && fs.readdirSync(`${viewsDir}/${file.name}`, { withFileTypes: true })
            .some(f => f.isFile() && f.name == 'main.ts')
    )
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
                    $browser: ${process.env.VUE_APP_BROWSER};
                `
            },
        },
    },
};

module.exports = config;