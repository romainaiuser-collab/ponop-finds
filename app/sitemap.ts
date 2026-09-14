import type { MetadataRoute } from "next";

const collectionUrls = [
  "https://finds.ponop.io/finds/most-wanted",
  "https://finds.ponop.io/finds/back-to-school",
  "https://finds.ponop.io/finds/smart-home",
  "https://finds.ponop.io/finds/halloween",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://finds.ponop.io",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...collectionUrls.map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
