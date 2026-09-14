import type { Metadata } from "next";
import Link from "next/link";
import CollectionFeed from "../../../components/CollectionFeed";
import {
  getProductCollection,
  productCollections,
} from "../../../lib/collections";
import { getPublishedToolsByCollection } from "../../../lib/tools";

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

export function generateStaticParams() {
  return productCollections.map((collection) => ({
    collection: collection.slug,
  }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getProductCollection(slug);

  if (!collection) {
    return {
      title: "Collection not found | Ponop Finds",
    };
  }

  return {
    title: `${collection.label} | Ponop Finds`,
    description: collection.subtitle,
  };
}

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { collection: slug } = await params;
  const collection = getProductCollection(slug);

  if (!collection) {
    return (
      <main className="min-h-screen bg-[#faf8f7] px-6 py-16 text-[#171717] sm:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D98F94]">
            Ponop Finds
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Collection not found.
          </h1>
          <Link
            href="/"
            className="mt-8 inline-flex items-center text-sm font-semibold text-[#68615F] transition-colors hover:text-[#D98F94]"
          >
            ← Back to Finds
          </Link>
        </div>
      </main>
    );
  }

  const tools = await getPublishedToolsByCollection(
    collection.collection ?? "",
    collection.isMostWanted ?? false
  );

  return (
    <main className="min-h-screen bg-[#faf8f7] text-[#171717]">
      <section className="px-6 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-sm font-semibold text-[#68615F] transition-colors hover:text-[#D98F94]"
          >
            ← All Finds
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.28em] text-[#D98F94]">
            {collection.emoji} {collection.label}
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {collection.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68615f]">
            {collection.subtitle}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10">
        <CollectionFeed tools={tools} />
      </section>
    </main>
  );
}
