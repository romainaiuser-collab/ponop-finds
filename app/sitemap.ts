import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://finds.ponop.io",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
