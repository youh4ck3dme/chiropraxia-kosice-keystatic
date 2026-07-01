# Lokálny vývoj

Aktuálny postup pre rozbehanie projektu k dnešnému stavu.

---

## 1) Inštalácia a .env

V root priečinku projektu:

```bash
npm install
cp .env.example .env
node scripts/setup-dev.js
```

Poznámka:
- `.env` je v `.gitignore` a necommituje sa.
- `setup-dev.js` doplní chýbajúce základné hodnoty (napr. `JWT_SECRET`, `SITE_URL`, placeholder pre `RESEND_API_KEY`, `KEYSTATIC_SECRET` pri GitHub storage).

---

## 2) Lokálne spustenie

```bash
npm run dev
```

Dev server beží na `http://localhost:4322`.

---

## 3) Kontrolné príkazy

```bash
npm run lint
npm test
npm run build
```

- `lint` = `astro check`
- `test` = Vitest
- `build` = check + produkčný Astro build

---

## 4) Diagnostika

Rýchla kontrola prostredia:

```bash
npm run diagnose
```

Detailná kontrola (vrátane buildu):

```bash
npm run diagnose:full
```

Report sa uloží do `.diagnose/report.json`.

---

## 5) Windows poznámka

PowerShell ekvivalent:

```powershell
copy .env.example .env
node scripts/setup-dev.js
npm run dev
```

---

## 6) Najčastejšie problémy

- **Chýba `.env`** → vytvoriť z `.env.example`, potom spustiť `node scripts/setup-dev.js`.
- **Port 4322 obsadený** → ukončiť iný proces alebo upraviť port konfiguráciu.
- **Build/check padá na env premenných** → skontrolovať povinné položky podľa `.env.example` a `src/lib/env.server.ts`.

---

## 7) Produkcia

Produkčné ENV a deploy kroky:
- [PRODUCTION_DEPLOY_CHECKLIST.md](PRODUCTION_DEPLOY_CHECKLIST.md)
- [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md)
