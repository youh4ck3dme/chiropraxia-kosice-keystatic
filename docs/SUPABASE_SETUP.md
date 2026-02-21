# Supabase Setup Guide

Tento súbor obsahuje inštrukcie na nastavenie vašej databázy v službe [Supabase](https://supabase.com).

## 1. Vytvorenie Projektu
1.  Prihláste sa do Supabase a vytvorte nový projekt ("New Project").
2.  Vyberte organizáciu, názov (napr. `ChiropraxiaKosice`) a región (najlepšie `Frankfurt` alebo blízky).
3.  Nastavte silné heslo pre databázu.

## 2. Aplikovanie Schémy
1.  V ľavom menu prejdite do **SQL Editor**.
2.  Vytvorte nový "New Query".
3.  Skopírujte **celý obsah súboru** `supabase/supabase-schema.sql` (v tomto projekte).
4.  Vložte ho do editora a kliknite na tlačidlo **RUN**.

Týmto sa vytvoria:
*   Tabuľky: `staff`, `services`, `availability`, `bookings`.
*   Funkcie: `get_available_slots`, `create_booking`.
*   Zabezpečenie: RLS Policies (aby nikto nevidel cudzie dáta).
*   Seed Data: Vzoroví lekári a služby.

## 3. Získanie API Kľúčov
1.  V ľavom menu chodťe do **Settings** (ozubené koliesko) -> **API**.
2.  Skopírujte:
    *   **Project URL**
    *   **anon public** key
3.  Tieto hodnoty vložte do sekcie Environment Variables vo Vercel alebo do `.env` súboru pre lokálny vývoj.

## 4. Administrácia
Dáta môžete spravovať priamo v Supabase v sekcii **Table Editor**. Môžete tu pridávať nových zamestnancov, meniť ceny služieb alebo mazať rezervácie.
