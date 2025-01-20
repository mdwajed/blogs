import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  // Base ESLint configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...eslint.configs.recommended.languageOptions?.globals,
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },

  // TypeScript-specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-unused-vars': 'error',
      'no-undef': 'off',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },

  // Ignored directories
  {
    ignores: ['dist', 'node_modules'],
  },
];
