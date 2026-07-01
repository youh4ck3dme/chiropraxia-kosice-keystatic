import { defineCollection, z } from 'astro:content';

const optionalString = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : ''),
  z.string()
);

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: optionalString.default('Článok'),
    metaTitle: z.string().optional(),
    seoDescription: optionalString.default(''),
    keywords: z.string().optional(),
    focusKeyword: z.string().optional(),
    advancedSeo: z
      .object({
        noIndex: z.boolean().optional().default(false),
        schemaType: z.string().optional().default('Article'),
      })
      .optional(),
    readingTimeMinutes: z.preprocess((value) => {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return 5;
      return Math.min(60, Math.max(1, Math.round(parsed)));
    }, z.number()).optional().default(5),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    publishDate: z.preprocess((value) => {
      if (!value) return new Date();
      const parsed = new Date(value as string);
      return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    }, z.date()).optional().default(() => new Date()),
    author: z.string().optional().default('Dr. Martin Kováč'),
    category: z.string().optional().default('general'),
    status: z.preprocess(
      (value) => (value === 'draft' ? 'draft' : 'published'),
      z.enum(['published', 'draft'])
    ).optional().default('published'),
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

const servicesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string().optional(),
    name: z.string(),
    description: z.string(),
    duration_min: z.number().int().min(0),
    price: z.number().nonnegative(),
    sort_order: z.number().int().default(0),
    isActive: z.boolean().default(true),
    isExpress: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
  testimonials: testimonialsCollection,
  'digital-cards': digitalCardsCollection,
  settings: settingsCollection,
  services: servicesCollection,
};
