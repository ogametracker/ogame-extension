//taken from https://github.com/jkzing/vue-cli-plugin-multi-compiler
//and modified to work for different production modes
module.exports = (api, options) => {
    if (process.env.NODE_ENV != 'production') return;
    // multi-compiler mode only can be used in production build
    const merge = require('webpack-merge');
    const oldResolveWebpackConfig = api.service.resolveWebpackConfig;

    api.service.resolveWebpackConfig = function resolveWebpackConfig() {
        // get raw config
        const config = oldResolveWebpackConfig.call(this);
        const { configureMultiCompilerWebpack } = options.pluginOptions ?? {};

        // tweak raw config into multi-compiler mode configs
        if (typeof configureMultiCompilerWebpack === 'function') {
            return configureMultiCompilerWebpack(config);
        } else if (Array.isArray(configureMultiCompilerWebpack)) {
            return configureMultiCompilerWebpack.map(curr => merge(config, curr));
        }
        return config;
    };
};