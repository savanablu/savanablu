import type { MetadataRoute } from "next";

const baseUrl = "https://savanablu.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
