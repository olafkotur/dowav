module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: './tsconfig.json',
    },
    extends: ['plugin:@typescript-eslint/recommended', 'react-app', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'react'],
    rules: {},
};
