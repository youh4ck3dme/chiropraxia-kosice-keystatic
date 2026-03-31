# Spustí setup .env (ak treba) a dev server. Použitie: .\dev.ps1
Set-Location $PSScriptRoot
npm run diagnose:quick
node scripts/setup-dev.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run dev
