import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript')];

// Modify the last config object to include custom rules
eslintConfig[eslintConfig.length - 1].rules = {
  ...eslintConfig[eslintConfig.length - 1].rules, // Keep existing rules
  '@typescript-eslint/no-explicit-any': 'off',
};

export default eslintConfig;
