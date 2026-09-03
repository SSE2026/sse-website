import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/dashboard/"],
      },
    ],
    sitemap: "https://sse-website.vercel.app/sitemap.xml",
  };
}
