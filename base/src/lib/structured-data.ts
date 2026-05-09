import type { SiteLocale } from "./load-site-data";
import type { SiteData } from "./site-schema";

type JsonLdNode = Record<string, unknown>;

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ");
}

function normalizeText(value: string): string {
  return stripTags(value).replace(/\s+/g, " ").trim();
}

function joinUrl(baseUrl: string | undefined, pathname: string): string | undefined {
  if (!baseUrl) {
    return undefined;
  }

  return new URL(pathname, baseUrl).toString();
}

function getLocalePath(locale: SiteLocale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

function getCurrencyCode(symbol: string): string {
  if (symbol === "R$") {
    return "BRL";
  }

  if (symbol === "$") {
    return "USD";
  }

  return symbol;
}

function parseContactDetails(lines: string[]) {
  const normalized = lines.map(normalizeText);
  const name = normalized[0] ?? "";
  const streetLine = normalized[1] ?? "";
  const localityLine = normalized[2] ?? "";
  const phoneLine = normalized[3] ?? "";

  const streetMatch = streetLine.match(/^(.*?),\s*([0-9]+)\s*-\s*(.*)$/);
  const localityMatch = localityLine.match(/^(.*?)\s*-\s*([A-Z]{2}),\s*([\d-]+)$/);

  const telephone = phoneLine.replace(/^[^:]+:\s*/, "").trim();
  const telephoneHref = telephone.replace(/[^\d+]/g, "");

  return {
    name,
    streetAddress: streetMatch ? `${streetMatch[1]}, ${streetMatch[2]}` : streetLine,
    neighborhood: streetMatch ? streetMatch[3] : undefined,
    addressLocality: localityMatch ? localityMatch[1] : localityLine,
    addressRegion: localityMatch ? localityMatch[2] : undefined,
    postalCode: localityMatch ? localityMatch[3] : undefined,
    telephone,
    telephoneHref,
  };
}

function buildPostalAddress(contact: ReturnType<typeof parseContactDetails>) {
  return {
    "@type": "PostalAddress",
    streetAddress: contact.streetAddress,
    addressLocality: contact.addressLocality,
    addressRegion: contact.addressRegion,
    postalCode: contact.postalCode,
    addressCountry: "BR",
  };
}

export function buildStructuredData(params: {
  baseUrl?: string;
  locale: SiteLocale;
  site: SiteData;
}): JsonLdNode {
  const { baseUrl, locale, site } = params;
  const pageUrl = joinUrl(baseUrl, getLocalePath(locale));
  const logoUrl = joinUrl(baseUrl, site.sections.creator.entity.image);
  const serviceImageUrl = joinUrl(baseUrl, site.sections.creator.figure.src);
  const founderImageUrl = joinUrl(baseUrl, site.sections.creator.profile.figure.src);
  const sameAs = site.header.navItems
    .map((item) => item.href)
    .filter((href) => href.startsWith("http://") || href.startsWith("https://"));
  const contact = parseContactDetails(site.footer.lines);
  const address = buildPostalAddress(contact);
  const monthlyPlan = site.sections.priceBuy.plans[0];
  const offerUrl = pageUrl ?? "#price-buy";

  const organization: JsonLdNode = {
    "@type": "Organization",
    "@id": pageUrl ? `${pageUrl}#organization` : "#organization",
    name: site.sections.creator.entity.name,
    description: normalizeText(site.sections.creator.entity.description),
    logo: logoUrl,
    image: logoUrl,
    sameAs,
    address,
    telephone: contact.telephone,
  };

  if (pageUrl) {
    organization.url = pageUrl;
  }

  const professionalService: JsonLdNode = {
    "@type": "ProfessionalService",
    "@id": pageUrl ? `${pageUrl}#professional-service` : "#professional-service",
    name: site.sections.creator.entity.name,
    description: normalizeText(site.sections.creator.entity.description),
    areaServed: contact.addressLocality,
    address,
    telephone: contact.telephone,
    image: serviceImageUrl ?? founderImageUrl ?? logoUrl,
    priceRange: `${monthlyPlan.currency} ${monthlyPlan.amount}+`,
    sameAs,
    parentOrganization: {
      "@id": organization["@id"],
    },
  };

  if (pageUrl) {
    professionalService.url = pageUrl;
  }

  const offer: JsonLdNode = {
    "@type": "Offer",
    "@id": pageUrl ? `${pageUrl}#offer` : "#offer",
    price: monthlyPlan.amount.replace(/\./g, "").replace(",", "."),
    priceCurrency: getCurrencyCode(monthlyPlan.currency),
    description: normalizeText((site.sections.priceBuy.items ?? []).join(" ")),
    availability: "https://schema.org/InStock",
    url: offerUrl,
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@id": organization["@id"],
    },
  };

  const service: JsonLdNode = {
    "@type": "Service",
    "@id": pageUrl ? `${pageUrl}#service` : "#service",
    name: normalizeText(site.sections.creator.entity.description),
    description: normalizeText(site.sections.deliverables.body),
    serviceType: "Website creation optimized for SEO, AEO and GEO",
    provider: {
      "@id": professionalService["@id"],
    },
    areaServed: contact.addressLocality,
    audience: {
      "@type": "Audience",
      audienceType: normalizeText(site.sections.icp.title),
    },
    offers: {
      "@id": offer["@id"],
    },
  };

  const product: JsonLdNode = {
    "@type": "Product",
    "@id": pageUrl ? `${pageUrl}#product` : "#product",
    name: normalizeText(site.title),
    description: normalizeText(site.description),
    brand: {
      "@id": organization["@id"],
    },
    image: serviceImageUrl ?? logoUrl,
    category: "Website service for local businesses",
    offers: {
      "@id": offer["@id"],
    },
  };

  const faqPage: JsonLdNode = {
    "@type": "FAQPage",
    "@id": pageUrl ? `${pageUrl}#faq` : "#faq",
    inLanguage: locale,
    mainEntity: site.sections.faqCta.items.map((item) => ({
      "@type": "Question",
      name: normalizeText(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: normalizeText(item.answer),
      },
    })),
  };

  const webSite: JsonLdNode = {
    "@type": "WebSite",
    "@id": pageUrl ? `${pageUrl}#website` : "#website",
    name: site.sections.creator.entity.name,
    headline: normalizeText(site.seoTitle),
    description: normalizeText(site.description),
    inLanguage: locale,
    publisher: {
      "@id": organization["@id"],
    },
  };

  if (pageUrl) {
    webSite.url = pageUrl;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      professionalService,
      service,
      offer,
      product,
      faqPage,
      webSite,
    ],
  };
}
