# Prečo nefunguje https://chiropraxiakosice.eu

Ak doména **chiropraxiakosice.eu** neotvára stránku (timeout, „Site not found“, alebo Vercel chyba), skontrolujte v tomto poradí.

## 1. Doména vo Vercel

- **Vercel** → váš projekt (ten, ktorý deployuje repo `chiropraxia-kosice-keystatic`) → **Settings** → **Domains**.
- V zozname musí byť **chiropraxiakosice.eu** (a podľa potreby **www.chiropraxiakosice.eu**).
- Ak doména chýba: **Add** → zadajte `chiropraxiakosice.eu` → uložte. Vercel zobrazí inštrukcie pre DNS.

**Dôležité:** Doména musí byť pripojená k **tomu projektu**, ktorý sa deployuje z repozitára, ktorý práve používate. Ak máte viac projektov (napr. starý `chiropraxia-kosice` a nový `chiropraxia-kosice-keystatic`), doména môže byť stále na starom projekte – v tom prípade ju odstráňte zo starého a pridajte do nového.

## 2. DNS u poskytovateľa domény

U poskytovateľa domény (napr. Active24, Wedos, Cloudflare) musia byť nastavené záznamy podľa toho, čo Vercel zobrazí po pridaní domény. Typicky:

- **A** record pre `chiropraxiakosice.eu` → IP adresa, ktorú Vercel ukáže (napr. `76.76.21.21`), alebo  
- **CNAME** pre `chiropraxiakosice.eu` → `cname.vercel-dns.com`

Ak používate **www**: CNAME `www` → `cname.vercel-dns.com`.

Zmeny DNS môžu trvať niekoľko minút až hodín (propagácia).

## 3. SSL (HTTPS)

Po pridaní domény Vercel automaticky vystaví certifikát. Stav uvidíte v **Settings → Domains** pri danej doméne. Ak je „Invalid Configuration“, skontrolujte DNS (krok 2).

## 4. Posledný deploy

- **Vercel** → **Deployments**: či je posledný deploy **Ready** (zelený).
- Ak je **Failed** alebo **Error**, otvorte build log a opravte chybu (env, build script, závislosti). Bez úspešného deployu stránka nebude fungovať.

## 5. Správny Vercel projekt

- Overte, že **Git** repozitár napojený na projekt je **youh4ck3dme/chiropraxia-kosice-keystatic** (alebo ten, z ktorého deployujete).
- Overte, že **Production Branch** je `main` (Settings → Git).

## 6. Chyba 404 DEPLOYMENT_NOT_FOUND

Ak Vercel vráti **404 DEPLOYMENT_NOT_FOUND**, znamená to, že URL smeruje na deployment, ktorý neexistuje alebo bol vymazaný. Žiadna zmena v kóde nie je potrebná.

**Skontrolujte:**
- **Deployments**: Musí existovať aspoň jeden deployment so stavom **Ready** a typom **Production**. Ak nie, spustite nový deploy (push na `main` alebo v Deployments kliknite **Redeploy** na posledný commit).
- **Domains**: Overte, že `chiropraxiakosice.eu` a `www.chiropraxiakosice.eu` sú priradené k **tomuto** projektu (ten s repo `chiropraxia-kosice-keystatic`). Ak je doména na inom projekte, odstráňte ju tam a pridajte sem.
- Nepoužívajte staré **Preview URL** z e-mailov – tie deploymenty môžu byť vymazané. Používajte len production doménu.

---

**Rýchly test:** Ak **Vercel Preview URL** (napr. `projekt.vercel.app` alebo `projekt-xxx.vercel.app`) funguje, ale vlastná doména nie, problém je takmer určite v krokoch 1 alebo 2 (doména/DNS vo Vercel a u registrátora).
