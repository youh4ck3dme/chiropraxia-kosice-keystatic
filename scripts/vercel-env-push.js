#!/usr/bin/env node
/**
 * Nahodí premenné z lokálneho .env do Vercel do všetkých prostredí (Production, Preview, Development) cez CLI.
 * Pred spustením: npx vercel link (vyberte tím h4ck3d), vyplnený .env v roote.
 * Pre produkciu nastavte v .env SITE_URL=https://chiropraxiakosice.eu pred pushom.
 * Použitie: npm run vercel:env-push alebo node scripts/vercel-env-push.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const envPath = path.join(ROOT, '.env');

const VAR_NAMES = [
  'SITE_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'JWT_SECRET',
  'KEYSTATIC_STORAGE',
  'KEYSTATIC_GITHUB_CLIENT_ID',
  'KEYSTATIC_GITHUB_CLIENT_SECRET',
  'KEYSTATIC_SECRET',
  'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  'GOOGLE_GENERATIVE_AI_API_KEY',
  'SENTRY_AUTH_TOKEN',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'SKIP_KEYSTATIC',
];

function parseEnv(content) {
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
    if (match) {
      const value = match[2].replace(/^\s*['"]?|['"]?\s*$/g, '').trim();
      out[match[1]] = value;
    }
  }
  return out;
}

const VERCEL_ENVS = ['production', 'preview', 'development'];

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
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, 'package.json'))) {
    console.error('Spustite skript z rootu projektu (kde je package.json).');
    process.exit(1);
  }
  if (!fs.existsSync(envPath)) {
    console.error('Chýba .env. Skopírujte .env.example do .env a vyplňte hodnoty.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const env = parseEnv(content);

  const added = [];
  const skipped = [];
  const errors = [];

  for (const name of VAR_NAMES) {
    const value = env[name];
    if (value === undefined || value === '') {
      skipped.push(name);
      continue;
    }
    for (const envType of VERCEL_ENVS) {
      try {
        await runVercelEnvAdd(name, value, envType);
        added.push(`${name} (${envType})`);
      } catch (e) {
        const msg = e.message || String(e);
        if (msg.includes('already exists') || msg.includes('already added')) {
          skipped.push(`${name} / ${envType} (už existuje)`);
        } else {
          errors.push({ name: `${name} / ${envType}`, msg });
        }
      }
    }
  }

  console.log('\n=== Vercel env push (Production, Preview, Development) ===');
  if (added.length) console.log('Pridané:', added.join(', '));
  if (skipped.length) console.log('Preskočené (prázdne alebo už existujú):', skipped.join(', '));
  if (errors.length) {
    console.log('Chyby:');
    errors.forEach(({ name, msg }) => console.log(`  ${name}: ${msg}`));
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
