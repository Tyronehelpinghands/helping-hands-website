import { getAllSeoLocationPages } from "@/lib/seo/locationPages";
import {
  getAllServicePages,
  getServicePage,
  SERVICE_SYNONYM_CANONICAL,
} from "@/lib/seo/servicePages";
import type { SeoRelatedLink } from "@/lib/seo/types";
import { getAllWorkPages, getWorkPage } from "@/lib/seo/workPages";

const DIENSTEN_CANONICAL: Record<string, string> = {
  "event-crew": "/personeel-inhuren/event-crew",
  stagehands: "/personeel-inhuren/stagehands",
  "horeca-personeel": "/personeel-inhuren/horeca-personeel",
  barpersoneel: "/personeel-inhuren/barpersoneel",
  keukenpersoneel: "/personeel-inhuren/keukenhulp",
  "productie-assistentie": "/personeel-inhuren/productie-assistenten",
  logistiek: "/personeel-inhuren/logistiek-personeel",
  hospitality: "/personeel-inhuren/hospitality-personeel",
};

/** Rewrite synonym and old /diensten landings to the URL Google should index. */
export function canonicalizeInternalHref(href: string): string {
  const [path, query] = href.split("?");
  const suffix = query ? `?${query}` : "";

  const serviceMatch = path.match(/^\/personeel-inhuren\/([^/]+)\/?$/);
  if (serviceMatch) {
    const canonical = SERVICE_SYNONYM_CANONICAL[serviceMatch[1]];
    if (canonical) return `${canonical}${suffix}`;
  }

  const dienstenMatch = path.match(/^\/diensten\/([^/]+)\/?$/);
  if (dienstenMatch) {
    const canonical = DIENSTEN_CANONICAL[dienstenMatch[1]];
    if (canonical) return `${canonical}${suffix}`;
  }

  return href;
}

function canonicalizeRelatedLinks(links: SeoRelatedLink[]): SeoRelatedLink[] {
  return links.map((link) => ({
    ...link,
    href: canonicalizeInternalHref(link.href),
  }));
}

export function relatedForService(slug: string): SeoRelatedLink[] {
  const page = getServicePage(slug);
  if (!page) return [];

  const fromPage = canonicalizeRelatedLinks(page.relatedPages).slice(0, 4);
  const locations = getAllSeoLocationPages()
    .filter((location) => location.serviceSlug === slug)
    .slice(0, 2)
    .map((location) => ({
      href: location.path,
      label: `${page.title.replace(" inhuren", "")} ${location.city}`,
    }));

  const work = getAllWorkPages()
    .filter((item) => item.relatedServiceSlug === slug)
    .slice(0, 1)
    .map((item) => ({ href: item.path, label: item.title }));

  return [
    ...fromPage,
    ...locations,
    ...work,
    { href: "/werken-bij", label: "Werken bij Helping Hands Agency" },
    { href: "/vacatures", label: "Open vacatures" },
  ].slice(0, 8);
}

export function relatedForWork(slug: string): SeoRelatedLink[] {
  const page = getWorkPage(slug);
  if (!page) return [];

  const service = getServicePage(page.relatedServiceSlug);
  const otherWork = getAllWorkPages()
    .filter((item) => item.slug !== slug)
    .slice(0, 4)
    .map((item) => ({ href: item.path, label: item.title }));

  return [
    ...(service
      ? [{ href: service.canonicalPath ?? service.path, label: service.title }]
      : []),
    ...otherWork,
    { href: "/werken-bij", label: "Werken bij Helping Hands Agency" },
    { href: "/vacatures", label: "Bekijk vacatures" },
    { href: "/personeel-inhuren", label: "Personeel inhuren (opdrachtgevers)" },
  ].slice(0, 8);
}

export function relatedForLocation(slug: string): SeoRelatedLink[] {
  const location = getAllSeoLocationPages().find((item) => item.slug === slug);
  if (!location) return [];

  const service = getServicePage(location.serviceSlug);
  const siblingLocations = getAllSeoLocationPages()
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => ({
      href: item.path,
      label: `${item.serviceLabel} ${item.city}`,
    }));

  const relatedServices = getAllServicePages()
    .filter((item) => !item.canonicalPath && item.slug !== location.serviceSlug)
    .slice(0, 2)
    .map((item) => ({ href: item.path, label: item.title }));

  return [
    ...(service
      ? [{ href: service.canonicalPath ?? service.path, label: service.title }]
      : []),
    ...siblingLocations,
    ...relatedServices,
    { href: "/personeel-inhuren", label: "Alle personeel inhuren" },
    { href: "/contact?type=personeel-aanvragen", label: "Personeel aanvragen" },
  ].slice(0, 8);
}

export function hubServiceLinks(): SeoRelatedLink[] {
  return getAllServicePages()
    .filter((page) => !page.canonicalPath)
    .map((page) => ({
      href: page.path,
      label: page.title,
    }));
}

export function hubWorkLinks(): SeoRelatedLink[] {
  return getAllWorkPages().map((page) => ({
    href: page.path,
    label: page.title,
  }));
}

export function hubLocationLinks(): SeoRelatedLink[] {
  return getAllSeoLocationPages().map((page) => ({
    href: page.path,
    label: `${page.serviceLabel} ${page.city}`,
  }));
}
