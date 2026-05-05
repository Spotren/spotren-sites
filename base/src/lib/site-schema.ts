import { z } from "zod";

const textSectionSchema = z.object({
  id: z.string().trim().min(1),
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
      articles: z.array(
        z.object({
          title: z.string().trim().min(1),
          body: z.string().trim().min(1),
        }),
      ).min(1),
    }),
    mirror: textSectionSchema,
    diagnosis: textSectionSchema,
    howWorks: textSectionSchema,
    deliverables: textSectionSchema,
    icp: textSectionSchema,
    anchorVal: textSectionSchema,
    priceBuy: textSectionSchema,
    costInaction: textSectionSchema,
    creator: textSectionSchema,
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
