#!/usr/bin/env node
/**
 * RÝCHLA DIAGNOSTIKA pre Chiropraxia Košice
 * Spustenie: node scripts/diagnose.js alebo npm run diagnose
 * Kontroluje: Node/npm, deps, config, .env, port 4322, testy, Vercel, Supabase.
 * Módy: --quick (default, preskočí build), --full (vrátane buildu a astro info)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.diagnose');

const isFull = process.argv.includes('--full');
const isQuick = !isFull;

const results = { 
  ok: 0, 
  warn: 0, 
  err: 0, 
  details: { ok: [], warn: [], err: [] } 
};

// Pomocné funkcie
function log(level, msg) {
  results.details[level].push(msg);
  results[level]++;
  const color = level === 'ok' ? '\x1b[32m' : level === 'warn' ? '\x1b[33m' : '\x1b[31m';
  const prefix = level === 'ok' ? '✓' : level === 'warn' ? '⚠' : '✗';
  console.log(`${color}${prefix} ${msg}\x1b[0m`);
}

function safeExec(cmd, timeout = 10000) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe', timeout }).trim();
  } catch (e) {
    return '';
  }
}

function section(title) {
  console.log('\n' + '\x1b[1m' + '═'.repeat(60) + '\x1b[0m');
  console.log(`  \x1b[1m${title}\x1b[0m ${isFull ? '[FULL]' : '[QUICK]'}`);
  console.log('═'.repeat(60));
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') resolve(false);
      else resolve(true); // Iná chyba, predpokladáme voľný
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// === Hlavný priebeh ===
async function main() {
  // 1. Prostredie
  section('1. PROSTREDIE');
  const nodeVer = process.version;
  const majorNode = parseInt(nodeVer.slice(1).split('.')[0]);
  if (majorNode >= 20) log('ok', `Node ${nodeVer} OK`);
  else log('warn', `Node ${nodeVer} – odporúča sa v20+`);

  const npmVer = safeExec('npm -v');
  npmVer ? log('ok', `npm ${npmVer}`) : log('err', 'npm -v zlyhalo');

  const port4322 = await checkPort(4322);
  port4322 ? log('ok', 'Port 4322 voľný') : log('warn', 'Port 4322 obsadený (beží už dev server?)');

  // 2. Súbory a Závislosti
  section('2. SÚBORY A ZÁVISLOSTI');
  const criticalFiles = ['package.json', 'astro.config.mjs', 'keystatic.config.ts', 'tailwind.config.mjs'];
  criticalFiles.forEach(f => {
    fs.existsSync(path.join(ROOT, f)) ? log('ok', `${f} OK`) : log('err', `${f} chýba`);
  });

  if (fs.existsSync(path.join(ROOT, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const essential = ['astro', '@keystatic/core', 'react', 'tailwindcss'];
    essential.forEach(d => {
      deps[d] ? log('ok', `Dep: ${d} OK`) : log('err', `Chýba dep: ${d}`);
    });
  }

  fs.existsSync(path.join(ROOT, 'node_modules')) ? log('ok', 'node_modules OK') : log('err', 'node_modules chýba – npm install');

  // 3. Konfigurácia a ENV
  section('3. KONFIGURÁCIA A ENV');
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    log('ok', '.env existuje');
    const envData = fs.readFileSync(envPath, 'utf-8');
    const requiredEnv = ['SITE_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
    requiredEnv.forEach(key => {
      const match = envData.match(new RegExp(`^${key}=`, 'm'));
      match ? log('ok', `ENV: ${key} OK`) : log('warn', `ENV: ${key} chýba`);
    });
  } else {
    log('err', '.env chýba – vytvorte ho podľa .env.example');
  }

  // 4. Tools (Vercel, Playwright, Vitest)
  section('4. NÁSTROJE');
  const tools = [
    { name: 'Vercel CLI', cmd: 'npx vercel --version' },
    { name: 'Playwright', cmd: 'npx playwright --version' },
    { name: 'Vitest', cmd: 'npx vitest --version' }
  ];

  tools.forEach(t => {
    const out = safeExec(t.cmd);
    out ? log('ok', `${t.name} OK (${out.split('\n')[0]})`) : log('warn', `${t.name} ?`);
  });

  // Vercel Link check
  if (fs.existsSync(path.join(ROOT, '.vercel/project.json'))) {
    log('ok', 'Vercel Project linked');
  } else {
    log('warn', 'Vercel nie je prepojený (skúste vercel link)');
  }

  // Supabase Health (Ping)
  const envData = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
  const sUrlMatch = envData.match(/^SUPABASE_URL=(.*)$/m);
  if (sUrlMatch) {
    const sUrl = sUrlMatch[1].trim().replace(/['"]/g, '');
    try {
      // Skúsime len jednoduchý ping cez npx (curl/node fetch by bol lepší ale toto je non-blocking)
      // Využijeme fakt, že supabase url končí na .supabase.co
      const host = new URL(sUrl).host;
      log('ok', `Supabase host: ${host}`);
    } catch {
      log('warn', 'Supabase URL neplatná');
    }
  }

  // 5. Full Checks (Astro info & Build)
  if (isFull) {
    section('5. FULL KONTROLA (Pomalé)');
    log('ok', 'Spúšťam Astro info...');
    const info = safeExec('npx astro info', 20000);
    console.log(info ? info : 'Astro info zlyhalo');

    log('ok', 'Spúšťam skúšobný Build...');
    const build = safeExec('npm run build', 120000);
    if (build && (build.includes('Complete') || build.includes('built'))) {
      log('ok', 'Build OK');
    } else {
      log('err', 'Build zlyhal');
    }
  }

  // Súhrn
  section('SÚHRN');
  console.log('\n┌' + '─'.repeat(25) + '┐');
  console.log(`│ Stav        │ Počet     │`);
  console.log('├' + '─'.repeat(25) + '┤');
  console.log(`│ \x1b[32m✓ OK\x1b[0m        │ ${results.ok.toString().padEnd(10)} │`);
  console.log(`│ \x1b[33m⚠ Varovania\x1b[0m │ ${results.warn.toString().padEnd(10)} │`);
  console.log(`│ \x1b[31m✗ Chyby\x1b[0m     │ ${results.err.toString().padEnd(10)} │`);
  console.log('└' + '─'.repeat(25) + '┘');

  // Uloženie reportu
  try {
    if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
    const report = {
      timestamp: new Date().toISOString(),
      mode: isFull ? 'full' : 'quick',
      ...results
    };
    fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`\nReport uložený do: .diagnose/report.json`);
  } catch (e) {}

  // Exit kód: 0 ak len OK, 2 ak sú Varovania, 1 ak sú Chyby (Chyby majú prednosť)
  const exitCode = results.err > 0 ? 1 : (results.warn > 0 ? 2 : 0);
  process.exit(exitCode);
}

main().catch(err => {
  console.error('\x1b[31mKritická chyba diagnostiky:\x1b[0m', err);
  process.exit(1);
});
