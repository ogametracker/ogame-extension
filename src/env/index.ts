export default {
    isProduction: process.env.NODE_ENV == 'production',
    browser: (process.env.VUE_APP_BROWSER ?? 'unknown') as 'chrome' | 'firefox' | 'unknown',
};