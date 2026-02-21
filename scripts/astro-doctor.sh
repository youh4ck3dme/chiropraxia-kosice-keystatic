#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.astro-doctor"
mkdir -p "$OUT"

echo "== Astro Doctor ==" | tee "$OUT/summary.txt"
echo "Project: $ROOT" | tee -a "$OUT/summary.txt"
echo "Date: $(date -Iseconds)" | tee -a "$OUT/summary.txt"
echo "" | tee -a "$OUT/summary.txt"

{
  echo "## Versions"
  echo -n "node: "; node -v
  echo -n "npm:  "; npm -v
  echo -n "pnpm: "; (pnpm -v 2>/dev/null || echo "n/a")
  echo -n "yarn: "; (yarn -v 2>/dev/null || echo "n/a")
} | tee "$OUT/versions.txt" >/dev/null

# Astro info (odporúčaný spôsob je npx astro info)
# (Astro Dev Toolbar dokonca spomína, že "Copy debug info" spúšťa astro info.)
( cd "$ROOT" && npx astro info ) > "$OUT/astro-info.txt" 2>&1 || true

# Top-level deps
( cd "$ROOT" && npm ls astro @astrojs/compiler vite vite-plugin-pwa @vite-pwa/astro --depth=0 ) > "$OUT/npm-ls.txt" 2>&1 || true

# PWA virtual moduly - nesmú byť importované v server frontmatteri .astro page
rg -n "virtual:pwa-(register|info|assets)" "$ROOT/src" > "$OUT/pwa-virtual-imports.txt" 2>/dev/null || true

# Podozrivé HTML patterny, ktoré často odpália parser
rg -n "<!--\\s*<textarea|<textarea[^>]*>[^<]*<!--|<html\\b|</html\\b|<body\\b|</body\\b" "$ROOT/src" > "$OUT/suspicious-html.txt" 2>/dev/null || true

echo "## Quick hits" | tee -a "$OUT/summary.txt"
echo "PWA virtual imports: $(wc -l < "$OUT/pwa-virtual-imports.txt" 2>/dev/null || echo 0)" | tee -a "$OUT/summary.txt"
echo "Suspicious HTML hits: $(wc -l < "$OUT/suspicious-html.txt" 2>/dev/null || echo 0)" | tee -a "$OUT/summary.txt"
echo "" | tee -a "$OUT/summary.txt"

echo "== Running build (verbose + DEBUG=astro:*,vite:*) ==" | tee -a "$OUT/summary.txt"

set +e
( cd "$ROOT" && DEBUG=astro:*,vite:* npm run build -- --verbose ) 2>&1 | tee "$OUT/build.log"
STATUS=${PIPESTATUS[0]}
set -e

echo "" | tee -a "$OUT/summary.txt"
echo "Build exit code: $STATUS" | tee -a "$OUT/summary.txt"

if rg -q "originalIM was set twice" "$OUT/build.log"; then
  echo "" | tee -a "$OUT/summary.txt"
  echo "!! Detected compiler panic: originalIM was set twice" | tee -a "$OUT/summary.txt"
  echo "Tip: skontroluj suspicious-html.txt (textarea/comments/html/body) a blog content bisect." | tee -a "$OUT/summary.txt"
fi

if rg -q "RollupError" "$OUT/build.log"; then
  echo "" | tee -a "$OUT/summary.txt"
  echo "!! Detected RollupError" | tee -a "$OUT/summary.txt"
  echo "Tip: pozri prvý RollupError v build.log (zvyčajne unresolved import / zlé exporty)." | tee -a "$OUT/summary.txt"
fi

echo "" | tee -a "$OUT/summary.txt"
echo "Artifacts:" | tee -a "$OUT/summary.txt"
echo "  $OUT/astro-info.txt" | tee -a "$OUT/summary.txt"
echo "  $OUT/npm-ls.txt" | tee -a "$OUT/summary.txt"
echo "  $OUT/pwa-virtual-imports.txt" | tee -a "$OUT/summary.txt"
echo "  $OUT/suspicious-html.txt" | tee -a "$OUT/summary.txt"
echo "  $OUT/build.log" | tee -a "$OUT/summary.txt"

exit "$STATUS"
