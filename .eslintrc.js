module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['tailwindcss', '@typescript-eslint'],
    extends: [
        'expo',
        'prettier',
        // 'plugin:prettier/recommended',
        'plugin:tailwindcss/recommended',
        'plugin:@tanstack/eslint-plugin-query/recommended',
    ],
    settings: {
        tailwindcss: {
            callees: ['cn', 'clsx', 'tw'],
        },
    },
    rules: {
        'react/jsx-key': 'error',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        semi: ['error', 'always'],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        'no-console': 'error',
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/classnames-order': 'off',
    },
    ignorePatterns: ['.expo', 'node_modules', '**/*.js', '**/*.json', 'node_modules', 'dist'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
    },
};
