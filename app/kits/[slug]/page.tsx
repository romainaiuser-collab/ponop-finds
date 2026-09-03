import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import KitShopColumn from "../../../components/KitShopColumn";
import { getPublishedKitBySlug } from "../../../lib/kits";

interface KitPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: KitPageProps): Promise<Metadata> {
  const { slug } = await params;

  const kit =
    await getPublishedKitBySlug(slug);

  if (!kit) {
    return {
      title: "Kit not found | Ponop Finds",
    };
  }

  return {
    title: `${kit.title ?? kit.name} | Ponop Finds`,
    description:
      kit.description ??
      kit.summary ??
      "A curated collection of products from Ponop Finds.",
    openGraph: {
      title:
        kit.title ??
        kit.name ??
        "Ponop Finds",
      description:
        kit.description ??
        kit.summary ??
        "A curated collection of products from Ponop Finds.",
      images: kit.imageUrl
        ? [
            {
              url: kit.imageUrl,
              alt:
                kit.altText ??
                kit.title ??
                kit.name ??
                "Ponop Kit",
            },
          ]
        : undefined,
    },
  };
}

export default async function KitPage({
  params,
}: KitPageProps) {
  const { slug } = await params;

  const kit =
    await getPublishedKitBySlug(slug);

  if (!kit) {
    notFound();
  }

  const hasIdeaContent =
    Boolean(kit.summary) ||
    Boolean(kit.editorialStory) ||
    (Array.isArray(kit.keyBenefits) &&
      kit.keyBenefits.length > 0) ||
    (Array.isArray(kit.recommendedFor) &&
      kit.recommendedFor.length > 0);

  return (
    <main className="min-h-screen bg-[#faf8f7] text-[#171717]">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-10 sm:pt-12">

        {/* Brand */}
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/images/logo-p-rose.png"
            alt="Ponop Finds"
            className="h-8 w-8"
          />

          <span className="text-lg font-semibold tracking-tight text-[#171717]">
            PONOP FINDS
          </span>
        </div>

        {/* Back to Kits */}
        <div className="mb-8">
          <Link
            href="/kits"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#68615f] transition-colors hover:text-[#d98f94]"
          >
            <span aria-hidden="true">
              ←
            </span>

            <span>All Kits</span>
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-start">

          {/* LEFT COLUMN */}
          <div className="contents lg:block">

            {/* Kit image */}
            <div className="order-1 min-w-0 lg:order-none">
              <div className="overflow-hidden rounded-[2rem] bg-[#f3efed]">
                {kit.imageUrl ? (
                  <img
                    src={kit.imageUrl}
                    alt={
                      kit.altText ??
                      kit.title ??
                      kit.name ??
                      "Ponop Kit"
                    }
                    className="block h-auto w-full"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center text-sm text-[#68615f]">
                    No image available
                  </div>
                )}
              </div>
            </div>

            {/* The idea */}
            {hasIdeaContent && (
              <section className="order-3 mt-12 min-w-0 border-t border-[#e8e2df] pt-10 lg:order-none">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    The idea
                  </h2>

                  {kit.summary && (
                    <p className="mt-5 text-lg leading-8 text-[#68615f]">
                      {kit.summary}
                    </p>
                  )}

                  {kit.editorialStory && (
                    <div className="mt-5 whitespace-pre-line text-base leading-8 text-[#68615f]">
                      {kit.editorialStory}
                    </div>
                  )}

                  {/* Why it works */}
                  {Array.isArray(
                    kit.keyBenefits
                  ) &&
                    kit.keyBenefits.length >
                      0 && (
                      <div className="mt-10">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d98f94]">
                          Why it works
                        </h3>

                        <ul className="mt-4 space-y-3 text-base leading-7 text-[#68615f]">
                          {kit.keyBenefits.map(
                            (
                              benefit: unknown,
                              index: number
                            ) => (
                              <li
                                key={index}
                                className="flex gap-3"
                              >
                                <span className="shrink-0 text-[#d98f94]">
                                  ✦
                                </span>

                                <span>
                                  {String(
                                    benefit
                                  )}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Recommended for */}
                  {Array.isArray(
                    kit.recommendedFor
                  ) &&
                    kit.recommendedFor.length >
                      0 && (
                      <div className="mt-10">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d98f94]">
                          Recommended for
                        </h3>

                        <p className="mt-4 text-base leading-7 text-[#68615f]">
                          {kit.recommendedFor
                            .map(
                              (
                                item: unknown
                              ) =>
                                String(
                                  item
                                )
                            )
                            .join(" · ")}
                        </p>
                      </div>
                    )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="order-2 min-w-0 lg:order-none">
            <KitShopColumn kit={kit} />
          </div>
        </div>
      </div>
    </main>
  );
}
