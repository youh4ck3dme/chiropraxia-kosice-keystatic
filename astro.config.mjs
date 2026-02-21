import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import sentry from '@sentry/astro';
import spotlightjs from '@spotlightjs/astro';

const keystaticEnvKeys = [
  'KEYSTATIC_GITHUB_CLIENT_ID',
  'KEYSTATIC_GITHUB_CLIENT_SECRET',
  'KEYSTATIC_SECRET',
  'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG'
];

for (const key of keystaticEnvKeys) {
  if (typeof process.env[key] === 'string') {
    process.env[key] = process.env[key].trim();
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://chiropraxiakosice.eu',

  // Server mode for SSR with Vercel
  output: 'server',
  adapter: vercel(),

  // Omit Keystatic routes in production by setting SKIP_KEYSTATIC=true (e.g. in Vercel env)
  integrations: [
    mdx(),
    react(),
    ...(process.env.SKIP_KEYSTATIC ? [] : [keystatic()]),
    sitemap(),
    sentry(),
    spotlightjs(),
  ],

  server: {
    port: 4322,
    host: 'localhost',
    hmr: {
      clientPort: 4322
    }
  },

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/e2e/**', '**/node_modules/**', '**/test-results/**', '**/playwright-report/**']
      }
    },
    // Polyfill pre Keystatic – process.env nie je v prehliadači (ReferenceError)
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VERCEL': JSON.stringify(process.env.VERCEL || ''),
    },
    ssr: {
      noExternal: ['@keystatic/core', '@keystatic/astro', 'lodash', 'lodash-es']
    },
    optimizeDeps: {
      include: ['lodash', 'lodash-es'],
      exclude: ['@keystatic/astro', '@keystatic/core']
    }
  },
});