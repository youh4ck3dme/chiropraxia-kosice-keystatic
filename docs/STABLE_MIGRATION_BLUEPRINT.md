# Stable Migration Blueprint (chiropraxia-kosice + chiropraxia-kosice-keystatic)

Tento dokument je praktický **A→Z plán**, ako z dvoch repozitárov spraviť **jeden stabilný hlavný projekt**:

- Keystatic zostáva aktívny (správa obsahu cez GitHub)
- Blog obsahuje najnovšie články
- **bez Supabase**
- booking je jednoduchý formulár, ktorý pošle email na **booking@fyzioafit.sk**

---

## 1) Diagnostika aktuálneho stavu (čo je už v tomto repo dobre)

V repozitári `chiropraxia-kosice-keystatic` už sú kľúčové časti cieľového stavu:

1. **Keystatic je integrovaný** (`keystatic.config.ts`, `astro.config.mjs`).
2. **Booking endpoint** (`src/pages/api/book.ts`) posiela notifikáciu emailom cez `sendBookingNotificationEmail(...)`.
3. **Cieľový booking email** je už nastavený fallbackom na `booking@fyzioafit.sk` (`src/lib/notifications.server.ts`).
4. Frontend booking widget používa `src/lib/supabase.ts`, ale tento modul je v tomto stave **statický/in-memory** (bez DB pripojenia).
5. Blog je obsahovo v `src/content/blog/*.mdx` a je pripravený na správu cez Keystatic.

Záver: ako základ hlavného repozitára je vhodné použiť práve **`chiropraxia-kosice-keystatic`**.

---

## 2) Cieľová architektúra (jeden hlavný repo)

### Hlavný repo (ponechať)
- `youh4ck3dme/chiropraxia-kosice-keystatic` → premenovať v GitHub UI podľa potreby na finálny názov.

### Zrušiť závislosť na druhom repo
- `youh4ck3dme/chiropraxia-kosice` ponechať iba dočasne ako zdroj na porovnanie a export obsahu.
- Po migrácii uzamknúť/archivovať, aby sa už nepoužíval na deploy.

### Produkčný princíp
- **Vercel deploy len z jedného repozitára** (hlavný).
- Doména aj env len na tomto projekte.
- Keystatic zapisuje obsah do tohto repozitára (GitHub storage).

---

## 3) Migračný plán krok po kroku

## Fáza A — Freeze a inventúra

1. Zastaviť nové zmeny v oboch repách (feature freeze).
2. Z oboch repozitárov exportovať:
   - zoznam blog článkov (slug + publishDate),
   - assets (`public/images/blog`, prípadne ďalšie obsahové obrázky),
   - obsah stránok/služieb, ktoré musia zostať.
3. Určiť **source of truth**:
   - kód: `chiropraxia-kosice-keystatic`
   - obsah: novšie položky z oboch rep

## Fáza B — Blog merge (najnovšie články)

1. V hlavnom repo skontrolovať `src/content/blog/`.
2. Z druhého repa preniesť chýbajúce/novšie `.mdx` články.
3. Pri konflikte slugov:
   - zachovať novšiu verziu podľa `publishDate`,
   - ak sú oba dôležité, vytvoriť nový slug.
4. Preniesť chýbajúce obrázky do `public/images/blog/`.
5. Spustiť build a preklikať `/blog` + detail stránok.

## Fáza C — Definitívne odstránenie Supabase

1. Vymazať alebo archivovať interné Supabase dokumenty (ak už nie sú potrebné).
2. Vyčistiť env:
   - odstrániť `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, service role tokeny.
3. Potvrdiť, že booking flow ide cez:
   - frontend formulár → `POST /api/book`
   - server endpoint → `sendBookingNotificationEmail`
   - email na `booking@fyzioafit.sk`
4. Otestovať anti-spam (honeypot + rate-limit), aby sa nestratila ochrana po migrácii.

## Fáza D — Stabilizácia booking flow bez DB

1. Zachovať jednoduchý flow:
   - výber služby/termínu (staticky),
   - vyplnenie údajov,
   - odoslanie email notifikácie.
2. Overiť fallback pri chýbajúcom `RESEND_API_KEY` (lokál môže bežať bez pádu).
3. Manuálne testy:
   - valid payload → 200,
   - invalid payload → 400,
   - honeypot payload → 200 (bez akcie).

## Fáza E — Vercel konsolidácia

1. Vo Verceli nechať iba jeden aktívny projekt pre produkčnú doménu.
2. Doménu odpojiť zo starého projektu a pripojiť na nový hlavný projekt.
3. Nastaviť env:
   - `RESEND_API_KEY`
   - `BOOKING_EMAIL=booking@fyzioafit.sk`
   - Keystatic env (`KEYSTATIC_*`, `SITE_URL`)
4. Urobiť clean redeploy a smoke test:
   - `/`
   - `/blog`
   - `/keystatic`
   - booking flow

## Fáza F — Repo cleanup

1. Aktualizovať README + docs, že Supabase sa nepoužíva.
2. Označiť starý repozitár ako archived/deprecated.
3. V tíme dohodnúť pravidlo: deploy iba z hlavného repa.

---

## 4) Definitívne Acceptance Criteria

Projekt je „stable“, ak platí:

- [ ] Existuje len **jeden aktívny hlavný repozitár** pre produkciu.
- [ ] Keystatic funguje na `/keystatic` a commituje obsah do hlavného repa.
- [ ] Blog obsahuje najnovšie články z oboch pôvodných repozitárov.
- [ ] V projekte nie je runtime závislosť na Supabase.
- [ ] Booking formulár odošle notifikáciu na `booking@fyzioafit.sk`.
- [ ] Build, lint a testy prejdú na hlavnom repo.

---

## 5) Bezpečný rollout (odporúčané poradie)

1. Merge blog obsahu
2. Deploy na preview
3. Booking test s reálnym emailom
4. Doména switch na hlavný projekt
5. Monitorovať 24–48 hodín (booking, 404, Keystatic auth)
6. Až potom archivovať druhý repo
