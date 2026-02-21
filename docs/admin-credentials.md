# Admin – prístup a služby

> **Bezpečnosť:** Citlivé údaje (heslá, API kľúče) sa neukladajú v repozitári. Nastavte ich v **Environment Variables** vo Verceli alebo v lokálnom **`.env`** (pozri `.env.example` v root projektu).

---

## Admin panel (`/admin`)

- **Prístup:** Stránka `/admin` vyžaduje prihlásenie (Supabase Auth). Keď je Supabase pozastavený, admin je dočasne nedostupný – pozri [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
- **Účet:** Email a heslo sa nastavujú pri vytvorení používateľa v Supabase Authentication (alebo v lokálnom `.env` pri vývoji). Do dokumentácie neuvádzajte skutočné heslá.

---

## Resend (email)

- **API Key:** Nastaviť v premennej `RESEND_API_KEY` (hodnotu z Resend dashboard).
- **From Email:** Premenná `RESEND_FROM_EMAIL` – overená adresa v Resend.

Používa sa na notifikácie a potvrdzovacie emaily.

---

## Supabase (databáza)

- **Stav:** Supabase je v projekte momentálne pozastavený. Pri opätovnom zapnutí: Project URL a anon kľúč nastavte v `PUBLIC_SUPABASE_URL` a `PUBLIC_SUPABASE_ANON_KEY` (pozri [SUPABASE_SETUP.md](SUPABASE_SETUP.md)).
- **Konzola:** Váš projekt nájdete na [Supabase Dashboard](https://supabase.com/dashboard); tabuľky: bookings, services, staff, availability, settings.
