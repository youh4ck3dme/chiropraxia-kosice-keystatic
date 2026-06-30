# Keystatic na Vercel – posledný audit (100 % funkčnosť)

Pre **kompletný A–Z checklist** premenných (čo má byť na Vercel Production a ako overiť) pozri [VERCEL_PRODUCTION_ENV_CHECKLIST.md](VERCEL_PRODUCTION_ENV_CHECKLIST.md).

Tento dokument je **presný checklist**: čo naklikať vo Vercel a čo skontrolovať na GitHube, aby Keystatic na **chiropraxiakosice.eu** fungoval na 100 %. Minimálne zmeny v kóde aj na GitHube – všetko je už nastavené podľa GitHub App „Keystatic Chiropraxia Kosice“.

---

## Vercel účet / tím (pre AI a vývojárov)

- **Používať:** Vercel tím/účet **h4ck3d** – funkčný; tu sa má projekt linkovať a nasadzovať.
- **Ignorovať:** **h4ck3d-labs-projects** – nepoužívaný (môže byť pozastavený). Pri `vercel link` alebo v dashboarde vyberte tím **h4ck3d**, nie h4ck3d-labs-projects.

---

## 1. GitHub App (už máte – len overiť)

V **GitHub** → **Settings** → **Developer settings** → **GitHub Apps** → **Keystatic Chiropraxia Kosice**:

| Pole             | Požadovaná hodnota                                                 |
| ---------------- | ------------------------------------------------------------------ |
| **Homepage URL** | `https://chiropraxiakosice.eu`                                     |
| **Callback URL** | `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback` |

- **Client ID** je na stránke zobrazený (napr. `Iv23liFiHhzVSsZPdHpT`) – skopírujte ho do Vercel.
- **Client secret** – ak ho nemáte uložený, vygenerujte nový (Client secrets → Generate new) a **ihneď** ho skopírujte do Vercel (zobrazí sa len raz).

Žiadne ďalšie zmeny na GitHube nie sú potrebné.

---

## 2. Vercel – Environment Variables (čo naklikať)

Vo **Vercel** → váš projekt → **Settings** → **Environment Variables** nastavte pre **Production** (a prípadne Preview) tieto premenné:

| Názov premenné                     | Hodnota                            | Poznámka                                                                                     |
| ---------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `SITE_URL`                         | `https://chiropraxiakosice.eu`     | Presne takto, bez lomítka na konci.                                                          |
| `KEYSTATIC_STORAGE`                | `github`                           |                                                                                              |
| `KEYSTATIC_GITHUB_CLIENT_ID`       | _(Client ID z GitHub App)_         | Napr. `Iv23liFiHhzVSsZPdHpT`.                                                                |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`   | _(Client secret z GitHub App)_     | Tajná hodnota – nikdy necommitujte.                                                          |
| `KEYSTATIC_SECRET`                 | _(náhodný reťazec min. 32 znakov)_ | Môžete použiť ten istý ako v lokálnom `.env`, alebo vygenerovať nový.                        |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | `keystatic-chiropraxia-kosice`     | Voliteľné – v kóde je rovnaký fallback; nastavením sa pre istotu zhoduje s vašou GitHub App. |

**Povinné pre build a beh stránky (ak ešte nie sú):**

- `RESEND_API_KEY` – kľúč z Resend (odosielanie emailov).
- `JWT_SECRET` – min. 16 znakov (odporúčané 32+).

**Voliteľné (ak nechcete `/keystatic` v produkcii):**

- `SKIP_KEYSTATIC=true` – vypne CMS UI; obsah sa stále načítava z repozitára pri builde.

Po uložení premenných spustite **Redeploy** (Deployments → … → Redeploy), aby sa nové env načítali.

---

## 3. Overenie po deployi

1. Otvorte **https://chiropraxiakosice.eu**
2. Otvorte **https://chiropraxiakosice.eu/keystatic**
3. Kliknite na prihlásenie cez GitHub – mal by prebehnúť OAuth flow a po autorizácii sa zobraziť Keystatic s kolekciami (blog, digitálne vizitky, recenzie, nastavenia).

Ak niečo zlyhá:

- **Redirect URI mismatch** – skontrolujte v GitHub App, že **Callback URL** je presne `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback` (bez lomítka na konci).
- **401 / neprihlásenie** – skontrolujte vo Vercel, či sú `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` a `KEYSTATIC_SECRET` nastavené a či ste spravili Redeploy.

---

## 4. Zhrnutie (min. zmeny)

- **Kód:** Fallback `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` je `keystatic-chiropraxia-kosice` (zodpovedá vašej GitHub App). Žiadne ďalšie zmeny v kóde.
- **GitHub:** Len overiť Homepage URL a Callback URL; Client ID a Client secret skopírovať do Vercel.
- **Vercel:** Vyplniť 6 premenných vyššie (vrátane `SITE_URL`) a Redeploy.

Tým je Keystatic na produkcii nastavený na 100 %.

---

## 5. Nastavenie cez Vercel CLI

Všetky premenné môžete nastaviť **iba cez CLI** (bez otvárania Vercel Dashboard).

**Predpoklady:**

- `npx vercel login` (jednorazovo)
- `npx vercel link` alebo `npm run vercel:link` – pri výbere tímu zvoľte **h4ck3d** (nie h4ck3d-labs-projects)
- Vyplnený `.env` v root projekta (vrátane Keystatic, RESEND, JWT_SECRET)

**Pred pushom do Vercel (dôležité):**

- V `.env` nastavte pre produkciu **SITE_URL=https://chiropraxiakosice.eu** (bez lomítka na konci). Lokálne môžete mať `SITE_URL=http://localhost:4322`; pred spustením `vercel:env-push` ho dočasne zmeňte na produkčnú URL, alebo majte v `.env` už produkčnú hodnotu a lokálne používajte `npm run dev` (Astro načíta .env).

