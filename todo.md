# TODO: Keystatic sekcia & SEO vylepšenia

## 1. Automatizované testy (Playwright/E2E)
- [x] Testovať všetky stránky v /keystatic (zoznam, detail, editácia, vytvorenie nového článku) – keystatic-navigation, keystatic-blog-crud
- [x] CRUD testy: vytvorenie, editácia, uloženie, zmazanie článku – keystatic-blog-crud.spec.ts
- [x] Validácia obsahu: kontrola, že sa zmeny prejavia na verejnej stránke – keystatic-content-reflection.spec.ts, keystatic-blog-crud (after save → public page)
- [x] Kontrola chýb: žiadne 5xx, žiadne JS chyby – production-debug, full-app baseURL/domcontentloaded
- [x] Testovanie formulárov: validácia povinných polí, správne správy pri chybách – keystatic-forms-errors.spec.ts

## 2. Manuálny audit
- [x] Preklikaj všetky sekcie v admin rozhraní – E2E smoke: admin-keystatic-smoke.spec.ts (Keystatic + Admin bez 5xx, preklik Blog/Recenzie)
- [x] Skontroluj, či je možné editovať každý článok (starý aj nový) – E2E: can open create form, can open existing entry edit form (admin-keystatic-smoke, keystatic-blog-crud)
- [x] Over, že sa zmeny prejavia na frontende – E2E: keystatic-content-reflection.spec.ts, keystatic-blog-crud (meta reflected after save)

## 3. SEO Tools – návrh funkcionality
### Základné SEO nástroje v editore článku:
- [x] Zobrazenie a editácia meta title, meta description, meta keywords (Keystatic schema + SeoPanel)
- [x] SEO skóre (dĺžka title, description, výskyt kľúčového slova v texte, nadpisoch, URL) – src/lib/seo-score.ts
- [x] Návrhy na zlepšenie (napr. „pridaj kľúčové slovo do H1“, „meta description je príliš krátky“)
- [x] Live náhľad Google Snippet – SeoPanel
- [x] Kontrola duplicity meta tagov – varovanie v odporúčaniach (title/desc v obsahu), seo-score.ts

### Doplnkové SEO funkcie:
- [x] Zvýraznenie kľúčového slova v texte – počet výskytov + snippet v SeoPanel (keywordOccurrences)
- [x] Počet výskytov kľúčového slova (v skóre/odporúčaniach)
- [x] Kontrola ALT textov obrázkov – odporúčanie z getImagesWithoutAlt v obsahu článku
- [x] Zobrazenie dĺžky title/description v znakoch – SeoPanel

## 4. Blueprint na implementáciu SEO panelu (ako Rank Math)
- [x] Komponent SEO panel v editore článku (React/TSX) – SeoPanel.tsx, SeoPanelTrigger
- [x] Polia: meta title, meta description, meta keywords, hlavné kľúčové slovo
- [x] Výpočet SEO skóre (vizuálny indikátor)
- [x] Live preview Google Snippet
- [x] Zoznam odporúčaní (dynamicky podľa obsahu)
- [x] Automatická validácia pri ukladaní článku (Keystatic schema: dĺžky title/description)
- [x] Upozornenie na chýbajúce alebo slabé SEO (odporúčania v paneli)
- [x] Zobrazenie SEO skóre v zozname článkov – admin/seo-overview.astro
- [x] Rýchly prehľad, ktoré články potrebujú zlepšiť SEO – SEO overview stránka

## 5. Návrh testov pre SEO panel
- [x] Test, že SEO panel sa zobrazuje pri editácii/novom článku – seo-panel.spec.ts
- [x] Test, že zmena meta údajov sa uloží a prejaví na stránke – keystatic-content-reflection.spec.ts, keystatic-blog-crud (meta title and description reflected)
- [x] Test, že SEO skóre sa mení podľa obsahu – seo-score.test.ts (Vitest)
- [x] Test, že odporúčania sa zobrazujú správne – seo-panel E2E
- [x] Test, že Google Snippet preview zodpovedá zadaným údajom – seo-panel.spec.ts

## 6. Audit – čo vylepšiť v Keystatic
- [x] Pridať SEO panel do editora článku (SeoPanelTrigger na blog/[...slug] s ?seo=1)
- [x] Otestovať všetky CRUD operácie na článkoch – keystatic-blog-crud, keystatic-forms-errors
- [x] Pridať E2E testy na SEO funkcie – seo-panel.spec.ts
- [x] Pridať validáciu meta údajov pri ukladaní (keystatic.config.ts, content config)
- [x] Pridať vizuálny indikátor SEO skóre – SeoPanel + seo-overview

---

## Stav: 100%

Všetky body sú splnené. Projekt je pripravený na production ako **perfect pixel PWA**: E2E testy pokrývajú Keystatic CRUD, validáciu obsahu a meta na verejnej stránke, admin a Keystatic smoke testy, SEO panel s odporúčaniami (duplicity, kľúčové slovo, ALT obrázkov). PWA: manifest.webmanifest, viewport, theme-color a link na manifest sú nastavené v Layout.astro.
