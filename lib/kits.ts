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
  /*
   * Latest generated content for this Kit.
   */
  const content =
    contents.find(
      (item) =>
        item.kit_id === kit.id
    ) ?? null;

  /*
   * Latest publication containing an image.
   */
  const publication =
    publications.find(
      (item) =>
        item.kit_id === kit.id
    ) ?? null;

  /*
   * Items belonging to this Kit.
   */
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

  /*
   * Convert Kit items into public products.
   */
  const products = items.map(
    (item) => {
      const opportunity =
        opportunities.find(
          (opportunity) =>
            opportunity.id ===
            item.opportunity_id
        );

      return {
        id:
          opportunity?.id ??
          item.id,

        title:
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

    /*
     * Editorial content
     */
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

    /*
     * Generated Kit image
     */
    imageUrl:
      getPublicImageUrl(
        publication?.image_url ??
          null
      ),

    altText:
      content?.alt_text ??
      null,

    /*
     * Products contained in the Kit
     */
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

/*
 * Load all Kits that are ready for publication.
 *
 * Only Kits with:
 *
 * status = "content and image generated"
 *
 * are exposed publicly.
 */
export async function getPublishedKits(): Promise<
  PublishedKit[]
> {
  /*
   * --------------------------------------------------
   * 1. KITS
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 2. KIT CONTENTS
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 3. KIT PUBLICATIONS
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 4. KIT ITEMS
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 5. OPPORTUNITIES
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 6. BUILD PUBLIC KITS
   * --------------------------------------------------
   */

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

/*
 * Load one specific Kit by slug.
 *
 * Only Kits with:
 *
 * status = "content and image generated"
 *
 * are exposed publicly.
 */
export async function getPublishedKitBySlug(
  slug: string
): Promise<PublishedKit | null> {
  /*
   * --------------------------------------------------
   * 1. KIT
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 2. KIT CONTENT
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 3. KIT PUBLICATION / IMAGE
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 4. KIT ITEMS
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 5. OPPORTUNITIES
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * 6. BUILD PUBLIC KIT
   * --------------------------------------------------
   */

  return buildPublishedKit(
    kit,
    contents ?? [],
    publications ?? [],
    kitItems ?? [],
    opportunities
  );
}
