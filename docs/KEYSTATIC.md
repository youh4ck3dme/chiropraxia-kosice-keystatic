# Keystatic CMS

## Overview

Content (blog, digital cards, testimonials, site settings) is managed via [Keystatic](https://keystatic.com). The CMS UI is mounted at **`/keystatic`** when the integration is enabled.

## Authentication

- **GitHub mode** (`KEYSTATIC_STORAGE=github`): Access to `/keystatic` is protected by **GitHub** (GitHub App s OAuth prihlásením). Len používatelia s prístupom do repozitára `youh4ck3dme/chiropraxia-kosice-keystatic` sa môžu prihlásiť. Používa sa **GitHub App** „Keystatic Chiropraxia Kosice“ (slug `keystatic-chiropraxia-kosice`). Nastavte env premenné podľa `.env.example` a [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md).
- **Local mode** (`KEYSTATIC_STORAGE=local`): Content is stored under the project; no OAuth. Use only for local development.

The app does not add extra middleware protection for `/keystatic`; security relies on Keystatic’s built-in GitHub OAuth when using GitHub storage.

## Nastavenie Keystatic (GitHub App)

Projekt používa **GitHub App** „Keystatic Chiropraxia Kosice“ (vlastník **youh4ck3dme**), nie klasickú OAuth App. App slug je **`keystatic-chiropraxia-kosice`** (z URL https://github.com/apps/keystatic-chiropraxia-kosice).

### Produkcia (chiropraxiakosice.eu)

- **Hlavná doména:** `https://chiropraxiakosice.eu`
- **GitHub App:** [Keystatic Chiropraxia Kosice](https://github.com/apps/keystatic-chiropraxia-kosice) – **Homepage URL** a **Callback URL** musia byť nastavené presne (viď nižšie). Repozitár obsahu: `youh4ck3dme/chiropraxia-kosice-keystatic`.
- **Vercel:** presný zoznam premenných a krokov je v [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md). Pre A–Z checklist Production env a overenie pozri [VERCEL_PRODUCTION_ENV_CHECKLIST.md](VERCEL_PRODUCTION_ENV_CHECKLIST.md).

### Čo skontrolovať v GitHub App (min. zmeny)

V **Settings → Developer settings → GitHub Apps → Keystatic Chiropraxia Kosice**:

- **Homepage URL:** `https://chiropraxiakosice.eu`
- **Callback URL:** `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback`
- **Client ID** a **Client secret** – tieto hodnoty skopírujte do Vercel (a lokálne do `.env`). Client secret sa zobrazí len pri vytvorení / vygenerovaní nového; neukladajte ho do repozitára.

### Premenné v .env / Vercel

- `KEYSTATIC_GITHUB_CLIENT_ID` – Client ID z GitHub App (napr. `Iv23liFiHhzVSsZPdHpT`)
- `KEYSTATIC_GITHUB_CLIENT_SECRET` – Client secret z GitHub App (tajné)
- `KEYSTATIC_SECRET` – vlastný reťazec **min. 32 znakov** (môže vygenerovať `scripts/setup-dev.js` alebo `node -e "console.log(require('crypto').randomBytes(24).toString('base64'))"`)
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` – voliteľné; v kóde je fallback **`keystatic-chiropraxia-kosice`** (zodpovedá vašej GitHub App)

### Kontrola konfigurácie

Spustite z rootu projektu:

```bash
node scripts/verify-keystatic-github.js
```

Skript overí prítomnosť a formát premenných a vypíše odporúčané callback URL. Ak sú všetky položky OK, `/keystatic` by mal fungovať s prihlásením cez GitHub.

## Disabling Keystatic in production

To avoid exposing the CMS UI in production (and to reduce bundle size), you can omit the Keystatic integration from the build:

1. Set **`SKIP_KEYSTATIC=true`** in your production environment (e.g. Vercel Project Settings → Environment Variables).
2. Rebuild and deploy. The `/keystatic` route will not be included; content is still read from the repo at build time.

For local or staging builds where you want to edit content, leave `SKIP_KEYSTATIC` unset so the integration is included.

## Environment variables

See `.env.example` for:

- `KEYSTATIC_STORAGE` – `local` or `github`
- `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` – required for GitHub mode
- `SKIP_KEYSTATIC` – set to `true` in production to disable the CMS UI (optional)

## Build output

Server build output is handled by the Vercel adapter (e.g. `.vercel/output`). The `dist` directory is excluded from TypeScript in `tsconfig.json`.
