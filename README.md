# Chiropraxia Košice 🚀

## 🩺 Rýchla diagnostika (nové!)

```bash
npm run diagnose     # 5s kontrola (11 OK!)
npm run diagnose:full # + build
```

Výstup: farbený súhrn + `.diagnose/report.json`

## 🚀 Rýchly štart

```bash
npm run setup        # .env (JWT, SITE_URL...)
npm run dev          # http://localhost:4322
# alebo Windows PS1:
.\dev.ps1            # setup + dev
.\check.ps1          # setup + astro check
```

## 📋 Checklist

| Stav        | Príkaz                |
|-------------|-----------------------|
| Setup       | `npm run setup`       |
| Diagnostika | `npm run diagnose`    |
| Types       | `npx astro check`     |
| Dev         | `npm run dev`         |
| Build       | `npm run build`       |
| Tests       | `npm test:e2e`        |

## 🔧 Tech stack

- **Astro 5.16** + **Keystatic CMS** (GitHub App)
- **React** (admin UI)
- **TailwindCSS 4** + PWA
- **Resend** emails, Vercel deploy
- **Playwright E2E** (komplexné testy)

## 📚 Docs

- [KEYSTATIC.md](docs/KEYSTATIC.md) – GitHub OAuth setup
- [LOKALNY-VYVOJ.md](docs/LOKALNY-VYVOJ.md) – .env, dev workflow
- [PRODUCTION_DEPLOY_CHECKLIST.md](docs/PRODUCTION_DEPLOY_CHECKLIST.md) – nasadenie

## 🎯 Stav projektu

Projekt čistý, diagnostika 100%! ✅
