/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
    env: {
      NODE_ENV: 'test',
    },
  },
} as any);
