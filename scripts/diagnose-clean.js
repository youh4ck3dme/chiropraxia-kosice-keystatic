#!/usr/bin/env node
/**
 * RÝCHLA DIAGNOSTIKA - CLEAN VERSION (no SonarLint warnings)
 * Node 20+ built-in modules, simple logic, no complex ternaries
 */
import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import net from 'node:net';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.diagnose');
let results = { ok: 0, warn: 0, err: 0 };

const FULL_MODE = process.argv.includes('--full');

function log(type, message) {
  results[type]++;
  const icons = { ok: '✓', warn: '⚠', err: '✗' };
  const colors = { ok: '\\x1b[32m', warn: '\\x1b[33m', err: '\\x1b[31m' };
  const reset = '\\x1b[0m';
  console.log(`${colors[type]}${icons[type]} ${message}${reset}`);
}

function execSafe(command, timeout = 5000) {
  try {
    return child_process.execSync(command, { 
      cwd: ROOT, 
      encoding: 'utf8', 
      timeout 
    }).toString().trim();
  } catch {
    return null;
  }
}

function header(title) {
  console.log('\\n' + '='.repeat(50));
  console.log(title + (FULL_MODE ? ' [FULL]' : ' [QUICK]'));
  console.log('='.repeat(50));
}

// 1. Environment check
header('1. PROSTREDIE');
log('ok', `Node ${process.version}`);
const npmVersion = execSafe('npm --version');
if (npmVersion) {
  log('ok', `npm ${npmVersion}`);
} else {
  log('err', 'npm unavailable');
}

// Port check
header('2. PORT & FILES');
let portStatus = 'checking';
const portServer = net.createServer();
portServer.on('error', () => {
  portStatus = 'occupied';
});
portServer.on('listening', () => {
  portStatus = 'free';
  portServer.close();
});
portServer.listen(4322);
setTimeout(() => {
  log(portStatus === 'free' ? 'ok' : 'warn', `Port 4322: ${portStatus === 'free' ? 'voľný' : 'obsadený'}`);
}, 200);

// Critical files
const requiredFiles = ['package.json', 'astro.config.mjs', 'keystatic.config.ts'];
requiredFiles.forEach(filename => {
  if (fs.existsSync(path.join(ROOT, filename))) {
    log('ok', filename);
  } else {
    log('err', filename + ' missing');
  }
});

// Dependencies
if (fs.existsSync(path.join(ROOT, 'package.json'))) {
  const pkgContent = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
  const pkg = JSON.parse(pkgContent);
  const hasAstro = (pkg.dependencies?.astro || pkg.devDependencies?.astro);
  log(hasAstro ? 'ok' : 'warn', 'Astro dependency');
}

// Environment
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  log('ok', '.env found');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('SITE_URL=')) {
    log('ok', 'SITE_URL configured');
  } else {
    log('warn', 'SITE_URL missing - run npm run setup');
  }
} else {
  log('err', '.env missing - run npm run setup');
}

// Tools
header('3. TOOLS');
const toolList = [
  'npx playwright --version',
  'npx vitest --version', 
  'npx vercel --version'
];
toolList.forEach(toolCmd => {
  const toolName = toolCmd.match(/(\\w+) /)?.[1] || 'tool';
  const result = execSafe(toolCmd);
  if (result) {
    log('ok', toolName);
  } else {
    log('warn', toolName + ' not found');
  }
});

// Full mode
if (FULL_MODE) {
  header('4. FULL BUILD');
  const buildResult = execSafe('npm run build', 120000);
  if (buildResult?.includes('Complete') || buildResult?.includes('built')) {
    log('ok', 'Build successful');
  } else {
    log('err', 'Build failed');
  }
}

// Summary
header('SÚHRN');
console.log(`OK: ${results.ok} | ⚠: ${results.warn} | ✗: ${results.err}`);
try {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({
    timestamp: new Date().toISOString(),
    mode: FULL_MODE ? 'full' : 'quick',
    results
  }, null, 2));
  log('ok', 'Report saved to .diagnose/report.json');
} catch (e) {
  log('warn', 'Report save failed: ' + e.message);
}

process.exit(results.err > 0 ? 1 : 0);

