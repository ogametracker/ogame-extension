const path = require("path");
const fs = require('fs');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == "production";

const contentScriptDir = './src/content-scripts';
const contentScripts = fs.readdirSync(contentScriptDir, { withFileTypes: true })
    .filter(file => file.isDirectory())
    .map(dir => dir.name)
    .reduce((acc, dirName) => {
        acc[`content-scripts/${dirName}`] = `${contentScriptDir}/${dirName}/main.ts`;
        return acc;
    }, {});

/** @type {import('webpack').Configuration} */
module.exports = (env) => ({
    entry: {
        'service-worker': "./src/service-worker/main.ts",
        ...contentScripts,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        chunkFilename: '[name].chunk.[chunkhash].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './static/'
                },
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.BROWSER': env.browser,
        }),
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [
            // typescript
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/", "/src/views/"],
            },
            // styles
            {
                test: /\.(sass|scss)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    mode: isProduction ? 'production' : 'development',
    optimization: {
        splitChunks: {
            maxSize: 2_000_000, // Firefox extension requirement
        },
    },
});
