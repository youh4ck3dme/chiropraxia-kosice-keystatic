# Prepojenie s existujúcim Vercel projektom a production deploy.
# Pred spustením: npx vercel login (jednorazovo).
Set-Location $PSScriptRoot\..

Write-Host "Linking to Vercel project..." -ForegroundColor Cyan
npx vercel link --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "Run: npx vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Deploying to production..." -ForegroundColor Cyan
npx vercel deploy --prod --yes
exit $LASTEXITCODE