**Zoznam premenných, ktoré skript nahodí (ak sú v .env vyplnené):**

| Premenná                           | Príklad / poznámka                         |
| ---------------------------------- | ------------------------------------------ |
| `SITE_URL`                         | `https://chiropraxiakosice.eu` (produkcia) |
| `RESEND_API_KEY`                   | kľúč z Resend                              |
| `RESEND_FROM_EMAIL`                | napr. `noreply@chiropraxiakosice.eu`       |
| `JWT_SECRET`                       | min. 16 znakov, odporúčané 32+             |
| `KEYSTATIC_STORAGE`                | `github`                                   |
| `KEYSTATIC_GITHUB_CLIENT_ID`       | z GitHub App (napr. Iv23liFiHhzVSsZPdHpT)  |
| `KEYSTATIC_GITHUB_CLIENT_SECRET`   | z GitHub App (tajné)                       |
| `KEYSTATIC_SECRET`                 | min. 32 znakov                             |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | `keystatic-chiropraxia-kosice`             |
| `GOOGLE_GENERATIVE_AI_API_KEY`     | voliteľné (AI chat)                        |
| `SENTRY_AUTH_TOKEN`                | voliteľné                                  |
| `TWILIO_*`                         | voliteľné (SMS)                            |
| `SKIP_KEYSTATIC`                   | voliteľné; `true` = vypnúť CMS UI          |

**Príkaz – nahodenie do všetkých prostredí (Production, Preview, Development):**

```bash
npm run vercel:env-push
```

Skript prečíta `.env`, pre každú premennú so zadanou hodnotou spustí `vercel env add NAME production`, potom `preview`, potom `development` (tajomstvá sa nedostanú do histórie shellu). Premenné prázdne v `.env` sa preskočia. Ak premenná vo Vercel už existuje, CLI môže hlásiť chybu – v tom prípade ju upravte v dashboarde alebo odstráňte `vercel env rm NAME production` (resp. preview/development) a skript spustite znova.

**Alternatíva – len necitlivé premenné cez príkazový riadok (ak nechcete použiť skript):**

```bash
echo "https://chiropraxiakosice.eu" | npx vercel env add SITE_URL production
echo "github" | npx vercel env add KEYSTATIC_STORAGE production
echo "keystatic-chiropraxia-kosice" | npx vercel env add PUBLIC_KEYSTATIC_GITHUB_APP_SLUG production
```

Tajné premenné (`KEYSTATIC_GITHUB_CLIENT_SECRET`, `JWT_SECRET`, `RESEND_API_KEY` atď.) **nastavte cez skript** (majte ich v `.env` a spustite `npm run vercel:env-push`) alebo manuálne: `npx vercel env add NÁZOV production` a pri výzve vložte hodnotu (neukladajte ju do skriptov ani do histórie).

**Poradie pri prvom nasadení:** 1) vyplniť `.env`, 2) `npm run vercel:env-push`, 3) `npm run deploy` alebo `.\scripts\vercel-setup.ps1`.
