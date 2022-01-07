// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: {
        'service-worker': "./service-worker/main.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        chunkFilename: '[name].chunk.[chunkhash].js',
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
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
};
