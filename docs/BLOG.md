# Blog

Články blogu sú **čisto statické**: sú uložené ako MDX súbory v `src/content/blog/`, spracované cez Astro content collections (`getCollection('blog')`) a pri builde prerenderované. Na blog sa nepoužíva žiadna databáza.

---

## Cover obrázky

Každý článok má **jeden unikátny** cover obrázok (žiadna duplicita). Obrázky sa ukladajú do `public/images/blog/` a v Keystatic sa dajú nahrať cez CMS.

### Špecifikácia (formát a rozmer)

| Parameter | Odporúčanie |
|-----------|-------------|
| **Rozmer** | **1200×630 px** (pomer 1,9:1 – vhodné pre OG/Facebook/LinkedIn) alebo **1200×675 px** (16:9). |
| **Formát** | WebP alebo JPEG/PNG. |
| **Téma** | Chiropraxia: ošetrenie chrbtice, ambulancia, rehabilitácia, masáž, zdravý chrbát, odborník pri práci. |
| **Kvalita** | Ostré, dobre osvetlené; text riešiť cez `coverImageAlt` v frontmatter. |

### Zoznam súborov (článok → unikátny súbor)

| Článok (slug) | Súbor cover obrázka | Téma pre alt/foto |
|---------------|---------------------|--------------------|
| co-je-chiropraxia | co-je-chiropraxia.png | Úvod do chiropraxie, ošetrenie chrbtice v ambulancii |
| lumbago-prva-pomoc | lumbago-bolest.png | Seknutie v krížoch, bedrová oblasť, úľavová poloha |
| migrena-krcna-chrbtica | migrena-krk.png | Krčná chrbtica, migréna, vyšetrenie krku |
| fyzioterapia-vs-chiropraxia | fyzio-vs-chiro.png | Fyzioterapia a chiropraxia, rehabilitácia |
| masaz-po-sporte | ai_masaz_po_sporte.png | Športová masáž, regenerácia |
| kedy-navstivit-chiropraktika | chiropraktik-signaly.png | Chiropraktik vyšetruje, signály tela |
| chiropraxia-ocami-odbornika | ai_chiropraxia_odbornik.png | Odborné ošetrenie v ambulancii |
| odborna-masaz-pri-bolestiach-chrbta | odborna-masaz.png | Profesionálna masáž chrbta |
| pravidelna-masaz-chrbta | ai_masaz_chrbta.png | Pravidelná masáž chrbta v prostredí |
| myty-o-chiropraxii | chiropraxia-myty.png | Mýty a fakty o chiropraxii (infografika) |

Skutočné súbory obrázkov doplňte do `public/images/blog/` (vlastné fotky, stock alebo nahratie cez Keystatic). Každý článok má v frontmatter `coverImage` a `coverImageAlt`.

### Pred nasadením

- Skontrolujte, že v `public/images/blog/` sú **všetky** súbory z tabuľky vyššie (vrátane `co-je-chiropraxia.png`). Chýbajúci súbor spôsobí zlomený obrázok na stránke.
- V Keystatic môžete obrázky nahrať cez CMS; cieľová cesta je `public/images/blog/` (alebo ekvivalent v repozitári).
- Ak článok nemá `coverImage`, na výpise sa nezobrazí žiadny cover; v komponente súvisiacich článkov sa zobrazí placeholder.
