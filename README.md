# 🩺 Chiropraxia Košice – Admin & Content Hub

Vitajte v repozitári projektu **Chiropraxia Košice**. Tento web je postavený na Astro 5 a Keystatic CMS s dôrazom na prémiový "Luxury Glass" dizajn a maximálny výkon.

---

## ✨ Vizuálna Identita (Modern Luxury)

Projekt využíva špecifický dizajnérsky systém, ktorý sme spoločne vyladili:
- **Hero Sekcia**: Dominantné, 3D vznášajúce sa logo v strede obrazovky.
- **Branding**: Metalický nápis "CHIROPRAXIA KOŠICE" vľavo hore s efektom putujúceho lesku (Liquid Shine).
- **Glassmorphism**: Všetky karty a hlavičky používajú sýte rozostrenie pozadia (backdrop-blur).

> [!IMPORTANT]
> Pri úpravách komponentov dbajte na zachovanie týchto vizuálnych štandardov.

---

## 👥 Spolupráca a Online CMS (GitHub Mode)

Aby mohol na obsahu pracovať **kolega z iného mesta**, systém musí bežať v **GitHub móde**.

### 1. Nastavenie pre kolegu
Kolega musí po naklonovaní repozitára vykonať tieto kroky:
```bash
npm install
npm run setup  # Vygeneruje základný .env súbor
```

### 2. Aktivácia Online prístupu
V súbore `.env` musí byť nastavené:
`KEYSTATIC_STORAGE=github`

A musia byť vyplnené tieto kľúče (získate ich v GitHub Settings → Developer settings → OAuth Apps):
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET` (náhodný 32-znakový reťazec)

> [!TIP]
> Podrobný návod na vytvorenie GitHub aplikácie nájdete v [docs/KEYSTATIC.md](docs/KEYSTATIC.md).

---

## ⚙️ Premenné prostredia (.env)

| Premenná | Význam | Kde získať |
|----------|---------|------------|
| `KEYSTATIC_STORAGE` | `local` (vývoj) / `github` (produkcia/tím) | Manuálne v .env |
| `RESEND_API_KEY` | Odosielanie emailov (rezervácie) | [resend.com](https://resend.com) |
| `SITE_URL` | URL vášho webu (lokálne: http://localhost:4322) | Manuálne |
| `JWT_SECRET` | Zabezpečenie tokenov | `npm run setup` ho vygeneruje |
| `KEYSTATIC_GITHUB_CLIENT_ID` | OAuth ID pre GitHub login | GitHub Developer Settings |

---

## 🚀 Príkazy pre vývoj

```bash
npm run diagnose     # Rýchla kontrola zdravia projektu (odporúčané pred každým buildom)
npm run dev          # Spustenie lokálneho servera
npm run build        # Kompilácia pre produkciu (Vercel)
```

---

## 📚 Dokumentácia pre hĺbkový vývoj

- [LOKALNY-VYVOJ.md](docs/LOKALNY-VYVOJ.md) – Detaily o skriptoch a prostredí.
- [PRODUCTION_DEPLOY_CHECKLIST.md](docs/PRODUCTION_DEPLOY_CHECKLIST.md) – Čo urobiť pred spustením na doméne.

---

Stav projektu: **Vizuálne vyladený a pripravený na tímovú spoluprácu!** ✅
