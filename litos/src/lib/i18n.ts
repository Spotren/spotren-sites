export const siteLocales = ['en', 'pt'] as const

export type SiteLocale = (typeof siteLocales)[number]

export const siteLocaleOptions: ReadonlyArray<{
  value: SiteLocale
  label: string
  shortLabel: string
}> = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'pt', label: 'Portuguese', shortLabel: 'PT' },
] as const

export const defaultSiteLocale: SiteLocale = 'en'

export function isSiteLocale(value: string | undefined): value is SiteLocale {
  return value === 'en' || value === 'pt'
}

export function getLocaleFromPathname(pathname: string): SiteLocale {
  if (pathname === '/pt' || pathname.startsWith('/pt/')) {
    return 'pt'
  }

  return defaultSiteLocale
}

export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)
  if (locale === defaultSiteLocale) {
    return pathname
  }

  const stripped = pathname.replace(`/${locale}`, '')
  return stripped.length > 0 ? stripped : '/'
}

export function withLocalePath(locale: SiteLocale, pathname = '/'): string {
  const normalized = pathname === '' ? '/' : pathname.startsWith('/') ? pathname : `/${pathname}`

  if (locale === defaultSiteLocale) {
    return normalized
  }

  if (normalized === '/') {
    return `/${locale}`
  }

  return `/${locale}${normalized}`
}
