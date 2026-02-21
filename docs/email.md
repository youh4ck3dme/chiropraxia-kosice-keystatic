# Email – odosielanie a konfigurácia

> **Bezpečnosť:** Heslá a prihlasovacie údaje sa neukladajú v repozitári. Nastavte ich v **Environment Variables** (Vercel) alebo v **`.env`** (lokálne). Pozri **`.env.example`** v root projektu.

---

## Odosielanie emailov (Resend)

Projekt primárne používa **Resend** pre notifikácie a potvrdzovacie emaily.

- **`RESEND_API_KEY`** – API kľúč z [Resend](https://resend.com) dashboard.
- **`RESEND_FROM_EMAIL`** – Overená odosielateľská adresa (napr. `info@vasa-domena.sk`).

Dokumentácia: [Resend – sending email](https://resend.com/docs/send-with-nextjs).

---

## SMTP (voliteľné / záložné)

Ak niekde používate SMTP (fallback alebo starší kód), nastavte premenné podľa vášho poskytovateľa. **Do dokumentácie ani do repo neuvádzajte skutočné heslá.**

Príklad názvov premenných (hodnoty z vášho SMTP účtu):

- `SMTP_HOST` – napr. `smtp.example.com`
- `SMTP_PORT` – napr. `465` (SSL) alebo `587` (TLS)
- `SMTP_SECURE` – `true` pre port 465
- `SMTP_USER` – prihlasovacie meno (email)
- `SMTP_PASSWORD` – heslo (iba v `.env` alebo Vercel, nikdy v repo)

Konkrétne hodnoty (host, port) závisia od poskytovateľa (WebSupport, Gmail, atď.).
