import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  const kit = await getPublishedKitBySlug(slug);

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
      title: kit.title ?? kit.name ?? "Ponop Finds",
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

  const kit = await getPublishedKitBySlug(slug);

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
        {/* Back to Kits */}
        <div className="mb-8">
          <Link
            href="/kits"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#68615f] transition-colors hover:text-[#d98f94]"
          >
            <span aria-hidden="true">←</span>
            <span>All Kits</span>
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:items-start">
          {/* =========================================================
              LEFT COLUMN
              ========================================================= */}
          <div className="min-w-0">
            {/* Kit image */}
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

            {/* The idea */}
            {hasIdeaContent && (
              <section className="mt-12 border-t border-[#e8e2df] pt-10">
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
                  {Array.isArray(kit.keyBenefits) &&
                    kit.keyBenefits.length > 0 && (
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
                                  {String(benefit)}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Recommended for */}
                  {Array.isArray(kit.recommendedFor) &&
                    kit.recommendedFor.length > 0 && (
                      <div className="mt-10">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d98f94]">
                          Recommended for
                        </h3>

                        <p className="mt-4 text-base leading-7 text-[#68615f]">
                          {kit.recommendedFor
                            .map((item: unknown) =>
                              String(item)
                            )
                            .join(" · ")}
                        </p>
                      </div>
                    )}
                </div>
              </section>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN
              ========================================================= */}
          <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            {/* Kit introduction */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d98f94]">
                ✨ Curated Kit
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {kit.title ?? kit.name}
              </h1>

              {kit.description && (
                <p className="mt-5 text-lg leading-8 text-[#68615f]">
                  {kit.description}
                </p>
              )}
            </div>

            {/* Shop the Kit */}
            {kit.products.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold">
                  Shop the Kit
                </h2>

                <div className="mt-5 space-y-3">
                  {kit.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 rounded-2xl border border-[#e8e2df] bg-white p-4"
                    >
                      {/* Product image */}
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title ?? ""}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 shrink-0 rounded-xl bg-[#f3efed]" />
                      )}

                      {/* Product content */}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-6 text-[#171717]">
                          {product.title ??
                            product.reason ??
                            "Selected product"}
                        </p>

                        {product.reason && (
                          <p className="mt-1 text-sm leading-5 text-[#68615f]">
                            {product.reason}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      {product.affiliateLink && (
                        <a
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="shrink-0 rounded-full bg-[#f2b5b8] px-4 py-2 text-sm font-semibold text-[#171717] transition hover:bg-[#d98f94]"
                        >
                          Shop
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
