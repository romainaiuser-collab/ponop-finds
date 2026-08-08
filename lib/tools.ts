import { supabase } from "./supabase";
import type { PublishedTool } from "./types";
const CLOUDFRONT_DOMAIN = "https://d4m1kl32en8mq.cloudfront.net";

export async function getPublishedTools(): Promise<PublishedTool[]> {
  const { data, error } = await supabase
    .from("v_website_publications_ready")
    .select("*");

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

function getPublicImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("s3://ponop-ai-assets/")) {
    const path = imageUrl.replace("s3://ponop-ai-assets/", "");
    return `${CLOUDFRONT_DOMAIN}/${path}`;
  }

  return imageUrl;
}

return (data ?? []).map((publication) => ({
  id: publication.id,
  contentId: publication.content_id,
  title: publication.title ?? null,
  hook: publication.hook ?? null,
  description: publication.description ?? null,
  summary: publication.summary ?? null,
  editorialStory: publication.editorial_story ?? null,
  keyBenefits: publication.key_benefits ?? null,
  recommendedFor: publication.recommended_for ?? null,
  categories: publication.categories ?? null,
  idealFor: publication.ideal_for ?? null,
  notIdealFor: publication.not_ideal_for ?? null,
  affiliateLink: publication.affiliate_link ?? null,
  altText: publication.alt_text ?? null,
  publishedAt: publication.published_at ?? null,
  imageUrl: getPublicImageUrl(publication.image_url),
}));
}