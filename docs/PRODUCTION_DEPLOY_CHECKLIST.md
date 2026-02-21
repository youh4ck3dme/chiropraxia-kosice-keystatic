<!-- cspell:disable -->

# Production Deploy Checklist

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

- [ ] Cesta `/keystatic` dostupná
- [ ] GitHub auth flow funkčný (ak používaš GitHub storage)
- [ ] Kolekcie `digital-cards` a `testimonials` majú aspoň 1 záznam
- [ ] `KEYSTATIC_GITHUB_CLIENT_ID` vyplnené
- [ ] `KEYSTATIC_GITHUB_CLIENT_SECRET` vyplnené
- [ ] `KEYSTATIC_SECRET` (min. 32 znakov)
- [ ] Callback URL (prod): `https://chiropraxiakosice.eu/api/keystatic/github/oauth/callback`
- [ ] Callback URL (local): `http://localhost:4322/api/keystatic/github/oauth/callback`

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
