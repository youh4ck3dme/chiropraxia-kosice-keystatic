<!-- cspell:disable -->

# Production Deploy Checklist

> **Ak nefunguje doména https://chiropraxiakosice.eu**, pozri [DOMAIN_VERCEL.md](DOMAIN_VERCEL.md) (doména vo Vercel, DNS, SSL, projekt).

> **Poznámka:** Supabase je momentálne pozastavený – rezervácie a admin z DB nie sú aktívne. Položky týkajúce sa Supabase sú voliteľné až do opätovného zapnutia (pozri [SUPABASE_SETUP.md](SUPABASE_SETUP.md)). V produkcii môžete použiť `SKIP_KEYSTATIC=true` a vypnúť CMS UI (pozri [KEYSTATIC.md](KEYSTATIC.md)).

## 1) Runtime a závislosti

- [ ] Node.js `20.x` (odporúčané: `20.20.0`)
- [ ] `npm ci` v čistom prostredí
- [ ] `npm run check` -> bez chýb
- [ ] `npm run build` -> úspešne

## 2) Povinné ENV premenné

- [ ] `PUBLIC_SUPABASE_URL`
- [ ] `PUBLIC_SUPABASE_ANON_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `SITE_URL` (produkčná URL)
- [ ] `GOOGLE_GENERATIVE_AI_API_KEY` (ak je AI chat zapnutý)
- [ ] `JWT_SECRET` (silný, min. 32 znakov)

## 3) Voliteľné, ale odporúčané ENV

- [ ] `SENTRY_AUTH_TOKEN` (upload source máp)
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`

## 4) Databáza (Supabase)

- [ ] Aplikované migrácie zo `supabase/migrations`
- [ ] Overené RLS policies pre rezervácie/admin
- [ ] Seed minimálnych dát: služby, personál, nastavenia

## 5) Keystatic/CMS

- [ ] Cesta `/keystatic` dostupná na https://chiropraxiakosice.eu/keystatic
- [ ] GitHub App „Keystatic Chiropraxia Kosice“ (slug `keystatic-chiropraxia-kosice`) – Callback URL: `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback`
- [ ] Vo Vercel: `SITE_URL`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, voliteľne `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=keystatic-chiropraxia-kosice` – **presný návod:** [VERCEL_KEYSTATIC_AUDIT.md](VERCEL_KEYSTATIC_AUDIT.md)
- [ ] Kolekcie `digital-cards` a `testimonials` majú aspoň 1 záznam

## 6) SEO/obsah

- [ ] `robots.txt` a `manifest.webmanifest` správne
- [ ] OG endpoint `/api/og` vracia obrázok
- [ ] Sitemap je generovaná pri builde

## 7) Post-deploy smoke test

- [ ] Homepage načítaná
- [ ] `/rezervacia` flow po potvrdenie
- [ ] Potvrdzovací email doručený
- [ ] Admin dashboard dostupný
- [ ] AI chat endpoint odpovedá (ak je zapnutý)

## 8) Monitoring

- [ ] Sentry release viditeľný
- [ ] 4xx/5xx alerty nastavené
- [ ] Error budget/incident kontakt definovaný

<!-- cspell:enable -->
