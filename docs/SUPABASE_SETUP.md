# Supabase Setup Guide

> **Supabase je v tomto projekte momentálne pozastavený.** Rezervácie a admin z databázy nie sú aktívne. Blog je plne statický (Astro content collections).

Tento súbor obsahuje inštrukcie na nastavenie databázy v [Supabase](https://supabase.com), keď ju budete chcieť znova zapnúť.

## 1. Vytvorenie Projektu

1. Prihláste sa do Supabase a vytvorte nový projekt ("New Project").
2. Vyberte organizáciu, názov (napr. `ChiropraxiaKosice`) a región (napr. `Frankfurt`).
3. Nastavte silné heslo pre databázu.

## 2. Aplikovanie Schémy (migrácie)

Schéma sa aplikuje cez **migrácie** v `supabase/migrations/`. Spustite ich v tomto poradí (v SQL Editore ako samostatné query alebo cez `supabase db push`):

| Poradie | Súbor                                                   |
| ------- | ------------------------------------------------------- |
| 1       | `supabase/migrations/20251228210000_init.sql`           |
| 2       | `supabase/migrations/20251228213000_fix_rpc.sql`        |
| 3       | `supabase/migrations/20251228220000_admin_policies.sql` |
| 4       | `supabase/migrations/003_create_settings_table.sql`     |

V Supabase: **SQL Editor** → New Query → skopírujte obsah každého súboru a spustite **RUN**. Alebo v projekte s nainštalovaným Supabase CLI: `supabase db push`.

Tým sa vytvoria tabuľky (`staff`, `services`, `availability`, `bookings`, `settings`), funkcie (`get_available_slots`, `create_booking`) a RLS politiky.

## 3. Získanie API Kľúčov

1. V Supabase: **Settings** (ozubené koliesko) → **API**.
2. Skopírujte **Project URL** a **anon public** kľúč.
3. Uložte ich do premenných prostredia (Vercel) alebo do `.env` – pozri `.env.example`.

## 4. Administrácia

Dáta môžete spravovať v Supabase v **Table Editor**. Po opätovnom zapnutí Supabase v projekte (vrátenie balíka `@supabase/supabase-js`, obnovenie klienta v `src/lib/supabase.ts` a doplnenie env premenných) budú rezervácie a admin opäť aktívne.
