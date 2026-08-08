import { supabase } from "./supabase";
import type { PublishedTool } from "./types";

const PONOP_TOOLS_PLATFORM_ID =
  "21f3b9f9-919b-44c4-8993-05d356233dfe";

export async function getPublishedTools(): Promise<PublishedTool[]> {
  const { data, error } = await supabase
    .from("publications")
    .select(`
      id,
      content_id,
      image_url,
      published_at,
      status,
      contents (
        id,
        opportunity_id,
        title,
        hook,
        description,
        summary,
        categories,
        affiliate_link
      )
    `)
    .eq("platform_id", PONOP_TOOLS_PLATFORM_ID)
    .eq("status", "ready to publish");

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return (data ?? []).map((publication) => {
    const content = Array.isArray(publication.contents)
      ? publication.contents[0]
      : publication.contents;

    return {
      id: publication.id,
      contentId: publication.content_id,
      title: content?.title ?? null,
      hook: content?.hook ?? null,
      description: content?.description ?? null,
      summary: content?.summary ?? null,
      categories: content?.categories ?? null,
      affiliateLink: content?.affiliate_link ?? null,
      imageUrl: publication.image_url ?? null,
      publishedAt: publication.published_at ?? null,
    };
  });
}