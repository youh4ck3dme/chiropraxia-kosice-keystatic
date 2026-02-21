#!/usr/bin/env node
/**
 * Nastaví na Vercel pre Production (a Preview) len verejné/necitlivé env premenné
 * potrebné pre Keystatic a beh stránky. Tajné (CLIENT_SECRET, JWT_SECRET, RESEND_API_KEY…)
 * treba nastaviť cez npm run vercel:env-push (z .env) alebo manuálne: vercel env add NAME production.
 * Pred spustením: npx vercel link (tím h4ck3d).
 * Použitie: node scripts/vercel-env-production-public.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PRODUCTION_PUBLIC = [
  { name: 'SITE_URL', value: 'https://chiropraxiakosice.eu' },
  { name: 'KEYSTATIC_STORAGE', value: 'github' },
  { name: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG', value: 'keystatic-chiropraxia-kosice' },
];

const ENVS = ['production', 'preview'];

function runVercelEnvAdd(name, value, env) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['vercel', 'env', 'add', name, env], {
      cwd: ROOT,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: process.platform === 'win32',
    });
    child.stdin.write(value, (err) => {
      if (err) return reject(err);
      child.stdin.end();
    });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
    child.on('error', reject);
  });
}

async function main() {
  console.log('Nastavujem produkčné (verejné) env na Vercel: SITE_URL, KEYSTATIC_STORAGE, PUBLIC_KEYSTATIC_GITHUB_APP_SLUG\n');
  for (const { name, value } of PRODUCTION_PUBLIC) {
    for (const env of ENVS) {
      try {
        await runVercelEnvAdd(name, value, env);
        console.log(`  OK ${name} (${env})`);
      } catch (e) {
        console.warn(`  Skip/error ${name} (${env}):`, e.message);
      }
    }
  }
  console.log('\nHotovo. Tajné premenné (KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET, JWT_SECRET, RESEND_API_KEY) nastavte cez: npm run vercel:env-push (z .env) alebo vercel env add NÁZOV production');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
