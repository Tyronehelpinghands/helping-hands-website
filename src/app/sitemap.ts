import type { MetadataRoute } from "next";
import { getAllLocations } from "@/data/locations";
import { getAllProjectCases } from "@/data/projectCases";
import { getPublishedServiceLandings } from "@/lib/services";
import {
  getAllSeoLocationPages,
  getAllServicePages,
  getAllWorkPages,
} from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

const marketingRoutes = [
  "/",
  "/personeel-inhuren",
  "/diensten",
  "/opdrachtgevers",
  "/werken-bij",
  "/vacatures",
  "/projecten",
  "/locaties",
  "/over-ons",
  "/contact",
  "/algemene-voorwaarden",
] as const;

/** Old /diensten landings that permanently redirect — omit from sitemap. */
const redirectedDienstenSlugs = new Set([
  "event-crew",
  "stagehands",
  "horeca-personeel",
  "barpersoneel",
  "keukenpersoneel",
  "productie-assistentie",
  "logistiek",
  "hospitality",
]);

/** /locaties slugs that redirect to root SEO URLs — omit duplicates. */
const redirectedLocatieSlugs = new Set([
  "event-crew-amsterdam",
  "event-crew-utrecht",
  "event-crew-rotterdam",
  "event-crew-den-haag",
  "event-crew-hilversum",
  "stagehands-amsterdam",
  "stagehands-utrecht",
  "stagehands-arnhem",
  "horeca-personeel-hilversum",
  "horeca-personeel-amsterdam",
  "horeca-personeel-utrecht",
  "festival-crew-rotterdam",
  "eventpersoneel-den-haag",
]);

/** Build-time XML so /sitemap.xml stays 200 for Googlebot (no on-demand miss). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  const core = marketingRoutes.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/personeel-inhuren" || path === "/diensten"
          ? 0.9
          : 0.8,
  }));

  const servicePages = getAllServicePages()
    .filter((page) => !page.canonicalPath)
    .map((page) => ({
      url: `${base}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  const workPages = getAllWorkPages().map((page) => ({
    url: `${base}${page.path}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const seoLocations = getAllSeoLocationPages().map((page) => ({
    url: `${base}${page.path}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const remainingDiensten = getPublishedServiceLandings()
    .filter((landing) => !redirectedDienstenSlugs.has(landing.slug))
    .map((landing) => ({
      url: `${base}${landing.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const remainingLocaties = getAllLocations()
    .filter((location) => !redirectedLocatieSlugs.has(location.slug))
    .map((location) => ({
      url: `${base}${location.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const projectCases = getAllProjectCases().map((item) => ({
    url: `${base}/projecten/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...core,
    ...servicePages,
    ...workPages,
    ...seoLocations,
    ...remainingDiensten,
    ...remainingLocaties,
    ...projectCases,
  ];
}
