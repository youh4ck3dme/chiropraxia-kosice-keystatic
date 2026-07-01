// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import configPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist/**', '.astro/**', '.vercel/**', 'node_modules/**', 'public/**', 'dev-dist/**'],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript files
  ...tseslint.configs.recommended,

  // React files
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // TypeScript handles this
      // Core react-hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Accessibility rules — warn to encourage fixing without blocking CI
      ...Object.fromEntries(
        Object.entries(jsxA11y.configs.recommended.rules ?? {}).map(([key, val]) => [
          key,
          val === 'error' ? 'warn' : val,
        ])
      ),
    },
  },

  // Astro files
  ...astro.configs.recommended,

  // TypeScript rules applied to all TS/TSX/Astro files
  {
    files: ['**/*.{ts,tsx,astro}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // Allow triple-slash references in declaration files (required by Astro)
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Root config files — allow Node.js globals and CommonJS
  {
    files: ['*.{mjs,cjs,js}', 'astro.config.mjs', 'tailwind.config.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Node.js scripts — allow CommonJS globals and loosen TypeScript rules
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // E2E test files — allow test globals
  {
    files: ['e2e/**/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },

  // Disable formatting rules (handled by Prettier)
  configPrettier
);
