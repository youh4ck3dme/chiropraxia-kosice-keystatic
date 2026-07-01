# Aktuálny stav projektu

> Aktualizované: 2026-07-01 (po diagnostike)

## 1) Technický stav

- Framework: **Astro 5**
- UI: **React 19**
- Štýly: **Tailwind CSS 4**
- CMS: **Keystatic**
- Testy: **Vitest + Playwright**
- Deploy: **Vercel**

## 2) Overené príkazy

- `npm run lint` ✅
- `npm test` ✅
- `npm run build` ✅
- `npm run diagnose` ⚠️/❌ (detail nižšie)

## 3) Výsledok poslednej diagnostiky (`npm run diagnose`)

- **OK:** 14
- **Varovania:** 2
- **Chyby:** 1

### Chyba
- `.env` chýba (nutné vytvoriť podľa `.env.example`)

### Varovania
- Vercel CLI nie je dostupné v lokálnom prostredí
- Projekt nie je lokálne prepojený cez `vercel link`

## 4) Aktuálne funkčné oblasti

- Verejné stránky (`/`, `/sluzby`, `/about`, `/blog`, `/rezervacia`) sú v projekte.
- API endpointy pre booking, kontakt, newsletter, chatbot a AI SEO helpery sú prítomné.
- Admin rozhranie existuje (`/admin`), vrátane SEO overview (`/admin/seo-overview`).

## 5) Otvorené prevádzkové kroky

- Doplniť reálne produkčné ENV vo Verceli.
- Overiť Vercel link a nasadenie v cieľovom tíme/projekte.
- Pri potrebe DB workflow obnoviť Supabase podľa `docs/SUPABASE_SETUP.md`.

## 6) Súvisiaca dokumentácia

- [README.md](../README.md)
- [LOKALNY-VYVOJ.md](./LOKALNY-VYVOJ.md)
- [PRODUCTION_DEPLOY_CHECKLIST.md](./PRODUCTION_DEPLOY_CHECKLIST.md)
- [VERCEL_KEYSTATIC_AUDIT.md](./VERCEL_KEYSTATIC_AUDIT.md)
