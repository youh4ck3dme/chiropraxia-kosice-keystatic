# 🚨 Zoznam Nedokončených Úloh a Problémov

> **Posledná aktualizácia:** 29.12.2025 06:42

---

## 1. KRITICKÉ - Vyžaduje Manuálnu Akciu

### 1.1 Supabase Authentication

| Problém                                     | Riešenie                                                                                                            | Stav          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------- |
| Magic link presmerováva na `localhost:3000` | Zmeniť **Site URL** v Supabase Dashboard → Authentication → URL Configuration na `https://www.chiropraxiakosice.eu` | ❌ NEOPRAVENÉ |
| Redirect URLs sú zlé                        | Pridať `https://www.chiropraxiakosice.eu/**` do Redirect URLs                                                       | ❌ NEOPRAVENÉ |

**Postup:**

1. [Supabase Dashboard](https://app.supabase.io) → Váš projekt
2. Authentication → URL Configuration
3. Site URL: `https://www.chiropraxiakosice.eu`
4. Redirect URLs: `https://www.chiropraxiakosice.eu/**`

---

### 1.2 AI Chatbot (Google Gemini)

| Problém                     | Riešenie                                                              | Stav          |
| --------------------------- | --------------------------------------------------------------------- | ------------- |
| Chýba API kľúč na produkcii | Pridať `GOOGLE_GENERATIVE_AI_API_KEY` do Vercel Environment Variables | ❌ NEOPRAVENÉ |

**Postup:**

1. [Vercel Dashboard](https://vercel.com/dashboard) → Projekt → Settings → Environment Variables
2. Name: `GOOGLE_GENERATIVE_AI_API_KEY`
3. Value: Váš kľúč z [Google AI Studio](https://aistudio.google.com/apikey)
4. Environment: ✅ Production, ✅ Preview, ✅ Development
5. Save → Redeploy

---

### 1.3 Admin Používateľ

| Problém                                | Riešenie                                 | Stav                   |
| -------------------------------------- | ---------------------------------------- | ---------------------- |
| Neexistuje admin používateľ v Supabase | Vytvoriť manuálne cez Supabase Dashboard | ⏳ ČAKÁ NA POUŽÍVATEĽA |

**Postup:**

1. Supabase Dashboard → Authentication → Users → Add user
2. Email: `admin@chiropraxiakosice.eu`
3. Password: (vaše heslo)
4. ✅ Auto Confirm User
5. Create user

---

## 2. STREDNÁ PRIORITA - Netestované / Nedokončené

### 2.1 Keystatic CMS

| Položka                      | Stav            | Poznámka                                    |
| ---------------------------- | --------------- | ------------------------------------------- |
| Editor na `/keystatic`       | ⚠️ NEOTESTOVANÉ | Malo by fungovať cez automatickú integráciu |
| GitHub storage pre produkciu | ⚠️ NEOTESTOVANÉ | Vyžaduje GitHub App alebo PAT               |
| Vytvorenie článku            | ⚠️ NEOTESTOVANÉ | Potrebné overiť manuálne                    |

### 2.2 E2E Testy

| Test                    | Stav         | Poznámka                                   |
| ----------------------- | ------------ | ------------------------------------------ |
| `e2e/keystatic.spec.ts` | ❌ NEFUNKČNÉ | Testy zlyhávajú kvôli nesprávnym locatorom |
| `e2e/admin.spec.ts`     | ✅ FUNKČNÉ   | 6/6 testov prešlo                          |
| `e2e/booking.spec.ts`   | ✅ FUNKČNÉ   | Verified                                   |

### 2.3 Email Notifikácie

| Položka                       | Stav                      | Poznámka          |
| ----------------------------- | ------------------------- | ----------------- |
| Odosielanie emailov           | ⚠️ NEOVERENÉ NA PRODUKCII | Lokálne funguje   |
| Dual-email (klient + klinika) | ⚠️ NEOVERENÉ NA PRODUKCII | Kód je pripravený |

---

## 3. NÍZKA PRIORITA - Varovania

### 3.1 Build Warnings

| Warning                      | Poznámka                                |
| ---------------------------- | --------------------------------------- |
| `keystatic-page.js` je 2.6MB | Keystatic je veľký, normal              |
| Node.js 22 vs 18             | Vercel používa Node 18, lokálne 22 - OK |
| `sharp` platform mismatch    | Nefatálne, funguje správne              |

### 3.2 PageSpeed

| Metrika | Stav                   | Poznámka                     |
| ------- | ---------------------- | ---------------------------- |
| LCP     | ⚠️ POTREBUJE ZLEPŠENIE | Google Maps iframe blokuje   |
| Fonty   | ✅ OPRAVENÉ            | Async loading implementovaný |

---

## 4. Environment Variables - Kontrolný Zoznam

### Vercel (POTREBNÉ NASTAVIŤ)

```
GOOGLE_GENERATIVE_AI_API_KEY=<váš-kľúč>  ❌ CHÝBA
```

### Vercel (UŽ NASTAVENÉ - overiť)

```
PUBLIC_SUPABASE_URL=https://ftmdpkibpxvdjxgkzkqk.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SMTP_HOST=smtp.forpsi.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<email>
SMTP_PASSWORD=<heslo>
SMTP_FROM=<email>
SMTP_CLINIC_EMAIL=info@chiropraxiakosice.eu
```

---

## 5. Súhrn Akcií

| #   | Akcia                       | Kde                | Čas   |
| --- | --------------------------- | ------------------ | ----- |
| 1   | Nastaviť Supabase Site URL  | Supabase Dashboard | 1 min |
| 2   | Pridať Redirect URLs        | Supabase Dashboard | 1 min |
| 3   | Pridať Google AI API Key    | Vercel Dashboard   | 2 min |
| 4   | Vytvoriť admin používateľa  | Supabase Dashboard | 1 min |
| 5   | Redeploy na Vercel          | Vercel Dashboard   | 1 min |
| 6   | Otestovať Keystatic         | Browser            | 5 min |
| 7   | Otestovať email notifikácie | Browser + Email    | 5 min |

---

## 6. Funkčné Linky (Po Opravách)

- 🏠 **Hlavná stránka:** https://www.chiropraxiakosice.eu
- 📅 **Rezervácia:** https://www.chiropraxiakosice.eu/rezervacia
- 🔐 **Admin:** https://www.chiropraxiakosice.eu/admin
- 📝 **Keystatic:** https://www.chiropraxiakosice.eu/keystatic
- 📰 **Blog:** https://www.chiropraxiakosice.eu/blog
