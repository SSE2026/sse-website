import type { MetadataRoute } from "next";
import { newsItems } from "@/data/news";
import { SERIES_ORDER, seriesProfiles } from "@/data/products";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const seriesRoutes: MetadataRoute.Sitemap = SERIES_ORDER.map((id) => ({
    url: `${SITE_URL}/products/${seriesProfiles[id].slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...seriesRoutes,
    { url: `${SITE_URL}/technology`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/solutions/low-altitude`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/solutions/embodied-ai`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/solutions/marine`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/solutions/special-ops`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const newsRoutes: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}
