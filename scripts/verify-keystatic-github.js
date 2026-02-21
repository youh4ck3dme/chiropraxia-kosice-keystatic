#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const root = process.cwd();
const envPath = path.join(root, '.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const siteUrl = process.env.SITE_URL || 'https://chiropraxiakosice.eu';
const storage = process.env.KEYSTATIC_STORAGE || 'github';
const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID || '';
const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || '';
const keystaticSecret = process.env.KEYSTATIC_SECRET || '';
const appSlug = process.env.PUBLIC_KEYSTATIC_GITHUB_APP_SLUG || '';

function checkNoOuterWhitespace(name, value) {
  if (!value) return;
  if (value !== value.trim()) {
    add('err', `${name} obsahuje medzery alebo nový riadok na začiatku/konci`);
  } else {
    add('ok', `${name} nemá žiadne skryté whitespace znaky`);
  }
}

const expectedProdCallback = `${siteUrl.replace(/\/$/, '')}/api/keystatic/github/oauth/callback`;
const expectedLocalCallback = 'http://localhost:4322/api/keystatic/github/oauth/callback';

const results = { ok: [], warn: [], err: [] };

function add(level, message) {
  results[level].push(message);
  const icon = level === 'ok' ? '✓' : level === 'warn' ? '⚠' : '✗';
  console.log(`${icon} ${message}`);
}

console.log('\n=== Keystatic GitHub Readiness Check ===\n');

if (storage === 'github') add('ok', 'KEYSTATIC_STORAGE=github');
else add('warn', `KEYSTATIC_STORAGE=${storage} (pre GitHub auth nastav github)`);

if (clientId) add('ok', 'KEYSTATIC_GITHUB_CLIENT_ID je nastavené');
else add('err', 'Chýba KEYSTATIC_GITHUB_CLIENT_ID');
checkNoOuterWhitespace('KEYSTATIC_GITHUB_CLIENT_ID', clientId);

if (clientSecret) add('ok', 'KEYSTATIC_GITHUB_CLIENT_SECRET je nastavené');
else add('err', 'Chýba KEYSTATIC_GITHUB_CLIENT_SECRET');
checkNoOuterWhitespace('KEYSTATIC_GITHUB_CLIENT_SECRET', clientSecret);

if (!keystaticSecret) {
  add('err', 'Chýba KEYSTATIC_SECRET');
} else if (keystaticSecret.length < 32) {
  add('err', `KEYSTATIC_SECRET je príliš krátky (${keystaticSecret.length}), minimum je 32 znakov`);
} else {
  add('ok', `KEYSTATIC_SECRET má bezpečnú dĺžku (${keystaticSecret.length})`);
}

if (appSlug) add('ok', 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG je nastavené');
else add('warn', 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG nie je nastavené (odporúčané pre GitHub App flow)');
checkNoOuterWhitespace('PUBLIC_KEYSTATIC_GITHUB_APP_SLUG', appSlug);

console.log('\nOdporúčané callback URL v GitHub OAuth App:');
console.log(`- Production: ${expectedProdCallback}`);
console.log(`- Local dev:  ${expectedLocalCallback}`);

console.log('\nSúhrn:');
console.log(`OK: ${results.ok.length}`);
console.log(`Varovania: ${results.warn.length}`);
console.log(`Chyby: ${results.err.length}`);

process.exit(results.err.length > 0 ? 1 : 0);
