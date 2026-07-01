import { config, fields, collection, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

const storageKind = import.meta.env.KEYSTATIC_STORAGE === 'local' ? 'local' : 'github';

export default config({
  storage: storageKind === 'local'
    ? { kind: 'local' }
    : {
      kind: 'github',
      repo: 'youh4ck3dme/chiropraxia-kosice-keystatic',
    },

  singletons: {
    siteSettings: singleton({
      label: 'Nastavenia webu',
      path: 'src/content/settings/site',
      format: { data: 'json' },
      schema: {
        companyInfo: fields.object({
          name: fields.text({ label: 'N\u00e1zov firmy', defaultValue: 'Chiropraxia Ko\u0161ice' }),
          phone: fields.text({ label: 'Telef\u00f3nne \u010d\u00edslo', defaultValue: '+421 905 307 198' }),
          email: fields.text({ label: 'Email', defaultValue: 'booking@fyzioafit.sk' }),
          address: fields.text({ label: 'Adresa', defaultValue: 'Krmanova 854/6, 040 01 Ko\u0161ice' }),
          instagramUrl: fields.text({ label: 'Instagram URL' }),
          facebookUrl: fields.text({ label: 'Facebook URL' }),
        }, { label: 'Kontaktn\u00e9 \u00fadaje' }),

        openingHours: fields.object({
          monday: fields.text({ label: 'Pondelok', defaultValue: '08:00 - 17:00' }),
          tuesday: fields.text({ label: 'Utorok', defaultValue: '08:00 - 17:00' }),
          wednesday: fields.text({ label: 'Streda', defaultValue: '08:00 - 17:00' }),
          thursday: fields.text({ label: '\u0160tvrtok', defaultValue: '08:00 - 17:00' }),
          friday: fields.text({ label: 'Piatok', defaultValue: '08:00 - 17:00' }),
          saturday: fields.text({ label: 'Sobota', defaultValue: '09:00 - 13:00' }),
          sunday: fields.text({ label: 'Nede\u013ea', defaultValue: 'Zatvorené' }),
        }, { label: 'Otv\u00e1racie hodiny' }),
      }
    }),
  },

  collections: {
    // Blog Articles Collection
    blog: collection({
      label: 'Blog \u010cl\u00e1nky',
      slugField: 'slug',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({
          label: 'N\u00e1zov \u010dl\u00e1nku',
          validation: { isRequired: true, length: { max: 120 } },
          description: 'Odpor\u00fa\u010dan\u00e1 d\u013a\u017eka pre SEO: 50\u201360 znakov.',
        }),
        metaTitle: fields.text({
          label: 'Meta Title (voli\u0165e\u013en\u00e9)',
          description: 'Ak je pr\u00e1zdne, pou\u017eije sa n\u00e1zov \u010dl\u00e1nku. Pre SEO 50\u201360 znakov.',
        }),
        slug: fields.slug({
          name: { label: 'URL Slug' },
        }),
        seoDescription: fields.text({
          label: 'SEO Popis',
          description: 'Meta description pre vyh\u013ead\u00e1va\u010de. Odpor\u00fa\u010dan\u00fdch 120\u2013160 znakov.',
          validation: { isRequired: true },
          multiline: true,
        }),
        keywords: fields.text({
          label: 'K\u013e\u00fa\u010dov\u00e9 slov\u00e1',
          description: 'Oddelen\u00e9 \u010diarkou, napr: boles\u0165 chrbta, chiropraktik Ko\u0161ice',
        }),
        focusKeyword: fields.text({
          label: '\ud83c\udfaf Focus Keyword',
          description: 'Hlavn\u00e9 k\u013e\u00fa\u010dov\u00e9 slovo pre SEO. Uisti sa, \u017ee je v n\u00e1zve a popise.',
        }),
        advancedSeo: fields.object({
          noIndex: fields.checkbox({
            label: 'No Index',
            description: 'Ak zapnut\u00e9, vyh\u013ead\u00e1va\u010de nebud\u00fa str\u00e1nku indexova\u0165.',
            defaultValue: false,
          }),
          schemaType: fields.text({
            label: 'Schema.org typ',
            description: 'Napr. Article, NewsArticle',
            defaultValue: 'Article',
          }),
        }, { label: 'Roz\u0161\u00edren\u00e9 SEO', description: 'Voli\u0165e\u013en\u00e9 nastavenia pre indexovanie a \u0161trukt\u00farovan\u00e9 d\u00e1ta.' }),
        readingTimeMinutes: fields.integer({
          label: '\u23f1\ufe0f \u010cas \u010d\u00edtania (min)',
          description: 'Odhadovan\u00fd \u010das \u010d\u00edtania v min\u00fatach',
          defaultValue: 5,
          validation: { min: 1, max: 60 },
        }),
        coverImage: fields.image({
          label: 'Titulný obrázok',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        coverImageAlt: fields.text({
          label: 'Alt text obrázka',
          description: 'Popis obrázka pre prístupnosť',
        }),
        publishDate: fields.date({
          label: 'Dátum publikovania',
          defaultValue: { kind: 'today' },
        }),
        status: fields.select({
          label: 'Stav článku',
          options: [
            { label: 'Publikovaný', value: 'published' },
            { label: 'Koncept', value: 'draft' },
          ],
          defaultValue: 'published',
        }),
        author: fields.text({
          label: 'Autor',
          defaultValue: 'Dr. Martin Kováč',
        }),
        category: fields.select({
          label: 'Kategória',
          options: [
            { label: 'Bolesť chrbta', value: 'back-pain' },
            { label: 'Bolesť hlavy', value: 'headache' },
            { label: 'Prevencia', value: 'prevention' },
            { label: 'Rehabilitácia', value: 'rehabilitation' },
            { label: 'Všeobecné', value: 'general' },
          ],
          defaultValue: 'general',
        }),
        content: fields.mdx({
          label: 'Obsah článku',
          options: {
            bold: true,
            italic: true,
            strikethrough: true,
            code: true,
            heading: [2, 3, 4],
            blockquote: true,
            orderedList: true,
            unorderedList: true,
            table: true,
            link: true,
            image: true,
            divider: true,
          },
          components: {
            Callout: wrapper({
              label: 'Callout (Tip/Info)',
              schema: {
                type: fields.select({
                  label: 'Typ',
                  options: [
                    { label: 'Tip', value: 'tip' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Info', value: 'info' },
                    { label: 'Success', value: 'success' },
                  ],
                  defaultValue: 'info',
                }),
                title: fields.text({
                  label: 'Titulok calloutu (voliteľne)',
                  description: 'Zobrazí sa nad obsahom.',
                }),
              },
            }),
            FAQ: block({
              label: 'FAQ Accordion',
              schema: {
                items: fields.array(
                  fields.object({
                    question: fields.text({ label: 'Otázka' }),
                    answer: fields.text({ label: 'Odpoveď', multiline: true }),
                  }),
                  {
                    label: 'FAQ Položky',
                    itemLabel: (props: { fields: { question: { value: string } } }) => props.fields.question.value || 'Položka',
                  }
                ),
              },
            }),
            VideoEmbed: block({
              label: 'Video Embed',
              schema: {
                url: fields.text({ label: 'Video URL (YouTube/Vimeo)' }),
                title: fields.text({ label: 'Titulok videa (voliteľné)' }),
              },
            }),
            BeforeAfter: block({
              label: 'Pred/Po Slider',
              schema: {
                beforeImage: fields.image({
                  label: 'Obrázok PRED',
                  directory: 'public/images/blog',
                  publicPath: '/images/blog/',
                }),
                afterImage: fields.image({
                  label: 'Obrázok PO',
                  directory: 'public/images/blog',
                  publicPath: '/images/blog/',
                }),
                beforeAlt: fields.text({ label: 'Alt text PRED', defaultValue: 'Pred ošetrením' }),
                afterAlt: fields.text({ label: 'Alt text PO', defaultValue: 'Po ošetrení' }),
              },
            }),
          },
        }),
      },
    }),

    digitalCards: collection({
      label: 'Digitálne Vizitky',
      slugField: 'brandName',
      path: 'src/content/digital-cards/*',
      format: { contentField: 'bio' },
      schema: {
        brandName: fields.slug({ name: { label: 'Názov Brandu/Firmy' } }),
        personName: fields.text({ label: 'Meno a Priezvisko' }),
        jobTitle: fields.text({ label: 'Pracovná pozícia' }),
        bio: fields.mdx({
          label: 'Krátke Bio / Motto',
          options: { bold: true, italic: true }
        }),
        avatar: fields.image({
          label: 'Profilová fotka (Avatar)',
          directory: 'public/images/cards',
          publicPath: '/images/cards/',
        }),
        coverImage: fields.image({
          label: 'Titulná fotka (Cover)',
          directory: 'public/images/cards',
          publicPath: '/images/cards/',
        }),
        links: fields.object({
          instagramUrl: fields.text({ label: 'Instagram URL' }),
          aboutUrl: fields.text({ label: 'O nás / Info URL' }),
          phone: fields.text({ label: 'Telefónne číslo' }),
          webUrl: fields.text({ label: 'Webstránka URL' }),
        }, { label: 'Odkazy a Kontakty' }),
        vCard: fields.object({
          fullName: fields.text({ label: 'FN (Full Name for vCard)' }),
          organization: fields.text({ label: 'Organizácia' }),
          title: fields.text({ label: 'Titul/Pozícia' }),
          phone: fields.text({ label: 'Telefón' }),
          url: fields.text({ label: 'URL pre vizitku' }),
        }, { label: 'Dáta pre uloženie kontaktu (vCard)' }),
        aiAssistant: fields.object({
          enabled: fields.checkbox({ label: 'Povoliť AI Poradňu', defaultValue: true }),
          prompt: fields.text({
            label: 'Inštrukcie pre AI (Prompt)',
            multiline: true,
            defaultValue: 'Si profesionálny AI asistent. Odpovedaj stručne a v slovenčine.'
          }),
        }, { label: 'Nastavenia AI Asistenta' }),
      }
    }),

    testimonials: collection({
      label: 'Recenzie',
      slugField: 'author',
      path: 'src/content/testimonials/*',
      schema: {
        author: fields.slug({ name: { label: 'Meno klienta' } }),
        text: fields.text({
          label: 'Text recenzie',
          validation: { isRequired: true },
          multiline: true,
        }),
        rating: fields.integer({
          label: 'Hodnotenie (1-5)',
          validation: { isRequired: true, min: 1, max: 5 },
          defaultValue: 5,
        }),
        service: fields.text({
          label: 'Využitá služba',
          description: 'Napr: Chiropraktické ošetrenie',
        }),
        date: fields.date({
          label: 'Dátum recenzie',
          defaultValue: { kind: 'today' },
        }),
        isVisible: fields.checkbox({
          label: 'Zobraziť na webe',
          defaultValue: true,
        }),
      },
    }),

    services: collection({
      label: 'Služby a cenník',
      slugField: 'slug',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({
          name: { label: 'Identifikátor (URL)' },
        }),
        name: fields.text({
          label: 'Názov služby',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Popis služby',
          multiline: true,
          validation: { isRequired: true },
        }),
        duration_min: fields.integer({
          label: 'Trvanie (minúty)',
          defaultValue: 30,
          validation: { min: 0 },
          description: 'Zadaj 0 pre príplatky bez časového trvania.',
        }),
        price: fields.number({
          label: 'Cena (€)',
          validation: { isRequired: true, min: 0 },
        }),
        sort_order: fields.integer({
          label: 'Poradie zobrazenia',
          defaultValue: 0,
          validation: { min: 0 },
          description: 'Nižšie číslo = zobrazí sa skôr.',
        }),
        isActive: fields.checkbox({
          label: 'Aktívna služba (zobraziť na webe)',
          defaultValue: true,
        }),
      },
    }),
  },
});
