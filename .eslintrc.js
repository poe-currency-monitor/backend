const prettierrc = require('./.prettierrc');

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },

  plugins: ['eslint-comments', 'prettier', 'jest'],

  extends: [
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'plugin:jest/recommended',

    'airbnb-typescript/base',

    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },

  settings: {
    'import/resolver': {
      typescript: {
        directory: './tsconfig.json',
      },
    },

    jest: {
      version: 'detect',
    },
  },

  rules: {
    'prettier/prettier': ['error', prettierrc],
    '@typescript-eslint/no-namespace': ['off'],
  },

  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/ban-ts-ignore': 'off',
        'import/first': 'off',
      }
    },
    {
      files: ['__mocks__/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'func-names': 'off',
        'no-underscore-dangle': 'off',
      },
    }
  ]
};
