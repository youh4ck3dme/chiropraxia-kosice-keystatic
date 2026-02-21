# 3 prompty na dokončenie projektu (100% perfect pixel PWA)

Skopíruj jeden z nasledujúcich promptov a zadaj ho do Cursor/AI. Po spracovaní všetkých troch bude todo.md kompletné a projekt pripravený na production.

---

## Prompt 1 – E2E: Validácia obsahu a meta na verejnej stránke

```
V projekte chiropraxia-kosice-fix doplň E2E testy v Playwright tak, aby:

1. Validácia obsahu z Keystatic na frontende
   - Pridaj test (v e2e/keystatic-blog-crud.spec.ts alebo nový súbor), ktorý:
     - vytvorí alebo otvorí existujúci článok v Keystatic,
     - zmení názov článku (title) a/alebo SEO popis (seoDescription) a uloží,
     - potom navštívi verejnú stránku /blog/[slug] (alebo /blog ak je to listing),
     - overí, že sa zmeny prejavia: že <title> alebo meta description na stránke zodpovedá zadaným hodnotám.

2. Test „zmena meta údajov sa uloží a prejaví na stránke“
   - Pridaj konkrétny E2E test s názvom typu „meta title and description are reflected on public blog post page“:
     - po uložení článku v Keystatic s konkrétnym metaTitle a seoDescription over na /blog/[slug], že:
       - document title obsahuje metaTitle (alebo title ak metaTitle chýba),
       - meta name="description" content="…" zodpovedá seoDescription.
   - Použi baseURL z playwright.config (localhost:4322), waitUntil: 'domcontentloaded', a realistické časové limity.

Uprav len E2E súbory a prípadne playwright config ak treba. Po dokončení označ v todo.md ako splnené: „Validácia obsahu: kontrola, že sa zmeny prejavia na verejnej stránke“ a „Test, že zmena meta údajov sa uloží a prejaví na stránke“.
```

---

## Prompt 2 – SEO: Duplicity meta, zvýraznenie kľúčového slova, ALT obrázkov

```
V projekte chiropraxia-kosice-fix doplň do SEO funkcionality (src/lib/seo-score.ts, prípadne SeoPanel alebo admin komponenty) tieto tri veci:

1. Kontrola duplicity meta tagov
   - V výpočte SEO (napr. v computeSeoScore alebo v odporúčaniach) pridaj kontrolu:
     - či sa na stránke (v rámci článku) nevyskytuje viackrát ten istý meta title alebo meta description (napr. z MDX obsahu),
     - alebo či title/description nie sú identické s iným článkom (voliteľné, môžeš len varovať „skontroluj duplicity“).
   - Ak nájdeš duplicitu alebo potenciálnu duplicitu, pridaj do odporúčaní položku typu „Kontrola duplicity: …“ alebo „Avoid duplicate meta tags“.

2. Zvýraznenie kľúčového slova v texte
   - V SEO paneli (SeoPanel.tsx) alebo na stránke blog článku pri zobrazení s ?seo=1:
     - ak je zadané hlavné kľúčové slovo (focusKeyword), zobraz v prehľade (napr. v odporúčaniach alebo v malom bloku) miesta výskytu v texte:
       - počet výskytov v odstavcoch,
       - prípadne prvých pár výskytov s kontextom (snippet).
     - Voliteľne: v náhľade článku (napr. v iframe alebo v paneli) zvýrazni kľúčové slovo (napr. <mark>) – len ak to neruší existujúci layout; ak nie je jednoduché, stačí zobrazenie počtu a snippetov v SeoPanel.

3. Kontrola ALT textov obrázkov
   - V src/lib/seo-score.ts (alebo nová funkcia) pridaj kontrolu obrázkov v obsahu článku:
     - vstup: telo článku (MDX/HTML string alebo štruktúra s obrázkami),
     - nájdi všetky obrázky (napr. markdown ![alt](url) alebo <img> v HTML),
     - pre každý obrázok bez alt textu alebo s prázdnym alt pridaj do odporúčaní položku „Pridaj ALT text k obrázku“ alebo „Obrázok bez ALT: …“.
   - Tieto odporúčania sa majú zobraziť v SeoPanel spolu s ostatnými.

Použi existujúci formát odporúčaní a rozhranie computeSeoScore. Po dokončení označ v todo.md ako splnené: „Kontrola duplicity meta tagov“, „Zvýraznenie kľúčového slova v texte“, „Kontrola ALT textov obrázkov“.
```

---

## Prompt 3 – Admin audit a PWA: Smoke testy a finálna kontrola

```
V projekte chiropraxia-kosice-fix urob nasledovné tak, aby bol projekt 100% pripravený ako perfect pixel PWA a aby boli položky manuálneho auditu pokryté automatizáciou alebo jasným checklistom:

1. E2E smoke test pre admin/Keystatic sekcie
   - Pridaj (alebo rozšír existujúci) E2E test, ktorý:
     - navštívi /keystatic a overí, že stránka načíta (žiadne 5xx),
     - prekliká alebo overí prítomnosť odkazov na všetky hlavné sekcie (Blog Články, Recenzie, prípadne ďalšie kolekcie z keystatic.config),
     - navštívi /admin a overí, že sa zobrazí login alebo dashboard (žiadne 5xx).
   - Cieľ: nahradiť manuálny „Preklikaj všetky sekcie v admin rozhraní“ automatizovaným smoke testom.

2. E2E test editácie existujúceho a nového článku
   - Pridaj test, ktorý overí, že:
     - je možné otvoriť existujúci článok v Keystatic (zoznam blog → klik na článok alebo „Edit“) a že sa zobrazí formulár na editáciu (napr. getByLabel('Názov článku') je viditeľný),
     - je možné otvoriť vytvorenie nového článku (Create) a že sa zobrazí formulár (rovnaké polia).
   - Tým sa pokryjú body: „Skontroluj, či je možné editovať každý článok (starý aj nový)“ a čiastočne „Over, že sa zmeny prejavia na frontende“ (kombinované s Promptom 1).

3. PWA a todo finále
   - Skontroluj, že PWA je v poriadku: manifest.webmanifest, service worker, meta tagy (viewport, theme-color) – ak niečo chýba, doplň podľa best practices.
   - V todo.md označ ako splnené:
     - „Preklikaj všetky sekcie v admin rozhraní“ (po pridaní smoke testu),
     - „Skontroluj, či je možné editovať každý článok (starý aj nový)“ (po pridaní E2E),
     - „Over, že sa zmeny prejavia na frontende“ (ak je pokryté testami z Promptu 1 a tohto).
   - Pridaj na koniec todo.md krátku sekciu „Stav: 100%“ so zoznamom, čo je hotové (1–2 vety), aby bolo jasné, že projekt je production-ready perfect pixel PWA.
```

---

## Poradie spustenia

1. **Prompt 1** – E2E validácia obsahu a meta (najprv testy, aby sa dalo overiť správanie).
2. **Prompt 2** – SEO rozšírenia (duplicity, kľúčové slovo, ALT).
3. **Prompt 3** – Admin smoke testy, editácia starého/nového článku, PWA kontrola a finálna aktualizácia todo.md.

Po spracovaní všetkých troch promptov by mali byť v `todo.md` všetky body zaškrtnuté a na konci pridaná sekcia „Stav: 100%“.
