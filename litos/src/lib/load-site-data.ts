import fs from 'node:fs'
import path from 'node:path'

import { siteSchema, type SiteData } from './site-schema'
import { defaultSiteLocale, siteLocales, type SiteLocale } from './i18n'

export { siteLocales }
export type { SiteLocale }

function resolveSiteDataPath(locale: SiteLocale): string {
  return path.resolve('src/content/site', `${locale}.json`)
}

export function loadSiteData(locale: SiteLocale = defaultSiteLocale): SiteData {
  const raw = fs.readFileSync(resolveSiteDataPath(locale), 'utf8')
  return siteSchema.parse(JSON.parse(raw))
}
