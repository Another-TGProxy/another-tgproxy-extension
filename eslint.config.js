// GJS / GNOME Shell flat config, after the GNOME JavaScript style guide.
const js = require('@eslint/js');
const {defineConfig} = require('eslint/config');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = defineConfig([
    {
        files: ['**/*.js'],
        plugins: {
            js,
            '@stylistic': stylistic
        },
        extends: ['js/recommended'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ARGV: 'readonly',
                Debugger: 'readonly',
                GIRepositoryGType: 'readonly',
                global: 'readonly',
                globalThis: 'readonly',
                imports: 'readonly',
                Intl: 'readonly',
                log: 'readonly',
                logError: 'readonly',
                print: 'readonly',
                printerr: 'readonly',
                TextEncoder: 'readonly',
                TextDecoder: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly'
            }
        },
        rules: {
            '@stylistic/array-bracket-spacing': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/arrow-spacing': ['error'],
            '@stylistic/block-spacing': ['error'],
            '@stylistic/brace-style': ['error'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/comma-spacing': ['error', {before: false, after: true}],
            '@stylistic/comma-style': ['error', 'last'],
            '@stylistic/eol-last': ['error'],
            '@stylistic/indent': ['error', 4, {
                ignoredNodes: ['CallExpression[callee.object.name=GObject][callee.property.name=registerClass] > ClassExpression:first-child'],
                MemberExpression: 'off',
                SwitchCase: 0
            }],
            '@stylistic/key-spacing': ['error', {beforeColon: false, afterColon: true}],
            '@stylistic/keyword-spacing': ['error', {before: true, after: true}],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/no-trailing-spaces': ['error'],
            '@stylistic/object-curly-spacing': ['error', 'never'],
            '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/space-before-blocks': ['error'],
            '@stylistic/space-before-function-paren': ['error', {
                named: 'never',
                anonymous: 'always',
                asyncArrow: 'always'
            }],
            '@stylistic/space-in-parens': ['error'],
            '@stylistic/space-infix-ops': ['error'],
            '@stylistic/spaced-comment': ['error'],
            'camelcase': ['error', {properties: 'never', allow: ['^vfunc_', '^on_']}],
            'curly': ['error', 'multi-or-nest', 'consistent'],
            'eqeqeq': ['error'],
            'no-empty': ['error', {allowEmptyCatch: true}],
            'no-invalid-this': ['error'],
            'no-shadow': ['error'],
            'no-unused-vars': ['error', {
                varsIgnorePattern: '(^unused|_$)',
                argsIgnorePattern: '^(unused|_)'
            }],
            'prefer-const': ['error']
        }
    }
]);
