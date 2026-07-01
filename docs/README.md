# Dokumentácia projektu Chiropraxia Košice

Prehľad dokumentov v `docs/`.

**Jedno miesto pre sync/recovery nastavenia:** [**IDEAL_SETUP_CHECKPOINT.md**](IDEAL_SETUP_CHECKPOINT.md) – GitHub, Vercel, env, doména, lokálne prostredie a rýchle príkazy. Pri poruche alebo novom klone začni tu.

---

## Prvý beh / Lokálne nastavenie

### Automatická príprava

1. **Príprava .env:** Spustite `npm run setup` – skript `scripts/setup-dev.js` vytvorí alebo doplní `.env` z `.env.example` (JWT_SECRET, SITE_URL, RESEND_API_KEY placeholder), aby `astro check` a build nepadali.
2. **Dev server:** Potom `npm run dev` alebo `npm run dev:safe`. Na Windows môžete použiť `.\dev.ps1` (v root projekta).
3. **Kontrola typov:** `npm run check` alebo `npm run check:safe`; na Windows `.\check.ps1`.

Produkčné premenné nastavte vo Verceli: po vyplnení `.env` môžete použiť **env cez CLI** – `npm run vercel:env-push` (pozri [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md)#5-nastavenie-cez-vercel-cli). Ďalej [PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md) a [.env.example](../.env.example) v root.

### Presné príkazy (Windows)

V termináli (PowerShell alebo CMD) z rootu projektu:

```bash
npm run setup
npx astro check
npm run dev
```

Na Windows môžete najprv prejsť do priečinka projektu (napr. `cd C:\cesta\k\chiropraxia-kosice-fix`), potom spustiť príkazy vyššie. Skripty `dev.ps1` a `check.ps1` v root projekta samy prejdú do správneho adresára a spustia setup + dev alebo check.

### Tipy a triky

- **astro check** – Kontroluje typy (TypeScript) a Astro konfiguráciu. Ak padá na chýbajúcich env premenných, spustite `npm run setup` alebo `npm run check:safe`.
- **npm run dev** – Prvý štart môže trvať dlhšie (Vite + content sync). Dev server beží na **porte 4322** (`http://localhost:4322`). Zmeny v `astro.config.mjs` alebo `keystatic.config.ts` vyžadujú reštart (Ctrl+C, potom znova `npm run dev`).
- **Node** – Projekt očakáva Node 20.x (`package.json` → engines). Na Windows môžete použiť nvm-windows alebo oficiálny inštalátor.
- **Keystatic** – GitHub App slug v kóde je `keystatic-chiropraxia-kosice`. V `.env` nastavte `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`; voliteľne `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=keystatic-chiropraxia-kosice`. Produkcia: [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md).
- **Rýchle príkazy:** `npm run build`, `npm run preview` (po builde), `npm run test` / `npm run test:e2e`.

Podrobnejší zoznam premenných a produkčné nastavenie: [PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md) a [.env.example](../.env.example).

Kompletný návod na lokálny vývoj (príkazy, tipy, riešenie problémov): **[LOKALNY-VYVOJ.md](LOKALNY-VYVOJ.md)**.

---

## Nastavenie a konfigurácia

- **[LOKALNY-VYVOJ.md](LOKALNY-VYVOJ.md)** – Lokálny vývoj: automatické nastavenie .env, presné príkazy, tipy a triky, riešenie problémov.
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** – Supabase je momentálne pozastavený; návod na opätovné zapnutie, migrácie, API kľúče.
- **[KEYSTATIC.md](KEYSTATIC.md)** – Keystatic CMS, GitHub App „Keystatic Chiropraxia Kosice“, voliteľné vypnutie v produkcii (`SKIP_KEYSTATIC`).
- **[VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md)** – Presný checklist: čo naklikať vo Vercel (alebo **env cez CLI:** `npm run vercel:env-push` po vyplnení `.env`) a čo skontrolovať na GitHube, aby Keystatic na chiropraxiakosice.eu fungoval na 100 %. **Vercel tím:** používať **h4ck3d** (funkčný); ignorovať h4ck3d-labs-projects (nepoužívaný).
- **[admin-credentials.md](admin-credentials.md)** – Kde nastaviť prístup do adminu a externé služby (všetko cez `.env` / Vercel, žiadne heslá v repo).

---

## Nasadenie a testovanie

- **[PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md)** – Checklist pred nasadením: ENV, build, Keystatic, smoke testy.
- **[poznamky-predsppustenim-do-produkcie.md](poznamky-predsppustenim-do-produkcie.md)** – Poznámky pred spustením do produkcie; odkaz na checklist a `.env.example`.
- **[MANUAL_TESTING_PLAYBOOK.md](MANUAL_TESTING_PLAYBOOK.md)** – Manuálne testovanie.

---

## Vývoj a architektúra

- **[project_status.md](project_status.md)** – Aktuálny stav projektu.
- **[project_walkthrough.md](project_walkthrough.md)** – Prehľad fáz, komponentov a testov.
- **[project-roadmap.md](project-roadmap.md)** – Roadmap.
- **[project-analysis.md](project-analysis.md)** – Analýza projektu (historická; aktuálny stack pozri `package.json`).

---

## Operačné

- **[email.md](email.md)** – Odosielanie emailov (Resend / SMTP).
- **[PROBLEMS.md](PROBLEMS.md)** – Známe problémy a stav riešení.

---

## Kontext pre AI

- **[CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md)** – Konvencie pre AI a vývojárov (Vercel tím h4ck3d vs. h4ck3d-labs-projects, atď.).

---

## Ostatné

- **[STABLE_MIGRATION_BLUEPRINT.md](STABLE_MIGRATION_BLUEPRINT.md)** – Kompletný blueprint na konsolidáciu 2 repozitárov do 1 stabilného Keystatic projektu (najnovšie blogy, bez Supabase, booking email-only na `booking@fyzioafit.sk`).
- **[BLOG.md](BLOG.md)** – Blog je čisto statický (MDX, Astro content collections). Obsahuje špecifikáciu **cover obrázkov** (rozmer, formát, zoznam článok → unikátny súbor) a checklist pred nasadením.
- **[todo.md](todo.md)** – Úlohy a priority.
- **[digitalnavizitka.html](digitalnavizitka.html)** – Šablóna / náhľad digitálnej vizitky (HTML).
