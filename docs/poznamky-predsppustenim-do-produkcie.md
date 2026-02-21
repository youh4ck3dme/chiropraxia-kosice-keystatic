# 🚀 Poznámky pred spustením do produkcie (Checklist)

Tento dokument slúži ako finálna kontrola pred tým, než web vypustíte do sveta.

## 1. Vercel - Nastavenie Premenných (Environment Variables)
Aby web fungoval na Verceli rovnako ako u vás, musíte v **Settings -> Environment Variables** pridať tieto kľúče.
*Hodnoty nájdete vo vašom lokálnom `.env` súbore.*

### 🛠 Supabase (Databáza)
Bez týchto nebude fungovať načítanie služieb ani rezervácie.
- **`PUBLIC_SUPABASE_URL`**: `https://ftmdpkibpxvdjxgkzkqk.supabase.co`
- **`PUBLIC_SUPABASE_ANON_KEY`**: *(Váš dlhý kľúč začínajúci na eyJh...)*

### 📧 Resend (Primárne odosielanie emailov)
Používa sa pre kontaktný formulár, rezervácie a notifikácie o newsletteri.
- **`RESEND_API_KEY`**: *(Váš kľúč z resend.com)*

### 📧 SMTP (Staršie/Záložné odosielanie)
Používa sa len ako fallback v niektorých častiach alebo ak Resend nie je k dispozícii.
- **`SMTP_HOST`**: `smtp.m1.websupport.sk`
- **`SMTP_PORT`**: `465`
- **`SMTP_SECURE`**: `true`
- **`SMTP_USER`**: `info@chiropraxiakosice.eu`
- **`SMTP_PASSWORD`**: *(Vaše heslo k schránke)*

---

## 2. Supabase - Na čo dať pozor
- **Table Editor**: Tu môžete ručne mazať testovacie rezervácie, ktoré sme vytvorili.
- **Authentication**: V sekcii *Authentication -> URL Configuration* skontrolujte "Site URL".
    - Pre Vercel by tam malo byť: `https://vas-projekt.vercel.app` (alebo vaša doména `chiropraxiakosice.eu`).
    - Ak to nenastavíte, niektoré presmerovania (napr. pri zmene hesla) nemusia fungovať.

---

## 3. WebSupport (DNS)
Ak nasadzujete na Vercel, ale doménu máte na WebSupporte:
1.  Vo Verceli pridajte doménu `chiropraxiakosice.eu`.
2.  Vercel vám dá **A Record** (IP adresu) alebo **CNAME**.
3.  V administrácii WebSupportu (DNS záznamy) zmeňte A záznam tak, aby smeroval na Vercel.
4.  **POZOR:** Nemeňte `MX` záznamy (tie zabezpečujú emaily). Tie musia ostať na WebSupporte, aby vám fungovala schránka `info@...`.

---

## 4. GitHub & Bezpečnosť 🔒
**Otázka:** *Môžem už repo zatvoriť a dať privatne?*
**Odpoveď:** **ÁNO.**

Váš súbor `.gitignore` je nastavený správne. Obsahuje:
```gitignore
.env
.env.*
supabase/config.toml
```
To znamená, že **žiadne heslá, API kľúče ani citlivé údaje sa nenahrali na GitHub**. Sú len u vás v počítači (v súbore `.env`) a budú vo Verceli (v Environment Variables).

Repozitár na GitHube obsahuje len "čistý kód". Môžete ho pokojne prepnúť na **Private** v nastaveniach GitHubu (Settings -> Danger Zone -> Change visibility), aby k nemu nikto iný nemal prístup.
