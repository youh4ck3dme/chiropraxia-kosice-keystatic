# E2E Testovanie (Playwright)

Tento projekt využíva Playwright na end-to-end testovanie kritických funkcií webu a CMS Keystatic.

## Príprava na testovanie

Pred spustením testov sa uistite, že máte nainštalované závislosti a prehliadače:

```bash
npm install
npx playwright install
```

## Spustenie testov

### Lokálne testovanie
Pre spustenie všetkých testov v headless režime:
```bash
npm run test:e2e
```

Pre spustenie v interaktívnom UI režime (odporúčané pri debugovaní):
```bash
npm run test:e2e:ui
```

### Testovanie špecifických modulov
```bash
npx playwright test e2e/admin.spec.ts
npx playwright test e2e/booking.spec.ts
```

## Hlavné testovacie scenáre

1.  **Keystatic Admin (`e2e/admin.spec.ts`)**: Testuje prihlásenie a základnú navigáciu v CMS.
2.  **Rezervačný systém (`e2e/booking.spec.ts`)**: Overuje funkčnosť výberu služieb a odoslania rezervácie.
3.  **Blog CRUD (`e2e/keystatic-blog-crud.spec.ts`)**: Testuje vytváranie, úpravu a mazanie blogov.
4.  **SEO Kontrola (`e2e/seo-panel.spec.ts`)**: Overuje prítomnosť meta tagov a správnosť štruktúry.

## Riešenie problémov (Reload dát)

Ak testy zlyhávajú kvôli nekonzistentným dátam v Keystaticu, odporúča sa:
1.  Stiahnuť aktuálny stav repozitára: `git pull origin main`.
2.  Zmazať lokálne zmeny v `src/content/`, ak nie sú uložené.
3.  Reštartovať dev server: `npm run dev`.

## Poznámky k zlyhaniam
- **Timeouty**: Často spôsobené pomalým načítaním náhľadu v Keystaticu.
- **Selektory**: Keystatic často mení DOM štruktúru pri updatoch, vtedy je potrebné aktualizovať selektory v `*.spec.ts` súboroch.
