import { z } from "zod";

export const siteSchema = z.object({
  title: z.string().trim().min(1).max(255),
  faviconHref: z.string().trim().min(1).optional(),
  faviconContentType: z.string().trim().min(1).optional(),
});

export type SiteData = z.infer<typeof siteSchema>;
