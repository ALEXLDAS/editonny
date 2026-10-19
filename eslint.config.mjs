import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import quality from './eslint-rules/index.cjs';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**', '**/.venv/**', '.work/**', '.superpowers/**',
    'dist/**', 'graphify-out/**', 'web/app.js', 'eslint-rules/**',
    'skills/editonny/engine/project-template/assets/three/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    plugins: { quality },
    rules: { 'quality/max-lines': ['error', { max: 350, includeTests: true }] },
  },
  {
    files: [
      'web/**/*.{js,mjs}', 'skills/editonny/engine/preview/**/*.{js,mjs}',
      'skills/editonny/engine/project-template/compositions/scenes/3d/**/*.{js,mjs}',
    ],
    ignores: ['web/build-data.mjs'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['eslint.config.mjs', 'scripts/**/*.{js,mjs,cjs}', 'tests/**/*.{js,mjs,cjs}', 'web/build-data.mjs'],
    languageOptions: { globals: globals.node },
  },
]);
