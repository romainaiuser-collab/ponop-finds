import { supabase } from "./supabase";
import type { PublishedKit } from "./types";

const CLOUDFRONT_DOMAIN =
  "https://d4m1kl32en8mq.cloudfront.net";

function getPublicImageUrl(
  imageUrl: string | null
): string | null {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith(
      "s3://ponop-ai-assets/"
    )
  ) {
    const path = imageUrl.replace(
      "s3://ponop-ai-assets/",
      ""
    );

    return `${CLOUDFRONT_DOMAIN}/${path}`;
  }

  return imageUrl;
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

/*
 * Extract the first keyword from opportunities.keywords.
 *
 * In the database, keywords is stored as JSONB,
 * but its actual value is a comma-separated string.
 */
function getFirstKeyword(
  keywords: unknown
): string | null {
  if (typeof keywords !== "string") {
    return null;
  }

  const firstKeyword = keywords
    .split(",")[0]
    ?.trim();

  return firstKeyword || null;
}

/*
 * Build a PublishedKit from the raw
 * Supabase records.
 */
function buildPublishedKit(
  kit: any,
  contents: any[],
  publications: any[],
  kitItems: any[],
  opportunities: any[]
): PublishedKit {
  const content =
    contents.find(
      (item) =>
        item.kit_id === kit.id
    ) ?? null;

  const publication =
    publications.find(
      (item) =>
        item.kit_id === kit.id
    ) ?? null;

  const items =
    kitItems
      .filter(
        (item) =>
          item.kit_id === kit.id
      )
      .sort(
        (a, b) =>
          (a.position ?? 999) -
          (b.position ?? 999)
      );

  const products = items.map(
    (item) => {
      const opportunity =
        opportunities.find(
          (opportunity) =>
            opportunity.id ===
            item.opportunity_id
        );

      const editorialTitle =
        getFirstKeyword(
          opportunity?.keywords
        );

      return {
        id:
          opportunity?.id ??
          item.id,

        title:
          editorialTitle ??
          opportunity?.title ??
          null,

        affiliateLink:
          opportunity?.affiliate_url ??
          null,

        imageUrl:
          getPublicImageUrl(
            opportunity?.image_url ??
              null
          ),

        price:
          opportunity?.price ??
          null,

        currency:
          opportunity?.currency ??
          null,

        position:
          item.position ??
          null,

        role:
          item.role ??
          null,

        reason:
          item.reason ??
          null,
      };
    }
  );

  return {
    id: kit.id,
    name: kit.name ?? null,
    slug: kit.slug ?? null,
    description:
      kit.description ?? null,
    collection:
      kit.collection ?? null,
    theme:
      kit.theme ?? null,
    audience:
      kit.audience ?? null,
    useCase:
      kit.use_case ?? null,
    angle:
      kit.angle ?? null,
    title:
      content?.title ??
      kit.name ??
      null,
    hook:
      content?.hook ??
      null,
    summary:
      content?.summary ??
      null,
    editorialStory:
      content?.editorial_story ??
      null,
    keyBenefits:
      toArray(
        content?.key_benefits
      ),
    recommendedFor:
      toArray(
        content?.recommended_for
      ),
    categories:
      toArray(
        content?.categories
      ),
    idealFor:
      content?.ideal_for ??
      null,
    notIdealFor:
      content?.not_ideal_for ??
      null,
    creativePunchline:
      content?.creative_punchline ??
      null,
    imageUrl:
      getPublicImageUrl(
        publication?.image_url ??
          null
      ),
    altText:
      content?.alt_text ??
      null,
    products,
    publishedAt:
      publication?.published_at ??
      null,
    createdAt:
      kit.created_at ??
      null,
    updatedAt:
      kit.updated_at ??
      null,
  };
}

export async function getPublishedKits(): Promise<
  PublishedKit[]
