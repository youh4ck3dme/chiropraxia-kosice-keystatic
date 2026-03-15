# Checklist: Vercel Production env pre Keystatic (A–Z)

Overenie „čo má byť na Verceli“ vychádza z [keystatic.config.ts](../keystatic.config.ts), [astro.config.mjs](../astro.config.mjs), [scripts/verify-keystatic-github.js](../scripts/verify-keystatic-github.js) a [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md). **Skutočné hodnoty vo Vercel dashboarde môže overiť len užívateľ** – tento dokument je zoznam toho, čo tam ma byť a ako to skontrolovať.

---

## A. Povinné pre Keystatic (GitHub storage) na produkcii

Tieto premenné musia byť nastavené vo **Vercel → Projekt → Settings → Environment Variables** pre **Production** (a odporúčane aj Preview), inak prihlásenie cez GitHub a ukladanie obsahu nebude fungovať.

| Premenná                           | Očakávaná hodnota / formát                                                            | Kde sa v kóde používa                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `KEYSTATIC_STORAGE`                | Presne `github` (malé písmená)                                                        | keystatic.config.ts L4 – rozhoduje local vs github    |
| `KEYSTATIC_GITHUB_CLIENT_ID`       | Client ID z GitHub App (napr. `Iv23liFiHhzVSsZPdHpT`) – bez medzier na začiatku/konci | astro.config.mjs (trim), OAuth flow                   |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`   | Client secret z GitHub App – tajná hodnota, bez medzier                               | astro.config.mjs, OAuth callback                      |
| `KEYSTATIC_SECRET`                 | Náhodný reťazec **min. 32 znakov** (session/signing)                                  | astro.config.mjs, verify-keystatic-github.js          |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Presne `keystatic-chiropraxia-kosice` (zodpovedá názvu GitHub App)                    | src/components/keystatic/KeystaticApp.tsx (`envName`) |

**Overenie:** Po deployi otvoriť `https://chiropraxiakosice.eu/keystatic` → prihlásenie cez GitHub by malo prebehnúť bez „Redirect URI mismatch“ a bez 401. Ak 401: chýba alebo je zle niektorá z týchto premenných; po zmene treba **Redeploy**.

---

## B. Povinné pre beh stránky a build (nie len Keystatic)

Bez týchto môže build alebo API (kontakt, rezervácie, notifikácie) zlyhávať.

| Premenná         | Očakávaná hodnota / formát                                | Poznámka                                                  |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `SITE_URL`       | `https://chiropraxiakosice.eu` – **bez lomítka na konci** | Používa sa v notifikáciách, OG, Keystatic callback        |
| `JWT_SECRET`     | Min. 16 znakov, odporúčané 32+                            | src/lib/tokens.ts, src/lib/env.server.ts                  |
| `RESEND_API_KEY` | Kľúč z Resend (odosielanie emailov)                       | src/pages/api/contact.ts, src/lib/notifications.server.ts |

---

## C. Voliteľné, ale odporúčané

| Premenná            | Hodnota                                | Účel                                                                           |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| `RESEND_FROM_EMAIL` | Napr. `noreply@chiropraxiakosice.eu`   | Odosielacia adresa pre emaily                                                  |
| `SKIP_KEYSTATIC`    | Ak nechcete CMS UI v produkcii: `true` | astro.config.mjs – vypne `/keystatic`; obsah sa stále načíta z repo pri builde |

---

## D. Voliteľné (ostatné funkcie)

- `GOOGLE_GENERATIVE_AI_API_KEY` – AI chat / suggest-links atď.
- `SENTRY_AUTH_TOKEN` – upload source maps do Sentry
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` – SMS notifikácie

Tieto nie sú potrebné pre samotné fungovanie Keystatic.

---

## E. GitHub App – musí zhodovať s Vercel a doménou

Keystatic používa **GitHub App** (nie len OAuth App). V **GitHub** → **Settings** → **Developer settings** → **GitHub Apps** → **Keystatic Chiropraxia Kosice** skontrolovať:

| Pole             | Požadovaná hodnota                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Homepage URL** | `https://chiropraxiakosice.eu`                                                            |
| **Callback URL** | `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback` (bez lomítka na konci) |

**Client ID** a **Client secret** z tejto aplikácie musia byť tie isté ako `KEYSTATIC_GITHUB_CLIENT_ID` a `KEYSTATIC_GITHUB_CLIENT_SECRET` vo Vercel. Ak zmeníte doménu, treba zmeniť tu aj `SITE_URL` vo Vercel.

---

## F. Ako overiť bez priameho prístupu do Vercel

1. **Lokálna kontrola proti .env (produkčné hodnoty)**  
   Do `.env` dočasne nastaviť produkčné hodnoty (SITE*URL, KEYSTATIC*\*) a spustiť:

   ```bash
   node scripts/verify-keystatic-github.js
   ```

   Skript nekontroluje Vercel, ale overí dĺžky, prítomnosť a odporúčané callback URL. Ak tu všetko prejde, rovnaké hodnoty by mali byť vo Vercel.

2. **Overenie na live webe**
   - Otvoriť `https://chiropraxiakosice.eu/keystatic`.
   - Kliknúť na prihlásenie cez GitHub.
   - Ak sa zobrazí GitHub a po povolení Keystatic s kolekciami = env na Vercel sú v poriadku.
   - Ak „Redirect URI mismatch“ = Callback URL v GitHub App sa nezhoduje s doménou (SITE_URL) alebo s tým, čo Keystatic očakáva.
   - Ak 401 / neprihlásenie = vo Vercel chýba alebo je zle `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` alebo `KEYSTATIC_SECRET`; po úprave **Redeploy**.

3. **Čo skontrolovať priamo vo Vercel (ručne)**  
   Vercel → váš projekt (chiropraxia-kosice-keystatic alebo názov projektu) → **Settings** → **Environment Variables**. Pre **Production** overiť, že existujú všetky premenné z sekcie A a B a že nemajú medzery na začiatku/konci (môže kaziť OAuth). Po akejkoľvek zmene env spustiť **Redeploy** z Deployments.

---

## Zhrnutie (minimálna sada pre Keystatic na produkcii)

- **Na Vercel Production musia byť:**  
  `KEYSTATIC_STORAGE`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, `SITE_URL`, `JWT_SECRET`, `RESEND_API_KEY`.
- **Na GitHube:** Callback URL = `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback`.
- **Po zmene domény:** upraviť `SITE_URL` vo Vercel a Homepage URL + Callback URL v GitHub App; potom Redeploy.

Jednorazová synchronizácia z lokálneho `.env` na Vercel: v `.env` mať produkčné hodnoty a spustiť `npm run vercel:env-push` ([scripts/vercel-env-push.js](../scripts/vercel-env-push.js)); predtým `npx vercel link` (tím **h4ck3d**). Viac detailov v [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md).

---

## Nastavenie produkčných env cez CLI

1. **Verejné premenné (Production + Preview)** – správne hodnoty pre SITE_URL, KEYSTATIC_STORAGE, PUBLIC_KEYSTATIC_GITHUB_APP_SLUG:

   ```bash
   npx vercel link
   node scripts/vercel-env-production-public.js
   ```

   Ak premenná už existuje a chcete ju prepísať: `npx vercel env rm NÁZOV` (pre každé prostredie), potom skript znova.

2. **Tajné premenné** – KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET, JWT_SECRET, RESEND_API_KEY:
   - Buď vyplňte `.env` a spustite `npm run vercel:env-push`, alebo
   - Pre každú: `npx vercel env add NÁZOV production` a pri výzve vložte hodnotu (nie do histórie príkazov).
