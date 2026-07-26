import type { MetadataRoute } from "next";
import { getPublishedServiceLandings } from "@/lib/services";
import { siteConfig } from "@/lib/siteConfig";

const marketingRoutes = [
  "/",
  "/diensten",
  "/opdrachtgevers",
  "/medewerkers",
  "/vacatures",
  "/projecten",
  "/over-ons",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const base = siteConfig.url.replace(/\/$/, "");

  const core = marketingRoutes.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : path === "/diensten" ? 0.9 : 0.8,
  }));

  const landings = getPublishedServiceLandings().map((landing) => ({
    url: `${base}${landing.path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...core, ...landings];
}
