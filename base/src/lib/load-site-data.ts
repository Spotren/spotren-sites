import fs from "node:fs";
import path from "node:path";

import { siteSchema, type SiteData } from "./site-schema";

export const siteLocales = ["en", "pt-BR", "es"] as const;

export type SiteLocale = (typeof siteLocales)[number];

const defaultSiteLocale: SiteLocale = "en";

function resolveSiteDataPath(locale: SiteLocale): string {
  return path.resolve("src/content/site", `${locale}.json`);
}

export function loadSiteData(locale: SiteLocale = defaultSiteLocale): SiteData {
  const raw = fs.readFileSync(resolveSiteDataPath(locale), "utf8");
  return siteSchema.parse(JSON.parse(raw));
}
