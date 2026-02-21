# 🚀 MAX Level Project Analysis & Upgrade Plan

## 1. 🛠️ TECHNICKÉ JADRO (Stack)

- **Framework/Library**: Astro 4.12.2 (Hybrid Mode)
- **Integrations**: React, Tailwind, MDX, Vercel Serverless
- **Jazyk**: TypeScript 5.x (Strict Mode)
- **Build Tool**: Vite (via Astro)
- **CMS / Data Source**:
  - **Local**: Keystatic (MDX content for Blog/Services)
  - **Remote**: Supabase (PostgreSQL for Bookings, Staff, Settings)
- **State Management**: Nano Stores (`@nanostores/react`)
- **AI Engine**: Vercel AI SDK + Google Gemini (`@ai-sdk/google`)
- **Key Dependencies**:
  - `framer-motion` (Animácie)
  - `zod` (Validácia)
  - `resend` (E-maily)
  - `@sentry/astro` (Monitoring)

## 2. 🎨 DIZAJN & UI SYSTÉM

- **CSS Framework**: Tailwind CSS 3.4.0
- **Konfigurácia**:
  - **Design System**: "Liquid Chrome & Aurora" (Custom Theme)
  - **Farby**: `void-black`, `chrome-white`, `aurora-teal`, `aurora-cyan`
  - **Fonty**: Inter (Body), Outfit (Display)
- **Ikony**: Inline SVG / Lucide (implied)
- **Animácie**:
  - `tailwindcss-animate`
  - `framer-motion`
  - Custom CSS keyframes (`aurora-float`, `tilt-in`)
- **Dark Mode**: Zapnutý (`darkMode: 'class'`), optimalizované pre OLED.

## 3. 📂 ŠTRUKTÚRA A CESTY

- **Structure**:
  - `src/components`: React (Admin/Booking) & Astro (UI) components
  - `src/content`: Content Collections (Blog config)
  - `src/lib`: Shared logic (Supabase, AI, Email)
  - `src/pages`: File-based routing (Admin, API, Blog slugs)
- **Routing**: Astro File-based Routing + React Client-side routing (in Admin)

---

## 🚀 MAX LEVEL Recommendations

### ⚡️ 1. Výkon (Performance)

- **Image Optimization**: Nasadiť `<Image />` komponent z Astro pre všetky statické assety (automatická konverzia na WebP/AVIF).
- **Font Optimization**: Použiť `@fontsource` pre lokálny hosting fontov (eliminuje Google Fonts layout shift).
- **Partytown**: Presunúť analytiku a ťažké skripty do Web Workerov pomocou `@astrojs/partytown`.

### 🔍 2. SEO & Metadáta

- **Dynamic OG Images**: Generovať Open Graph obrázky dynamicky (pomocou `@vercel/og` alebo `satori`) pre každý blog post.
- **Structured Data (JSON-LD)**: Pridať Schema.org markup pre `MedicalClinic` na homepage a `Article` pre blogy.
- **Canonical URLs**: Uistiť sa, že každá stránka má správny kanonický odkaz (dôležité pri query parametroch).

### 🧹 3. Čistota Kódu (Code Quality)

- **Strict Linting**: Pridať `eslint` s konfiguráciou pre Astro a React (+ `prettier-plugin-astro`).
- **Barrel Exports**: Zjednodušiť importy vytvorením `index.ts` v priečinkoch komponentov.
- **Type Safety**: Generovať TypeScript definície priamo zo Supabase DB (`supabase gen types`).

### 💎 4. UX & "Luxury" Feel

- **Page Transitions**: Implementovať "View Transitions API" (Astro natívna podpora) pre plynulé prechody medzi stránkami bez prebliknutia.
- **Skeleton Loading**: Nahradiť všetky točiace sa kruhy (spinners) za "shimmer" skeletony, ktoré kopírujú tvar obsahu.
- **Micro-interactions**: Pridať zvukovú odozvu (voliteľné) alebo haptickú odozvu na mobiloch pri úspešnej rezervácii.
- **Offline Support**: Vyladiť PWA manifest a Service Worker pre plnú offline funkcionalitu (čítanie blogov bez netu).

### 🛡️ 5. Bezpečnosť

- **Rate Limiting**: Pridať Upstash/Redis rate limiting na API routes (`/api/chat`, `/api/booking`) proti spamu.
- **CSP Headers**: Nastaviť Content Security Policy pre prevenciu XSS.
