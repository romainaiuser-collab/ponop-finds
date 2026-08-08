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
  categories: unknown;
  affiliateLink: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
}