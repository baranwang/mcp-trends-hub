
import { defineConfig } from '@rstest/core';

export default defineConfig({
  include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  testEnvironment: 'node',
});