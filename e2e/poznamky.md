# Blog import notes

<!-- cspell:disable -->

Zdroj článkov: `C:\Users\42195\Desktop\noveblog-clanky`

## Úloha

1. Rozbaliť archív `blogclanky.zip` do priečinka `src/content/blog/`.
2. Skontrolovať a prípadne skopírovať obrázky z `public/images/blog/`, ak sú potrebné.
3. Overiť, že všetky články majú správne frontmatter (`status: published`).
4. Spustiť development server a overiť, že články sú viditeľné na `/blog` stránke.
5. Ak je potrebné, aktualizovať Keystatic konfiguráciu.

## Súbory na overenie

- `src/content/blog/` - cieľový priečinok pre články
- `src/pages/blog/index.astro` - blog index stránka
- `src/pages/blog/[...slug].astro` - detail článku
- `keystatic.config.ts` - Keystatic konfigurácia

## Požiadavky

- Neprepisovať existujúce články, iba pridať nové
- Overiť URL slugy na unikátnosť
- Skontrolovať obrázkové cesty
- Overiť SEO metadáta
- Spustiť `npm run dev` a overiť funkčnosť

## Rozšírený prompt pre detailnejšiu implementáciu

```text
Mám hotový Astro + Keystatic projekt s funkčným blogom. Potrebujem integrovať 10 nových blogových článkov z archívu blogclanky.zip.

Konkrétne kroky:
1. Extrahovanie obsahu:
   - Rozbaliť blogclanky.zip do dočasného priečinka
   - Prečítať všetky .mdx súbory a ich frontmatter
   - Overiť, že všetky majú status: published

2. Integrácia do projektu:
   - Skopírovať všetky .mdx súbory do src/content/blog/
   - Skontrolovať URL slugy na konflikty s existujúcimi článkami
   - Ak je potrebné, upraviť slugy pre unikátnosť
   - Skopírovať príslušné obrázky do public/images/blog/

3. Kontrola kvality:
   - Overiť frontmatter štruktúru (title, seoDescription, publishDate, author, category, coverImage)
   - Skontrolovať obrázkové cesty v markdownu
   - Overiť SEO optimalizáciu (focusKeyword, meta popisy)

4. Testovanie:
   - Spustiť npm run dev
   - Overiť, že všetky články sú viditeľné na /blog
   - Overiť, že jednotlivé články sú prístupné na /blog/[slug]
   - Overiť, že Keystatic UI zobrazuje všetky články

5. Dokumentácia:
   - Vytvoriť zoznam pridaných článkov
   - Poznačiť akékoľvek zmeny slugov alebo obrázkov
   - Overiť, že build proces prechádza

Očakávaný výsledok:
- Všetky 10 článkov pridaných do existujúceho blogu
- Žiadne konflikty s existujúcimi článkami
- Plne funkčný blog s novým obsahom
- SEO optimalizované články
- Overená integrácia s Keystatic CMS
```

## Prompt pre rýchlu implementáciu

```text
Pridaj nové blogové články z blogclanky.zip do existujúceho Astro + Keystatic projektu:

1. Extract blogclanky.zip → temp/
2. Copy all .mdx files to src/content/blog/
3. Copy related images to public/images/blog/
4. Check for slug conflicts, rename if needed
5. Verify all have status: published
6. Run npm run dev
7. Test /blog page shows all articles
8. Test individual article URLs work
9. Verify Keystatic UI shows new articles

Keep existing articles, only add new ones. Report any conflicts or issues.
```

## Kľúčové body pre AI

- Neprepisovať existujúce súbory - iba pridávať nové
- Overiť unikátnosť slugov - dôležité pre URL
- Skontrolovať obrázkové cesty - relatívne cesty musia byť správne
- Overiť frontmatter - všetky povinné polia musia byť vyplnené
- Testovať funkčnosť - development server a prehliadanie článkov
- Overiť Keystatic integráciu - články by mali byť viditeľné v CMS

<!-- cspell:enable -->
