#!/usr/bin/env node
/**
 * RÝCHLA DIAGNOSTIKA pre Chiropraxia Košice - QUICK MODE (default)
 * Spustenie: node scripts/diagnose.js alebo npm run diagnose
 * Kontroluje: Node/npm, deps, config, .env, port 4322, testy, Vercel. Preskočí pomalé (build, astro info).
 * Full: npm run diagnose:full
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.diagnose');
const results = { ok: 0, warn: 0, err: 0, details: { ok: [], warn: [], err: [] } };

const isQuick = !process.argv.some(arg => arg.includes('full') || arg.includes('--build'));
const isFull = !isQuick;

function log(level, msg) {
  results.details[level].push(msg);
  results[level]++;
  const color = level === 'ok' ? '\x1b[32m' : level === 'warn' ? '\x1b[33m' : '\x1b[31m';
  const prefix = level === 'ok' ? '✓' : level === 'warn' ? '⚠' : '✗';
  console.log(`${color}${prefix} ${msg}\x1b[0m`);
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', cwd: ROOT, stdio: 'pipe', ...opts });
  } catch (e) {
    return (e.stdout ? e.stdout : '') + (e.stderr ? e.stderr : '') || String(e);
  }
}

function section(title) {
  console.log('\n' + '\x1b[1m' + '='.repeat(60) + '\x1b[0m');
  console.log(`  \x1b[1m${title}\x1b[0m`);
  console.log('='.repeat(60));
}

// === 1. Prostredie ===
section('1. Prostredie');
const nodeVer = process.version;
const nodeMajor = parseInt(nodeVer.slice(1).split('.')[0], 10);
if (nodeMajor >= 20) log('ok', `Node ${nodeVer} OK`);
else log('warn', `Node ${nodeVer} – odporúča sa 20.x`);

const npmVer = run('npm -v', { timeout: 5000 }).trim();
if (npmVer) log('ok', `npm ${npmVer}`);
else log('err', 'npm -v zlyhalo');

// Port 4322
const portFree = !isPortUsed(4322);
log(portFree ? 'ok' : 'warn', portFree ? 'Port 4322 voľný' : 'Port 4322 obsadený');

// === 2. Závislosti ===
section('2. Závislosti');
const pkgPath = path.join(ROOT, 'package.json');
if (!fs.existsSync(pkgPath)) log('err', 'package.json chýba');
else {
  log('ok', 'package.json OK');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const required = ['astro', '@keystatic/core', '@keystatic/astro', 'react'];
  for (const r of required) {
    deps[r] ? log('ok', `${r} OK`) : log('err', `Chýba ${r}`);
  }
  const nodeModules = path.join(ROOT, 'node_modules');
  fs.existsSync(nodeModules) ? log('ok', 'node_modules OK') : log('err', 'node_modules chýba – npm install');
}

// === 3. Konfigurácia ===
section('3. Konfigurácia');
const configs = ['astro.config.mjs', 'keystatic.config.ts'];
for (const cfg of configs) {
  const full = path.join(ROOT, cfg);
  if (fs.existsSync(full)) {
    log('ok', `${cfg} existuje`);
    if (cfg === 'keystatic.config.ts') {
      const kc = fs.readFileSync(full, 'utf-8');
      kc.includes('process.env') ? log('err', 'keystatic.config.ts: process.env BAD! Použi import.meta.env') : log('ok', 'keystatic.config.ts clean');
    }
  } else log('err', `${cfg} chýba`);
}

// .env
section('4. .env');
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  log('ok', '.env existuje');
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  const hasSiteUrl = lines.some(l => l.includes('SITE_URL'));
  const hasJwt = lines.some(l => l.includes('JWT_SECRET'));
  hasSiteUrl ? log('ok', 'SITE_URL nastavené') : log('warn', 'SITE_URL chýba v .env');
  hasJwt ? log('ok', 'JWT_SECRET OK') : log('warn', 'JWT_SECRET chýba');
} else log('err', '.env chýba – npm run setup');

// === 5. Testy a Tools ===
section('5. Testy');
try {
  run('npx playwright --version', { timeout: 10000 });
  log('ok', 'Playwright OK');
} catch {
  log('warn', 'Playwright ? – npx playwright install');
}
try {
  run('npx vitest --version', { timeout: 5000 });
  log('ok', 'Vitest OK');
} catch {
  log('warn', 'Vitest ?');
}

// Vercel
try {
  const vercelOut = run('npx vercel --version', { timeout: 10000 }).toLowerCase();
  vercelOut.includes('vercel') ? log('ok', 'Vercel CLI OK') : log('warn', 'Vercel CLI ?');
} catch {
  log('warn', 'Vercel nainštalovať: npm i -g vercel');
}

// Supabase quick ping (ak SUPABASE_URL)
const supabaseUrl = getEnv('SUPABASE_URL');
if (supabaseUrl) {
  // Simple HEAD check
  try {
    run(`curl -s -I ${supabaseUrl.replace('/rest/v1', '')}`, { timeout: 5000 });
    log('ok', 'Supabase dostupný');
  } catch {
    log('warn', 'Supabase ping zlyhal');
  }
} else log('warn', 'SUPABASE_URL nie je v .env');

// === 6. Full checks (voliteľné) ===
if (isFull) {
  section('6. Full: Astro info & Build');
  try {
    const astroInfo = run('npx astro info', { timeout: 20000 });
    astroInfo.includes('Error') ? log('warn', 'Astro info varuje') : log('ok', 'Astro info OK');
  } catch (e) {
    log('warn', `Astro info: ${e.message}`);
  }
  try {
    const buildOut = run('npm run build', { timeout: 180000 });
    (buildOut.includes('Complete') || buildOut.includes('built')) ? log('ok', 'Build OK') : log('err', 'Build zlyhal');
  } catch (e) {
    log('err', 'Build fail');
  }
} else {
  console.log('  (full checks preskočené v quick móde)');
}

// === Súhrn tabuľka ===
section('SÚHRN');
console.log('\n' + '+-------------------+-------+');
console.log('| Stav              | Počet |');
console.log('+-------------------+-------+');
console.log(`| ✓ OK              | ${results.ok}    |`);
console.log(`| ⚠ Varovania       | ${results.warn}  |`);
console.log(`| ✗ Chyby           | ${results.err}   |`);
console.log('+-------------------+-------+');

const exitCode = results.err > 0 ? (results.warn > 0 ? 2 : 1) : 0;

// Report
fs.mkdirSync(OUT, { recursive: true });
const report = { ...results, isQuick, timestamp: new Date().toISOString(), mode: isQuick ? 'quick' : 'full' };
fs.writeFileSync(path.join(OUT, `report-${isQuick ? 'quick' : 'full'}.json`), JSON.stringify(report, null, 2));
console.log(`\\nReport: .diagnose/report-${isQuick ? 'quick' : 'full'}.json`);

process.exit(exitCode);

function isPortUsed(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

function getEnv(key) {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return '';
  const content = fs.readFileSync(envPath, 'utf-8');
  const match = content.match(new RegExp(`^\\s*${key}\\s*=\\s*(.*)$`, 'm'));
  return match ? match[1].replace(/^["']|["']$/g, '').trim() : '';
}

