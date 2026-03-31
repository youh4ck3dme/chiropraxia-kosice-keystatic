# Lokálny vývoj a automatické nastavenie

Tento dokument popisuje automatickú prípravu prostredia, príkazy a tipy pre vývoj na projekte Chiropraxia Košice.

---

## Automatická príprava .env

Projekt obsahuje skript **`scripts/setup-dev.js`**, ktorý:

- vytvorí súbor `.env` z `.env.example`, ak neexistuje;
- doplní **JWT_SECRET** (náhodný 32-znakový reťazec), ak chýba alebo je prázdny;
- nastaví **SITE_URL** na `http://localhost:4322`, ak chýba alebo je prázdny;
- nastaví **RESEND_API_KEY** na placeholder `re_placeholder` (pre prechod build/check), ak chýba alebo je prázdny;
- pri **KEYSTATIC_STORAGE=github** doplní **KEYSTATIC_SECRET** (náhodný reťazec min. 32 znakov), ak chýba alebo je kratší.

Spustenie: **`npm run setup`** alebo ako prvý krok pred **`npm run dev:safe`** / **`npm run check:safe`**.

---

## Rýchla diagnostika

Projekt obsahuje nástroj na rýchle overenie stavu prostredia: **`npm run diagnose`**.

- **`npm run diagnose`** (alebo **`diagnose:quick`**): Skontroluje Node/npm verzie, voľnosť portu 4322, existenciu kritických súborov, závislosti, `.env` premenné a dostupnosť nástrojov (Vercel, Playwright, Vitest).
- **`npm run diagnose:full`**: Navyše spustí kompletný **Astro build** a vypíše podrobné informácie o Astro prostredí.

Tento skript sa automaticky spúšťa pred štartom **`.\dev.ps1`** a **`.\check.ps1`**.

Súbor `.env` je v `.gitignore` a necommitne sa do repozitára.

---

## Presné príkazy

Všetky príkazy sa spúšťajú z **rootu projektu** (priečinok, v ktorom je `package.json`).

| Úloha | Príkaz |
|--------|--------|
| Pripraviť .env | `npm run setup` |
| Kontrola typov a konfigurácie | `npx astro check` alebo `npm run check` |
| Bezpečná kontrola (najprv setup) | `npm run check:safe` |
| Dev server | `npm run dev` |
| Dev server so setupom pred štartom | `npm run dev:safe` |
| Build | `npm run build` |
| Náhľad buildu lokálne | `npm run preview` (po `npm run build`) |

### Windows (PowerShell / CMD)

V termináli prejdite do priečinka projektu, napr.:

```powershell
cd C:\cesta\k\chiropraxia-kosice-fix
```

Potom môžete spustiť:

```powershell
npm run setup
npx astro check
npm run dev
```

V root projekta sú tiež skripty **`dev.ps1`** a **`check.ps1`** (PowerShell). Spustenie napr. **`.\dev.ps1`** automaticky prejde do rootu projektu, spustí setup a potom `npm run dev`. Podobne **`.\check.ps1`** spustí setup a `npx astro check`.

---

## Tipy a triky

### astro check

- Kontroluje typy (TypeScript) a Astro konfiguráciu.
- Ak padá na chýbajúcich env premenných, spustite `npm run setup` alebo `npm run check:safe` (najprv doplní .env).
- Po zmene len v `.astro` alebo content kolekciách môžete občas preskočiť check a spustiť len `npm run build`.

### npm run dev

- Prvý štart môže trvať dlhšie (Vite + content sync). Ďalšie reštarty sú rýchlejšie.
- Dev server beží na **porte 4322** – otvorte [http://localhost:4322](http://localhost:4322).
- Ak sa zobrazí **EADDRINUSE**, port 4322 už používa iný proces. Ukončite ho alebo dočasne zmeňte port v `astro.config.mjs` (a v `playwright.config.ts` a `SITE_URL` v `.env`).
- **Hot reload:** zmeny v `.astro`, `.tsx`, `.css` sa premietnu automaticky. Zmeny v `astro.config.mjs` alebo `keystatic.config.ts` vyžadujú reštart (Ctrl+C, potom znova `npm run dev`).

### Čo nastaviť pre pohodlný vývoj

- **Node:** Projekt očakáva Node 20.x (`package.json` → engines). Na Windows môžete použiť nvm-windows alebo oficiálny inštalátor.
- **.env:** Skript `npm run setup` vytvorí a doplní .env. Pre odosielanie emailov potrebujete skutočný `RESEND_API_KEY` (z Resend dashboard); pre lokálny build/check stačí placeholder.
- **Keystatic:** Ak používate GitHub storage, potrebujete **GitHub OAuth App** (vytvára sa len vo web UI na [github.com/settings/developers](https://github.com/settings/developers), nie cez GitHub CLI). Do `.env` nastavte `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` (min. 32 znakov; môže vygenerovať `npm run setup`), voliteľne `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=keystatic-chiropraxia-kosice` (fallback v kóde je rovnaký). Presná **Authorization callback URL** pre lokálny vývoj: `http://localhost:4322/api/keystatic/github/oauth/callback`. Kontrola: **`node scripts/verify-keystatic-github.js`**. Podrobný návod je v [KEYSTATIC.md](KEYSTATIC.md#nastavenie-github-oauth-pre-keystatic).

### Keď niečo nefunguje

- Spustite `npm ci` alebo aspoň `npm install` v root projekta.
- Skontrolujte, či v root projekta existuje `.env` a či obsahuje `SITE_URL=http://localhost:4322`.
- Ak `astro check` alebo build sťažuje na chýbajúce env, pozrite [src/lib/env.server.ts](../src/lib/env.server.ts) – niektoré premenné sú voliteľné (Supabase), iné povinné (RESEND_API_KEY, JWT_SECRET).

---

## Produkcia

Funkčnosť v produkcii závisí od nastavenia **Environment Variables** vo Verceli. Zoznam povinných a voliteľných premenných je v [PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md) a v [.env.example](../.env.example) v root projekta.
