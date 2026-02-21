# 🏥 Chiropraxia Košice - Portfolio & Booking System v2.0

![Astro](https://img.shields.io/badge/Astro-4.x-FF5D01?style=for-the-badge&logo=astro)
![React](https://img.shields.io/badge/React-18-20232a?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-DB-3BC989?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

Moderná webová aplikácia pre chiropraktickú ambulanciu, zameraná na rýchlosť, SEO a prémiový užívateľský zážitok. Obsahuje automatizovaný rezervačný systém, SMS/Email notifikácie a "Baby Blue" estetiku.

## ✨ Kľúčové Vlastnosti

### 🎨 Frontend & Design
- **Baby Blue & Black Theme:** Moderný dark mode s dominantnou čiernou a akcentovou "baby blue" (#89CFF0).
- **Glassmorphism:** Jemné priehľadné prvky a rozostrené pozadia pre hĺbku vizuálu.
- **3D Efekty:** Statické 3D transformácie na nadpisoch a kartách pre moderný "tech" feel.
- **Plne Responzívny:** Optimalizované pre mobily (väčšie písmo, touch-friendly prvky).

### 📅 Rezervačný Systém
- **Booking Widget:** Interaktívny kalendár s reálnou dostupnosťou (viazaný na Supabase).
- **Notifikácie:** Automatické e-maily (cez Resend) a SMS (pripravené pre Twilio) pri potvrdení rezervácie.
- **Služby:** Dynamický výber služieb (Chiropraktická masáž, Korekcia, atď.) s cenami a trvaním.
- **Anti-Spam:** Rate limiting a honeypot ochrana formulárov.

### ⚙️ Backend & Admin
- **Supabase:** PostgreSQL databáza pre rezervácie, služby a terapeutov.
- **Admin Dashboard:** (/admin) Prehľad rezervácií, správa "Open/Closed" stavu kliniky, SMS nastavenia.
- **API Endpoints:** `api/book`, `api/cancel-booking` pre bezpečné operácie.

## 🛠 Tech Stack

- **Framework:** Astro 4.16
- **UI Library:** React 18 (pre interaktívne komponenty)
- **Styling:** Tailwind CSS + vlastné CSS pre animácie.
- **Databáza:** Supabase (PostgreSQL + RLS)
- **Komunikácia:** Resend (Email API), Twilio (SMS API - voliteľné)
- **Deployment:** Vercel (Serverless Functions)

## 🚀 Inštalácia a Spustenie

### 1. Príprava Prostredia

Naklonujte repozitár a nainštalujte závislosti:

```bash
git clone https://github.com/youh4ck3dme/chiropraxia-kosice.git
cd chiropraxia-kosice
npm install
```

### 2. Nastavenie Premenných (.env)

Vytvorte súbor `.env` v koreňovom adresári a doplňte kľúče (viď `.env.example` pre vzor):

```env
PUBLIC_SUPABASE_URL=vasa_supabase_url
PUBLIC_SUPABASE_ANON_KEY=vas_supabase_key
RESEND_API_KEY=re_123...
SITE_URL=http://localhost:4321
```

### 3. Spustenie Lokálne

Pre spustenie vývojového servera:

```bash
npm run dev
```
Web beží na `http://localhost:4321`.

### 4. Build pre Produkciu

Pre vytvorenie optimalizovanej produkčnej verzie:

```bash
npm run build
```

### 5. E2E testy (Playwright)

Pri prvom použití nainštalujte prehliadače, potom spustite testy:

```bash
npx playwright install
npm run test:e2e
```

Dev server sa spustí automaticky (port 4322), alebo môžete pred spustením testov spustiť `npm run dev`. Pre UI režim: `npm run test:e2e:ui`.

### 6. Deploy na Vercel

Prepojenie projektu s Vercel (ak ešte nie je):

```bash
npm run vercel:link
```

Nasadenie na produkciu:

```bash
npm run deploy
```

Alternatíva: push na vetvu `main` a nechať Vercel nasadiť z Git.

## 🗄 Databáza (SQL Setup)

Pre správne fungovanie rezervačného systému je potrebné v Supabase spustiť inicializačné skripty (nájdete v dokumentácii alebo vygenerovanom `new_services.sql`).

**Tabuľky:**
- `bookings`: Rezervácie pacientov.
- `services`: Zoznam procedúr (názov, cena, trvanie).
- `staff`: Zoznam terapeutov.
- `settings`: Globálne nastavenia aplikácie.

## 🧪 Testovanie

- **End-to-End:** Projekt obsahuje základné testy pre flow rezervácie (API level).
- **Linter:** `npm run lint` pre kontrolu kódu.

---
© 2025 Chiropraxia Košice. Vytvorené s ❤️ a ☕.
