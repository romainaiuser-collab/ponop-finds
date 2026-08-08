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
}