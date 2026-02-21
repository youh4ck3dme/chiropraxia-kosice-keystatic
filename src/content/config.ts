import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(10).max(120),
    metaTitle: z.string().optional(),
    seoDescription: z.string().min(1).max(160),
    keywords: z.string().optional(),
    focusKeyword: z.string().optional(),
    advancedSeo: z
      .object({
        noIndex: z.boolean().optional().default(false),
        schemaType: z.string().optional().default('Article'),
      })
      .optional(),
    readingTimeMinutes: z.number().min(1).max(60).optional().default(5),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    publishDate: z.date(),
    author: z.string().default('Dr. Martin Kováč'),
    category: z.enum(['back-pain', 'headache', 'prevention', 'rehabilitation', 'general']).default('general'),
    status: z.enum(['published', 'draft']).default('published'),
  }),
});

const testimonialsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    author: z.string(),
    text: z.string(),
    rating: z.number().min(1).max(5),
    service: z.string().optional(),
    date: z.date(),
    isVisible: z.boolean().default(true),
  }),
});

const digitalCardsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    brandName: z.string(),
    personName: z.string(),
    jobTitle: z.string(),
    // bio is handled as contentField
    avatar: z.string().optional(),
    coverImage: z.string().optional(),
    links: z.object({
      instagramUrl: z.string().optional(),
      aboutUrl: z.string().optional(),
      phone: z.string().optional(),
      webUrl: z.string().optional(),
    }),
    vCard: z.object({
      fullName: z.string(),
      organization: z.string().optional(),
      title: z.string().optional(),
      phone: z.string().optional(),
      url: z.string().optional(),
    }),
    aiAssistant: z.object({
      enabled: z.boolean().default(true),
      prompt: z.string().optional(),
    }),
  }),
});

const settingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    companyInfo: z.object({
      name: z.string(),
      phone: z.string(),
      email: z.string(),
      address: z.string(),
      instagramUrl: z.string().optional(),
      facebookUrl: z.string().optional(),
    }),
    openingHours: z.object({
      monday: z.string(),
      tuesday: z.string(),
      wednesday: z.string(),
      thursday: z.string(),
      friday: z.string(),
      saturday: z.string(),
      sunday: z.string(),
    }),
  }),
});

export const collections = {
  blog: blogCollection,
  testimonials: testimonialsCollection,
  'digital-cards': digitalCardsCollection,
  settings: settingsCollection,
};


