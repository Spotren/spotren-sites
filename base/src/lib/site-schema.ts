import { z } from "zod";

const textSectionSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
  items: z.array(z.string().trim().min(1)).optional(),
});

const stepItemSchema = z.object({
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

export const siteSchema = z.object({
  title: z.string().trim().min(1).max(255),
  seoTitle: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(320),
  faviconHref: z.string().trim().min(1).optional(),
  faviconContentType: z.string().trim().min(1).optional(),
  header: z.object({
    eyebrow: z.string().trim().min(1),
    navAriaLabel: z.string().trim().min(1),
    navItems: z.array(
      z.object({
        href: z.string().trim().min(1),
        label: z.string().trim().min(1),
      }),
    ).min(1),
  }),
  sections: z.object({
    testimonials: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      items: z.array(
        z.object({
          headline: z.string().trim().min(1),
          quote: z.string().trim().min(1),
          avatar: z.string().trim().min(1),
          name: z.string().trim().min(1),
          role: z.string().trim().min(1),
          rating: z.number().int().min(1).max(5),
        }),
      ).min(1),
    }),
    mirror: textSectionSchema.extend({
      listTitle: z.string().trim().min(1),
      speaker: z.object({
        name: z.string().trim().min(1),
        role: z.string().trim().min(1),
        avatar: z.string().trim().min(1),
      }),
    }),
    diagnosis: textSectionSchema,
    howWorks: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      body: z.string().trim().min(1),
      items: z.array(stepItemSchema).length(3),
    }),
    deliverables: textSectionSchema,
    icp: textSectionSchema,
    anchorVal: textSectionSchema,
    priceBuy: textSectionSchema.extend({
      listTitle: z.string().trim().min(1),
      pricing: z.object({
        currency: z.string().trim().min(1),
        amount: z.string().trim().min(1),
        period: z.string().trim().min(1),
      }),
      cta: z.object({
        href: z.string().trim().min(1),
        label: z.string().trim().min(1),
      }),
    }),
    costInaction: textSectionSchema.extend({
      bodyTitle: z.string().trim().min(1),
    }),
    creator: textSectionSchema.extend({
      figure: z.object({
        src: z.string().trim().min(1),
        alt: z.string().trim().min(1),
        caption: z.string().trim().min(1),
      }),
      entity: z.object({
        name: z.string().trim().min(1),
        description: z.string().trim().min(1),
        image: z.string().trim().min(1),
      }),
    }),
    faqCta: textSectionSchema,
    contact: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      lines: z.array(z.string().trim().min(1)).min(1),
    }),
  }),
  footer: z.object({
    text: z.string().trim().min(1),
  }),
});

export type SiteData = z.infer<typeof siteSchema>;
