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

const faqItemSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
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
    offer: z.object({
      title: z.string().trim().min(1),
      body: z.string().trim().min(1),
      price: z.object({
        currency: z.string().trim().min(1),
        amount: z.string().trim().min(1),
        period: z.string().trim().min(1),
      }),
    }),
  }),
  sections: z.object({
    testimonials: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      reviewCount: z.number().int().min(1),
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
      result: z.object({
        value: z.string().trim().min(1),
        body: z.string().trim().min(1),
      }),
      speaker: z.object({
        name: z.string().trim().min(1),
        role: z.string().trim().min(1),
        avatar: z.string().trim().min(1),
      }),
    }),
    diagnosis: textSectionSchema.extend({
      afterList: z.string().trim().min(1),
      opportunity: z.object({
        title: z.string().trim().min(1),
        paragraphs: z.array(z.string().trim().min(1)).length(2),
      }),
    }),
    howWorks: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      body: z.string().trim().min(1),
      callout: z.object({
        title: z.string().trim().min(1),
        body: z.string().trim().min(1),
      }),
      items: z.array(stepItemSchema).length(3),
    }),
    deliverables: textSectionSchema.extend({
      callout: z.object({
        title: z.string().trim().min(1),
        body: z.string().trim().min(1),
      }),
    }),
    icp: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      body: z.string().trim().min(1),
      figure: z.object({
        src: z.string().trim().min(1),
        alt: z.string().trim().min(1),
      }),
      items: z.array(
        z.object({
          text: z.string().trim().min(1),
          className: z.string().trim().min(1).optional(),
        }),
      ).min(1),
    }),
    anchorVal: textSectionSchema,
    priceBuy: textSectionSchema.extend({
      listTitle: z.string().trim().min(1),
      speaker: z.object({
        name: z.string().trim().min(1),
        role: z.string().trim().min(1),
        avatar: z.string().trim().min(1),
      }),
      paymentLabels: z.object({
        pixLabel: z.string().trim().min(1),
        cardLabel: z.string().trim().min(1),
        secureLabel: z.string().trim().min(1),
      }),
      economyLabel: z.string().trim().min(1),
      plans: z.array(
        z.object({
          id: z.string().trim().min(1),
          cardClass: z.string().trim().min(1).optional(),
          label: z.string().trim().min(1),
          currency: z.string().trim().min(1),
          amount: z.string().trim().min(1),
          period: z.string().trim().min(1),
          items: z.array(z.string().trim().min(1)).min(1),
          ctaLabel: z.string().trim().min(1),
          ctaHref: z.string().trim().min(1),
        }),
      ).length(3),
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
      profile: z.object({
        name: z.string().trim().min(1),
        figure: z.object({
          src: z.string().trim().min(1),
          alt: z.string().trim().min(1),
          caption: z.string().trim().min(1),
        }),
        paragraphs: z.array(z.string().trim().min(1)).length(2),
      }),
      entity: z.object({
        name: z.string().trim().min(1),
        description: z.string().trim().min(1),
        image: z.string().trim().min(1),
      }),
    }),
    faqCta: z.object({
      id: z.string().trim().min(1),
      title: z.string().trim().min(1),
      body: z.string().trim().min(1),
      items: z.array(faqItemSchema).min(1),
    }),
  }),
  footer: z.object({
    text: z.string().trim().min(1),
    lines: z.array(z.string().trim().min(1)).min(1),
  }),
});

export type SiteData = z.infer<typeof siteSchema>;
