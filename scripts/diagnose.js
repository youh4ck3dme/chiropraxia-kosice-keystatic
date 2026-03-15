#!/usr/bin/env node
/**
 * Diagnostický skript pre Chiropraxia Košice
 * Spustenie: node scripts/diagnose.js
 * Kontroluje: Node, závislosti, konfiguráciu, obsah, build, známe problémy
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.diagnose');
const results = { ok: [], warn: [], err: [] };

function log(level, msg) {
  results[level].push(msg);
  const prefix = level === 'ok' ? '✓' : level === 'warn' ? '⚠' : '✗';
  console.log(`${prefix} ${msg}`);
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', cwd: ROOT, ...opts });
  } catch (e) {
    return e.stdout || e.stderr || String(e);
  }
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

// --- 1. Prostredie ---
section('1. Prostredie');
try {
  const nodeVer = process.version;
  const nodeMajor = parseInt(nodeVer.slice(1).split('.')[0], 10);
  if (nodeMajor >= 18) log('ok', `Node ${nodeVer}`);
  else log('warn', `Node ${nodeVer} – odporúča sa 20.x (package.json engines)`);
} catch (e) {
  log('err', `Node: ${e.message}`);
}

try {
  const npmVer = run('npm -v').trim();
  log('ok', `npm ${npmVer}`);
} catch (e) {
  log('warn', `npm: ${e.message}`);
}

// --- 2. Závislosti ---
section('2. Závislosti');
const pkgPath = path.join(ROOT, 'package.json');
if (fs.existsSync(pkgPath)) {
  log('ok', 'package.json existuje');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const required = ['astro', '@keystatic/core', '@keystatic/astro', 'react'];
  for (const r of required) {
    if (deps[r]) log('ok', `${r}: ${deps[r]}`);
    else log('err', `Chýba závislosť: ${r}`);
  }
} else {
  log('err', 'package.json neexistuje');
}

const nodeModules = path.join(ROOT, 'node_modules');
if (fs.existsSync(nodeModules)) {
  log('ok', 'node_modules existuje');
} else {
  log('err', 'node_modules chýba – spustite: npm install');
}

// --- 3. Konfigurácia ---
section('3. Konfigurácia');
const astroConfig = path.join(ROOT, 'astro.config.mjs');
if (fs.existsSync(astroConfig)) {
  log('ok', 'astro.config.mjs existuje');
  const astroContent = fs.readFileSync(astroConfig, 'utf-8');
  if (astroContent.includes('define:') && astroContent.includes('process.env')) {
    log('ok', 'Vite define (process polyfill) pre Keystatic je nastavený');
  } else if (astroContent.includes('process.env') && !astroContent.includes('define:')) {
    log(
      'warn',
      'astro.config používa process.env bez Vite define – môže spôsobiť chybu v prehliadači'
    );
  }
} else {
  log('err', 'astro.config.mjs chýba');
}

const keystaticConfig = path.join(ROOT, 'keystatic.config.ts');
if (fs.existsSync(keystaticConfig)) {
  log('ok', 'keystatic.config.ts existuje');
  const kc = fs.readFileSync(keystaticConfig, 'utf-8');
  if (kc.includes('process.env')) {
    log(
      'err',
      'keystatic.config.ts používa process.env – spôsobuje "process is not defined" v prehliadači'
    );
  } else if (kc.includes('import.meta.env')) {
    log('ok', 'keystatic.config.ts používa import.meta.env (správne)');
  }
} else {
  log('err', 'keystatic.config.ts chýba');
}

// --- 4. Obsah a adresáre ---
section('4. Obsah a adresáre');
const contentDirs = [
  'src/content/blog',
  'src/content/settings',
  'src/content/digital-cards',
  'src/content/testimonials',
];
for (const d of contentDirs) {
  const full = path.join(ROOT, d);
  if (fs.existsSync(full)) {
    const files = fs.readdirSync(full, { withFileTypes: true });
    const count = files.filter((f) => f.isFile()).length;
    log('ok', `${d}: ${count} súbor(ov)`);
  } else {
    log('warn', `${d} neexistuje – keystatic glob-loader to môže hlásiť`);
  }
}

// --- 5. Známé problémy ---
section('5. Známé problémy');
// Note: API route is og.ts; no need to warn about og.tsx unless it is re-introduced.

const envExample = path.join(ROOT, '.env.example');
const env = path.join(ROOT, '.env');
if (fs.existsSync(envExample) && !fs.existsSync(env)) {
  log('warn', '.env chýba – skopírujte .env.example a vyplňte premenné');
} else if (fs.existsSync(env)) {
  log('ok', '.env existuje');
}

// --- 6. Astro info ---
section('6. Astro info');
try {
  const astroInfo = run('npx astro info 2>&1', { timeout: 15000 });
  console.log(astroInfo);
  if (astroInfo.includes('Error')) log('warn', 'Astro info hlási chyby');
  else log('ok', 'Astro info OK');
} catch (e) {
  log('warn', `Astro info: ${e.message}`);
}

// --- 7. Build (voliteľne, môže trvať) ---
section('7. Rýchla kontrola build-u');
const buildQuick = process.argv.includes('--build');
if (buildQuick) {
  try {
    const out = run('npm run build 2>&1', { timeout: 120000 });
    if (out.includes('Complete!') || out.includes('built in')) {
      log('ok', 'Build prebehol úspešne');
    } else if (out.includes('Error') || out.includes('error')) {
      log('err', 'Build zlyhal – pozri výstup vyššie');
    }
  } catch (e) {
    log('err', `Build: ${e.message}`);
  }
} else {
  console.log('  (preskočené – spustite s --build pre plný build)');
}

// --- Súhrn ---
section('Súhrn');
console.log(`OK: ${results.ok.length}`);
console.log(`Varovania: ${results.warn.length}`);
console.log(`Chyby: ${results.err.length}`);

// Uloženie do súboru
fs.mkdirSync(OUT, { recursive: true });
const report = {
  timestamp: new Date().toISOString(),
  ok: results.ok,
  warn: results.warn,
  err: results.err,
};
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2), 'utf-8');
console.log(`\nReport uložený do: ${path.join(OUT, 'report.json')}`);

process.exit(results.err.length > 0 ? 1 : 0);
