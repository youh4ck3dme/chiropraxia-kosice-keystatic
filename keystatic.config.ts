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
          name: fields.text({ label: 'Názov firmy', defaultValue: 'Chiropraxia Košice' }),
          phone: fields.text({ label: 'Telefónne číslo', defaultValue: '+421 905 307 198' }),
          email: fields.text({ label: 'Email', defaultValue: 'info@chiropraxiakosice.eu' }),
          address: fields.text({ label: 'Adresa', defaultValue: 'Krmanova 854/6, 040 01 Košice' }),
          instagramUrl: fields.text({ label: 'Instagram URL' }),
          facebookUrl: fields.text({ label: 'Facebook URL' }),
        }, { label: 'Kontaktné údaje' }),

        openingHours: fields.object({
          monday: fields.text({ label: 'Pondelok', defaultValue: '08:00 - 17:00' }),
          tuesday: fields.text({ label: 'Utorok', defaultValue: '08:00 - 17:00' }),
          wednesday: fields.text({ label: 'Streda', defaultValue: '08:00 - 17:00' }),
          thursday: fields.text({ label: 'Štvrtok', defaultValue: '08:00 - 17:00' }),
          friday: fields.text({ label: 'Piatok', defaultValue: '08:00 - 17:00' }),
          saturday: fields.text({ label: 'Sobota', defaultValue: '09:00 - 13:00' }),
          sunday: fields.text({ label: 'Nedeľa', defaultValue: 'Zatvorené' }),
        }, { label: 'Otváracie hodiny' }),
      }
    }),
  },

  collections: {
    // Blog Articles Collection
    blog: collection({
      label: 'Blog Články',
      slugField: 'slug',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        // SEO & Meta
        title: fields.text({
          label: 'Názov článku',
          validation: { isRequired: true, length: { min: 10, max: 120 } },
          description: 'Odporúčaná dĺžka pre SEO: 50–60 znakov.',
        }),
        metaTitle: fields.text({
          label: 'Meta Title (voliteľné)',
          description: 'Ak je prázdne, použije sa názov článku. Pre SEO 50–60 znakov.',
        }),
        slug: fields.slug({
          name: { label: 'URL Slug' },
        }),
        seoDescription: fields.text({
          label: 'SEO Popis',
          description: 'Meta description pre vyhľadávače. Odporúčaných 120–160 znakov.',
          validation: { isRequired: true, length: { max: 160 } },
          multiline: true,
        }),
        keywords: fields.text({
          label: 'Kľúčové slová',
          description: 'Oddelené čiarkou, napr: bolesť chrbta, chiropraktik Košice',
        }),

        // SEO Focus Keyword
        focusKeyword: fields.text({
          label: '🎯 Focus Keyword',
          description: 'Hlavné kľúčové slovo pre SEO. Uisti sa, že je v názve a popise.',
        }),

        // Advanced SEO (noIndex, schema type) – optional; allows existing content with this key to validate
        advancedSeo: fields.object({
          noIndex: fields.checkbox({
            label: 'No Index',
            description: 'Ak zapnuté, vyhľadávače nebudú stránku indexovať.',
            defaultValue: false,
          }),
          schemaType: fields.text({
            label: 'Schema.org typ',
            description: 'Napr. Article, NewsArticle',
            defaultValue: 'Article',
          }),
        }, { label: 'Rozšírené SEO', description: 'Voliteľné nastavenia pre indexovanie a štruktúrované dáta.' }),

        // Reading Time (manual for now, auto-calculated on frontend)
        readingTimeMinutes: fields.integer({
          label: '⏱️ Čas čítania (min)',
          description: 'Odhadovaný čas čítania v minútach',
          defaultValue: 5,
          validation: { min: 1, max: 60 },
        }),

        // Media
        coverImage: fields.image({
          label: 'Titulný obrázok',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        coverImageAlt: fields.text({
          label: 'Alt text obrázka',
          description: 'Popis obrázka pre prístupnosť',
        }),

        // Publishing
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

        // Categories
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

        // Content
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

    // Digital Business Cards Collection
    digitalCards: collection({
      label: 'Digitálne Vizitky',
      slugField: 'brandName', // Using brandName as the slug base
      path: 'src/content/digital-cards/*',
      format: { contentField: 'bio' },
      schema: {
        brandName: fields.slug({ name: { label: 'Názov Brandu/Firmy' } }),
        personName: fields.text({ label: 'Meno a Priezvisko' }),
        jobTitle: fields.text({ label: 'Pracovná pozícia' }),
        bio: fields.mdx({
          label: 'Krátke Bio / Motto',
          options: {
            bold: true,
            italic: true,
          }
        }),

        // Media
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

        // Links
        links: fields.object({
          instagramUrl: fields.text({ label: 'Instagram URL' }),
          aboutUrl: fields.text({ label: 'O nás / Info URL' }),
          phone: fields.text({ label: 'Telefónne číslo' }),
          webUrl: fields.text({ label: 'Webstránka URL' }),
        }, { label: 'Odkazy a Kontakty' }),

        // vCard Data
        vCard: fields.object({
          fullName: fields.text({ label: 'FN (Full Name for vCard)' }),
          organization: fields.text({ label: 'Organizácia' }),
          title: fields.text({ label: 'Titul/Pozícia' }),
          phone: fields.text({ label: 'Telefón' }),
          url: fields.text({ label: 'URL pre vizitku' }),
        }, { label: 'Dáta pre uloženie kontaktu (vCard)' }),

        // AI Assistant
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

    // Testimonials Collection
    testimonials: collection({
      label: 'Recenzie',
      slugField: 'author',
      path: 'src/content/testimonials/*',
      schema: {
        author: fields.slug({
          name: { label: 'Meno klienta' },
        }),
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
  },
});
