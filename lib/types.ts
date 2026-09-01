export interface Tool {
  id: string;
  name: string;
  hook: string;
  readingTime: string;
}

export interface PublishedTool {
  id: string;
  contentId: string | null;
  title: string | null;
  creativePunchline: string | null;
  hook: string | null;
  description: string | null;
  summary: string | null;
  editorialStory: string | null;
  keyBenefits: unknown;
  recommendedFor: unknown;
  categories: unknown;
  idealFor: string | null;
  notIdealFor: string | null;
  affiliateLink: string | null;
  imageUrl: string | null;
  altText: string | null;
  publishedAt: string | null;
  isMostWanted: boolean;
  collections: string[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface KitProduct {
  id: string;
  title: string | null;
  affiliateLink: string | null;
  imageUrl: string | null;
  price: number | null;
  currency: string | null;
  position: number | null;
  role: string | null;
  reason: string | null;
}


/* =================================
====== Section dédiée aux Kits ===== 
===================================*/

export interface PublishedKit {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;

  collection: string | null;
  theme: string | null;
  audience: string | null;
  useCase: string | null;
  angle: string | null;

  title: string | null;
  hook: string | null;
  summary: string | null;
  editorialStory: string | null;
  keyBenefits: unknown;
  recommendedFor: unknown;
  categories: unknown;
  idealFor: string | null;
  notIdealFor: string | null;
  creativePunchline: string | null;

  imageUrl: string | null;
  altText: string | null;

  products: KitProduct[];

  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