> {
  const {
    data: kits,
    error: kitsError,
  } = await supabase
    .from("kits")
    .select("*")
    .eq(
      "status",
      "content and image generated"
    )
    .order("created_at", {
      ascending: false,
    });

  if (kitsError) {
    throw new Error(
      `Supabase kits error: ${kitsError.message}`
    );
  }

  if (!kits || kits.length === 0) {
    return [];
  }

  const kitIds = kits.map(
    (kit) => kit.id
  );

  const {
    data: contents,
    error: contentsError,
  } = await supabase
    .from("kits_contents")
    .select("*")
    .in("kit_id", kitIds)
    .order("created_at", {
      ascending: false,
    });

  if (contentsError) {
    throw new Error(
      `Supabase kits_contents error: ${contentsError.message}`
    );
  }

  const {
    data: publications,
    error: publicationsError,
  } = await supabase
    .from("kits_publications")
    .select("*")
    .in("kit_id", kitIds)
    .not("image_url", "is", null)
    .order("created_at", {
      ascending: false,
    });

  if (publicationsError) {
    throw new Error(
      `Supabase kits_publications error: ${publicationsError.message}`
    );
  }

  const {
    data: kitItems,
    error: kitItemsError,
  } = await supabase
    .from("kits_items")
    .select("*")
    .in("kit_id", kitIds)
    .order("position", {
      ascending: true,
    });

  if (kitItemsError) {
    throw new Error(
      `Supabase kits_items error: ${kitItemsError.message}`
    );
  }

  const opportunityIds = [
    ...new Set(
      (kitItems ?? [])
        .map(
          (item) =>
            item.opportunity_id
        )
        .filter(Boolean)
    ),
  ];

  let opportunities: any[] = [];

  if (opportunityIds.length > 0) {
    const {
      data,
      error,
    } = await supabase
      .from("opportunities")
      .select("*")
      .in("id", opportunityIds);

    if (error) {
      throw new Error(
        `Supabase opportunities error: ${error.message}`
      );
    }

    opportunities = data ?? [];
  }

  return kits.map((kit) =>
    buildPublishedKit(
      kit,
      contents ?? [],
      publications ?? [],
      kitItems ?? [],
      opportunities
    )
  );
}

export async function getPublishedKitBySlug(
  slug: string
): Promise<PublishedKit | null> {
  const {
    data: kit,
    error: kitError,
  } = await supabase
    .from("kits")
    .select("*")
    .eq("slug", slug)
    .eq(
      "status",
      "content and image generated"
    )
    .maybeSingle();

  if (kitError) {
    throw new Error(
      `Supabase kit error: ${kitError.message}`
    );
  }

  if (!kit) {
    return null;
  }

  const {
    data: contents,
    error: contentsError,
  } = await supabase
    .from("kits_contents")
    .select("*")
    .eq("kit_id", kit.id)
    .order("created_at", {
      ascending: false,
    });

  if (contentsError) {
    throw new Error(
      `Supabase kits_contents error: ${contentsError.message}`
    );
  }

  const {
    data: publications,
    error: publicationsError,
  } = await supabase
    .from("kits_publications")
    .select("*")
    .eq("kit_id", kit.id)
    .not("image_url", "is", null)
    .order("created_at", {
      ascending: false,
    });

  if (publicationsError) {
    throw new Error(
      `Supabase kits_publications error: ${publicationsError.message}`
    );
  }

  const {
    data: kitItems,
    error: kitItemsError,
  } = await supabase
    .from("kits_items")
    .select("*")
    .eq("kit_id", kit.id)
    .order("position", {
      ascending: true,
    });

  if (kitItemsError) {
    throw new Error(
      `Supabase kits_items error: ${kitItemsError.message}`
    );
  }

  const opportunityIds = [
    ...new Set(
      (kitItems ?? [])
        .map(
          (item) =>
            item.opportunity_id
        )
        .filter(Boolean)
    ),
  ];

  let opportunities: any[] = [];

  if (opportunityIds.length > 0) {
    const {
      data,
      error,
    } = await supabase
      .from("opportunities")
      .select("*")
      .in("id", opportunityIds);

    if (error) {
      throw new Error(
        `Supabase opportunities error: ${error.message}`
      );
    }

    opportunities = data ?? [];
  }

  return buildPublishedKit(
    kit,
    contents ?? [],
    publications ?? [],
    kitItems ?? [],
    opportunities
  );
}
