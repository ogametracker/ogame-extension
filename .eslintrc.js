module.exports = {
    'env': {
        browser: true,
        es2021: true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parserOptions': {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'indent': ['warn', 4],

        'quotes': 'off',
        '@typescript-eslint/quotes': ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],

        'semi': 'off',
        '@typescript-eslint/semi': 'warn',

        'no-var': 'warn',
        'prefer-const': 'warn',

        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-this-alias': 'warn',
    },
};
