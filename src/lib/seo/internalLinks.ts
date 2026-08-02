import { getAllSeoLocationPages } from "@/lib/seo/locationPages";
import { getAllServicePages, getServicePage } from "@/lib/seo/servicePages";
import type { SeoRelatedLink } from "@/lib/seo/types";
import { getAllWorkPages, getWorkPage } from "@/lib/seo/workPages";

export function relatedForService(slug: string): SeoRelatedLink[] {
  const page = getServicePage(slug);
  if (!page) return [];

  const fromPage = page.relatedPages.slice(0, 4);
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
    { href: "/werken-bij", label: "Werken bij Helping Hands" },
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
      ? [{ href: service.path, label: service.title }]
      : []),
    ...otherWork,
    { href: "/werken-bij", label: "Werken bij Helping Hands" },
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
    .filter((item) => item.slug !== location.serviceSlug)
    .slice(0, 2)
    .map((item) => ({ href: item.path, label: item.title }));

  return [
    ...(service ? [{ href: service.path, label: service.title }] : []),
    ...siblingLocations,
    ...relatedServices,
    { href: "/personeel-inhuren", label: "Alle personeel inhuren" },
    { href: "/contact?type=personeel-aanvragen", label: "Personeel aanvragen" },
  ].slice(0, 8);
}

export function hubServiceLinks(): SeoRelatedLink[] {
  return getAllServicePages().map((page) => ({
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
