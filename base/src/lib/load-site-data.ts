import fs from "node:fs";
import path from "node:path";

import { siteSchema, type SiteData } from "./site-schema";

const siteDataPath = path.resolve("src/content/site.json");

export function loadSiteData(): SiteData {
  const raw = fs.readFileSync(siteDataPath, "utf8");
  return siteSchema.parse(JSON.parse(raw));
}
