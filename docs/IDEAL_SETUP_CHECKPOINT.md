# Checkpoint: Ideálne nastavenie projektu (sync / recovery)

Tento dokument je **jedno miesto** so všetkými nastaveniami projektu: GitHub, Vercel, env, doména, lokálne prostredie. Pri poruche alebo novom klone ho otvor a podľa sekcií zosynchronizuj editor, repozitár a Vercel. Neobsahuje heslá ani tajné hodnoty – len názvy premenných a odkazy na dokumenty, kde sú hodnoty popísané.

---

## 1. Repozitár a vetva

- **GitHub repo:** `https://github.com/youh4ck3dme/chiropraxia-kosice-keystatic`
- **Production vetva:** `main`
- **Lokálny remote:** `git remote -v` → `origin` by mal smerovať na vyššie URL

---

## 2. Vercel

- **Tím:** **h4ck3d** (nie h4ck3d-labs-projects)
- **Projekt:** ten, ktorý je napojený na repo `youh4ck3dme/chiropraxia-kosice-keystatic`
- **Production branch:** `main` (Vercel → Projekt → Settings → Git)
- **Domény:** `chiropraxiakosice.eu`, `www.chiropraxiakosice.eu` (Settings → Domains)
- **Link lokálne:** `npx vercel link` → zvoliť tím **h4ck3d** a tento projekt

---

## 3. Environment Variables (Vercel Production)

Povinné premenné (názvy; hodnoty z GitHub App / Resend / vlastné generovanie):

- `SITE_URL` = `https://chiropraxiakosice.eu` (bez lomítka na konci)
- `KEYSTATIC_STORAGE` = `github`
- `KEYSTATIC_GITHUB_CLIENT_ID` = (z GitHub App)
- `KEYSTATIC_GITHUB_CLIENT_SECRET` = (z GitHub App)
- `KEYSTATIC_SECRET` = (náhodný reťazec min. 32 znakov)
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` = `keystatic-chiropraxia-kosice`
- `JWT_SECRET` = (min. 16 znakov, odporúčané 32+)
- `RESEND_API_KEY` = (z Resend)

Voliteľné: `RESEND_FROM_EMAIL`, `SKIP_KEYSTATIC`, `GOOGLE_GENERATIVE_AI_API_KEY`, Twilio, Sentry.

**Sync z lokálneho `.env`:** `npm run vercel:env-push` (vyplnený `.env` v root projekta).  
**Len verejné hodnoty (SITE_URL, KEYSTATIC_STORAGE, APP_SLUG):** `npm run vercel:env-production-public`.

Detailný zoznam a overenie: [VERCEL_PRODUCTION_ENV_CHECKLIST.md](VERCEL_PRODUCTION_ENV_CHECKLIST.md).

---

## 4. GitHub App (Keystatic)

- **Názov:** Keystatic Chiropraxia Kosice
- **Slug:** `keystatic-chiropraxia-kosice`
- **Homepage URL:** `https://chiropraxiakosice.eu`
- **Callback URL:** `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback`

Client ID a Client secret z tejto aplikácie musia byť rovnaké ako `KEYSTATIC_GITHUB_CLIENT_ID` a `KEYSTATIC_GITHUB_CLIENT_SECRET` vo Vercel. Nastavenie: GitHub → Settings → Developer settings → GitHub Apps → Keystatic Chiropraxia Kosice.

---

## 5. Lokálny editor / prostredie

- **Node:** 20.x (v projekte je `.nvmrc`; `package.json` → engines)
- **Lokálne .env:** skopírovať z `.env.example`, vyplniť hodnoty (vrátane produkčných pre Vercel sync)
- **Overenie Keystatic:** `node scripts/verify-keystatic-github.js`
- **Build:** `npm run build` → musí prejsť

---

## 6. Rýchle príkazy

```bash
# Lokálne prepojenie na Vercel
npx vercel link

# Sync env z .env do Vercel (vyplnený .env)
npm run vercel:env-push

# Len verejné produkčné premenné (SITE_URL, KEYSTATIC_STORAGE, APP_SLUG)
npm run vercel:env-production-public

# Production deploy z CLI
npx vercel --prod

# Alebo push na main (automatický production deploy)
git push origin main
```

---

## 7. Odkazy na detailnú dokumentáciu

- **Env A–Z a overenie:** [VERCEL_PRODUCTION_ENV_CHECKLIST.md](VERCEL_PRODUCTION_ENV_CHECKLIST.md)
- **Keystatic + Vercel (nastavenie krok za krokom):** [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md)
- **Doména nefunguje:** [DOMAIN_VERCEL.md](DOMAIN_VERCEL.md)
- **Deploy checklist:** [PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md)
- **Keystatic (GitHub App, lokálny režim):** [KEYSTATIC.md](KEYSTATIC.md)

---

## 8. Keď niečo nefunguje

| Problém | Kde riešiť |
|--------|------------|
| Doména neotvára (timeout, „No Deployment“) | [DOMAIN_VERCEL.md](DOMAIN_VERCEL.md): doména vo Vercel, DNS, production deploy; prípadne `npx vercel --prod` alebo push na `main`. |
| Keystatic 401 / Redirect URI mismatch | Vercel env (sekcia 3) + GitHub App (sekcia 4) zhodné; po zmene **Redeploy**. |
| Build zlyhá | `npm run build` lokálne; env premenné vo Vercel; Node 20.x. |
| Obsah sa neukladá v Keystatic | V [keystatic.config.ts](../keystatic.config.ts) musí byť `repo: 'youh4ck3dme/chiropraxia-kosice-keystatic'`; KEYSTATIC_* env vo Vercel. |
