#!/usr/bin/env node
const path = require('node:path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const project = process.cwd();
const name = path.basename(project);
const browser = process.env.BROWSER ?? 'chrome';
const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

if (browser !== 'chrome' && browser !== 'firefox') {
    throw new Error('Set BROWSER to chrome or firefox.');
}

webpack({
    context: project,
    mode,
    target: name === 'service-worker' ? 'webworker' : 'web',
    entry: './main.ts',
    output: {
        path: path.join(project, 'dist'),
        filename: `${name}.js`,
        clean: true,
    },
    devtool: 'inline-source-map',
    resolve: { extensions: ['.ts', '.js'] },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: require.resolve('ts-loader'),
                options: {
                    compiler: require.resolve('typescript'),
                    configFile: path.join(project, 'tsconfig.json'),
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    require.resolve('css-loader'),
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            additionalData: `
                                $browser: '${browser}';
                                $base-url: '${browser === 'chrome' ? 'chrome' : 'moz'}-extension://__MSG_@@extension_id__';
                            `,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: `${name}.css` }),
        new webpack.DefinePlugin({ __OGT_BROWSER__: JSON.stringify(browser) }),
        // The manifest loads each script as a single classic script.
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    ],
}, (error, stats) => {
    if (error) {
        console.error(error);
        process.exitCode = 1;
        return;
    }
    console.log(stats.toString('errors-warnings'));
    if (stats.hasErrors()) {
        process.exitCode = 1;
    }
});
