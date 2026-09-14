export interface ProductCollection {
  slug: string;
  label: string;
  emoji: string;
  title: string;
  subtitle: string;
  collection?: string;
  isMostWanted?: boolean;
}

export const productCollections: ProductCollection[] = [
  {
    slug: "most-wanted",
    label: "Most Wanted",
    emoji: "⭐",
    title: "The things we’d buy ourselves.",
    subtitle: "Our most wanted finds, handpicked for everyday life.",
    isMostWanted: true,
  },
  {
    slug: "back-to-school",
    label: "Back To School",
    emoji: "🎒",
    title: "Smart finds for a fresh start.",
    subtitle: "Useful, clever picks to make the new school year easier.",
    collection: "back_to_school",
  },
  {
    slug: "smart-home",
    label: "Smart Home Essentials",
    emoji: "💡",
    title: "Clever finds to make home life easier.",
    subtitle: "Small upgrades that make everyday spaces work a little better.",
    collection: "smart_home",
  },
  {
    slug: "halloween",
    label: "Halloween Finds",
    emoji: "🎃",
    title: "Spooky finds for a frightfully good season.",
    subtitle: "Fun, atmospheric and useful picks for Halloween.",
    collection: "halloween",
  },
];

export function getProductCollection(
  slug: string
): ProductCollection | undefined {
  return productCollections.find(
    (collection) => collection.slug === slug
  );
}
