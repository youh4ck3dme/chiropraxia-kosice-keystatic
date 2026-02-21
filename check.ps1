# Spustí setup .env (ak treba) a astro check. Použitie: .\check.ps1
Set-Location $PSScriptRoot
node scripts/setup-dev.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npx astro check
