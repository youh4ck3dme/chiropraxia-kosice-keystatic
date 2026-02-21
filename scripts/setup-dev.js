#!/usr/bin/env node
/**
 * Pripraví .env pre lokálny vývoj: vytvorí z .env.example ak chýba,
 * doplní JWT_SECRET, SITE_URL, RESEND_API_KEY (placeholder) a KEYSTATIC_SECRET (pri GitHub storage) ak sú prázdne.
 * Spustenie: node scripts/setup-dev.js alebo npm run setup
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const envPath = path.join(ROOT, '.env');
const examplePath = path.join(ROOT, '.env.example');

const updates = [];

function randomSecret(length = 32) {
  return crypto.randomBytes(length / 2).toString('hex');
}

// 1. Ak .env neexistuje, skopíruj .env.example
if (!fs.existsSync(envPath)) {
  if (!fs.existsSync(examplePath)) {
    console.error('Chýba .env.example – nemôžem vytvoriť .env.');
    process.exit(1);
  }
  fs.copyFileSync(examplePath, envPath);
  updates.push('.env vytvorený z .env.example');
}

// 2. Načítaj .env riadok po riadku a uprav hodnoty
let content = fs.readFileSync(envPath, 'utf-8');
const lines = content.split(/\r?\n/);
const seen = { JWT_SECRET: false, SITE_URL: false, RESEND_API_KEY: false, KEYSTATIC_SECRET: false };

const getEnvValue = (key) => {
  const re = new RegExp(`^\\s*${key}\\s*=(.*)$`);
  for (const l of lines) {
    const m = l.match(re);
    if (m) return (m[1].replace(/^\s*['"]?|['"]?\s*$/g, '') || '').trim();
  }
  return '';
};
const keystaticStorage = getEnvValue('KEYSTATIC_STORAGE');
const needKeystaticSecret = keystaticStorage !== 'local'; // github alebo neprázdne iné

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
  if (match) {
    const key = match[1];
    const value = match[2].replace(/^\s*['"]?|['"]?\s*$/g, '').trim();
    if (key === 'JWT_SECRET' && (!value || value.length < 16)) {
      lines[i] = `${key}=${randomSecret(32)}`;
      seen.JWT_SECRET = true;
      updates.push('JWT_SECRET doplnený (náhodný reťazec)');
    } else if (key === 'SITE_URL' && !value) {
      lines[i] = `${key}=http://localhost:4322`;
      seen.SITE_URL = true;
      updates.push('SITE_URL nastavený na http://localhost:4322');
    } else if (key === 'RESEND_API_KEY' && !value) {
      lines[i] = `${key}=re_placeholder`;
      seen.RESEND_API_KEY = true;
      updates.push('RESEND_API_KEY nastavený na placeholder (pre build/check)');
    } else if (needKeystaticSecret && key === 'KEYSTATIC_SECRET' && (!value || value.length < 32)) {
      lines[i] = `${key}=${randomSecret(32)}`;
      seen.KEYSTATIC_SECRET = true;
      updates.push('KEYSTATIC_SECRET doplnený (náhodný reťazec, min. 32 znakov)');
    }
  }
}

// Ak niektorá premenná v .env vôbec nebola, pridaj na koniec
const toAppend = [];
const hasLine = (key) => lines.some((l) => new RegExp(`^\\s*${key}\\s*=`).test(l));
if (!seen.JWT_SECRET && !hasLine('JWT_SECRET')) {
  toAppend.push(`JWT_SECRET=${randomSecret(32)}`);
  updates.push('JWT_SECRET doplnený (náhodný reťazec)');
}
if (!seen.SITE_URL && !hasLine('SITE_URL')) {
  toAppend.push('SITE_URL=http://localhost:4322');
  updates.push('SITE_URL pridaný');
}
if (!seen.RESEND_API_KEY && !hasLine('RESEND_API_KEY')) {
  toAppend.push('RESEND_API_KEY=re_placeholder');
  updates.push('RESEND_API_KEY pridaný');
}
if (needKeystaticSecret && !seen.KEYSTATIC_SECRET && !hasLine('KEYSTATIC_SECRET')) {
  toAppend.push(`KEYSTATIC_SECRET=${randomSecret(32)}`);
  updates.push('KEYSTATIC_SECRET pridaný (náhodný reťazec pre Keystatic GitHub)');
}

let out = lines.join('\n');
if (toAppend.length) {
  out = out.trimEnd();
  if (out) out += '\n';
  out += toAppend.join('\n') + '\n';
}
fs.writeFileSync(envPath, out, 'utf-8');

if (updates.length) {
  console.log('Setup dokončený:');
  updates.forEach((u) => console.log('  -', u));
} else {
  console.log('.env už je pripravený (žiadne zmeny).');
}
