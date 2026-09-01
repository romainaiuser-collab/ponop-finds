import type { PublishedKit } from "./types";

/*
 * Temporary mock data for Kits.
 *
 * This will be replaced by the Supabase query once
 * the Kits data layer is connected.
 */

const mockKits: PublishedKit[] = [
  {
    id: "demo-halloween-kit",
    name: "Halloween Night In",
    slug: "halloween-night-in",
    description:
      "A few carefully picked finds to create the perfect Halloween atmosphere at home.",

    collection: "halloween",
    theme: "Halloween",
    audience: "Home lovers",
    useCase: "Halloween decoration",
    angle: "CORE_VALUE",

    title: "Halloween Night In",
    hook: "Everything you need for a properly spooky night at home.",
    summary:
      "A curated selection of simple Halloween finds that work beautifully together.",
    editorialStory:
      "We picked these products because they create a cohesive Halloween atmosphere without requiring a huge decorating effort.",

    keyBenefits: [],
    recommendedFor: [],
    categories: ["Halloween", "Home"],
    idealFor: "Anyone who wants an easy Halloween setup.",
    notIdealFor: null,
    creativePunchline: "A little spooky. A lot more fun.",

    /*
     * Temporary placeholder image.
     *
     * We will replace this with the generated Kit image
     * coming from kits_publications.image_url.
     */
    imageUrl:
      "https://images.unsplash.com/photo-1509557965878-b88c97052f0e?auto=format&fit=crop&w=1200&q=85",

    altText: "Halloween themed home decoration",

    products: [
      {
        id: "demo-product-1",
        title: "Halloween Product One",
        affiliateLink: "#",
        imageUrl: null,
        price: null,
        currency: null,
        position: 1,
        role: "Atmosphere",
        reason: "Sets the mood.",
      },
      {
        id: "demo-product-2",
        title: "Halloween Product Two",
        affiliateLink: "#",
        imageUrl: null,
        price: null,
        currency: null,
        position: 2,
        role: "Decoration",
        reason: "Adds the finishing touch.",
      },
      {
        id: "demo-product-3",
        title: "Halloween Product Three",
        affiliateLink: "#",
        imageUrl: null,
        price: null,
        currency: null,
        position: 3,
        role: "Experience",
        reason: "Makes the evening more memorable.",
      },
    ],

    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/*
 * Temporary public Kits loader.
 *
 * Later this function will query Supabase and return only:
 *
 * kits.status = "content and image generated"
 */
export async function getPublishedKits(): Promise<PublishedKit[]> {
  return mockKits;
}
