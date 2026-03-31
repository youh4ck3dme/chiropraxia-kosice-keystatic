# Plán pre Rýchlu Diagnostiku

## Schválené kroky (komunikácia po slovensky)

1. [x] **Krok 1**: Editovať `scripts/diagnose.js` – pridať `--quick` mód (default, skip build/Astro info), ďalšie kontroly (port 4322, Playwright/Vitest, Vercel link, Supabase health non-blocking), farebný výstup, súhrnná tabuľka, exit kódy 0/1/2.

2. [x] **Krok 2**: Editovať `package.json` – pridať npm skripty: `diagnose`, `diagnose:quick`, `diagnose:full`.

3. [x] **Krok 3**: Aktualizovať `check.ps1` a `dev.ps1` – zavolať `npm run diagnose:quick` na začiatku pre status.

4. [x] **Krok 4**: Pridať sekciu „Rýchla diagnostika“ do `docs/LOKALNY-VYVOJ.md` a `docs/README.md`.

5. [x] **Krok 5**: Otestovať `npm run diagnose:quick` cez `execute_command`.

6. [x] **Krok 6**: Spustiť `npm run build` na overenie.

7. [x] **Krok 7**: Označiť TODO ako dokončené a `attempt_completion`.

**Status**: Všetky kroky boli implementované. Skript bol vylepšený, integrovaný a dokumentovaný.
