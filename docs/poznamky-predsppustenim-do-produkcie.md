# Poznámky pred spustením do produkcie

Tento dokument slúži ako finálna kontrola pred nasadením. Pre kompletný zoznam úloh pozri **[PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md)**. Všetky citlivé údaje sa nastavujú v **Environment Variables** vo Verceli (alebo v lokálnom `.env`); pozri **[.env.example](../.env.example)** v root projektu.

> **Aktuálny stav:** Supabase je v projekte momentálne pozastavený. Rezervácie a admin z databázy nie sú aktívne. Blog je plne statický (Astro content collections). Pri zapnutí Supabase pozri [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

---

## 1. Vercel – Environment Variables

V **Settings → Environment Variables** nastavte premenné podľa `.env.example`:

- **`SITE_URL`** – produkčná URL (napr. `https://chiropraxiakosice.eu`). Lokálne: `http://localhost:4322`.
- **`RESEND_API_KEY`** – kľúč z Resend (odosielanie emailov).
- **`RESEND_FROM_EMAIL`** – odosielateľská adresa (overená v Resend).
- **Supabase** (voliteľné, keď budete databázu zapínať): `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` – pozri [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
- **Twilio / SMS** (voliteľné): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`; pri pozastavenom Supabase zapínate SMS cez `SMS_ENABLED=true`.
- **Keystatic**: `KEYSTATIC_STORAGE`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Voliteľne `SKIP_KEYSTATIC=true` v produkcii (pozri [KEYSTATIC.md](KEYSTATIC.md)).
- **Ostatné**: `JWT_SECRET` (min. 16 znakov), `GOOGLE_GENERATIVE_AI_API_KEY` ak používate AI chat.

Žiadne heslá ani API kľúče neukladajte do repozitára – len do `.env` / Vercel.

---

## 2. Supabase (ak ho neskôr zapnete)

- **Site URL** v Supabase Authentication: nastaviť na vašu produkčnú doménu (napr. `https://chiropraxiakosice.eu`), aby presmerovania (auth callback) fungovali.
- Schéma sa aplikuje cez migrácie v `supabase/migrations/` – pozri [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

---

## 3. DNS (WebSupport / Vercel)

Ak nasadzujete na Vercel a doménu máte inde (napr. WebSupport):

1. Vo Verceli pridajte doménu (napr. `chiropraxiakosice.eu`).
2. Vercel zobrazí **A** alebo **CNAME** záznam.
3. V DNS nastavte tento záznam smerovať na Vercel.
4. **Neměňte MX záznamy** – potrebujete ich pre emailovú schránku (napr. `info@...`).

---

## 4. Bezpečnosť

- `.gitignore` vylučuje `.env` a citlivé súbory – do repozitára sa nedostanú heslá ani kľúče.
- Repozitár môžete mať súkromný (Private); nasadenie beží cez Vercel a env premenné v ich dashboarde.

---

Pre presný zoznam checkboxov a smoke testov po nasadení použite **[PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md)**.
