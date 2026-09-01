"use client";

import { createPortal } from "react-dom";
import type { PublishedKit } from "../lib/types";

interface KitCardProps {
  kit: PublishedKit;
  isExpanded: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function formatList(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function KitCard({
  kit,
  isExpanded,
  onOpen,
  onClose,
}: KitCardProps) {
  const keyBenefits = formatList(kit.keyBenefits);
  const categories = formatList(kit.categories);

  /*
   * =========================================================
   * NORMAL CARD
   *
   * Same visual logic as ToolCard:
   *
   * Mobile:
   *   width = 76vw
   *
   * Laptop / desktop:
   *   width = 360px
   *
   * The image keeps its natural aspect ratio.
   * The editorial content sits over the bottom of the image.
   *
   * The card itself does not define touchAction.
   * =========================================================
   */

  const card = (
    <div className="relative w-full min-w-0">
      <button
        type="button"
        onClick={onOpen}
        style={{
          height: "fit-content",
        }}
        className="tool-card group/card relative h-fit !w-full overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white text-left shadow-[0_18px_45px_-28px_rgba(30,20,20,0.28)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:border-[#F3B1B4] hover:shadow-[0_30px_80px_-30px_rgba(217,143,148,0.38)]"
      >
        {/* =====================================================
            IMAGE
            Natural image ratio — no artificial height.
           ===================================================== */}
        <div className="relative w-full overflow-hidden bg-[#F7F4F2]">
          {kit.imageUrl ? (
            <img
              src={kit.imageUrl}
              alt={kit.altText ?? kit.creativePunchline ?? kit.name}
              className="block h-auto w-full object-top transition duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="aspect-[2/3] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
          )}

          {/* ===================================================
              EDITORIAL OVERLAY
              Same treatment as ToolCard.
             =================================================== */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              z-10
              bg-white/72
              px-5
              pb-5
              pt-5
              backdrop-blur-[5px]
              sm:px-6
              sm:pb-6
              sm:pt-5
            "
          >
            <div className="space-y-3">
              {/* Kit title / punchline */}
              <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#171717]">
                {kit.creativePunchline ?? kit.title ?? kit.name}
              </h3>

              {/* Hook */}
              {kit.hook && (
                <p className="text-sm leading-6 text-[#68615F]">
                  {kit.hook}
                </p>
              )}

              {/* CTA */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D98F94]">
                  Click to explore
                </p>

                <span className="inline-flex shrink-0 items-center justify-center self-start rounded-full bg-[#F2B5B8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717] shadow-[0_8px_24px_-8px_rgba(217,143,148,0.45)] transition group-hover/card:scale-[1.02] group-hover/card:bg-[#EFA9AD] sm:self-auto">
                  Explore kit
                  <span className="ml-2">→</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );

  /*
   * =========================================================
   * NORMAL STATE
   * =========================================================
   */

  if (!isExpanded) {
    return card;
  }

  /*
   * Avoid rendering the portal during SSR.
   */

  if (typeof document === "undefined") {
    return card;
  }

  /*
   * =========================================================
   * EXPANDED MODAL
   *
   * Same architecture as ToolCard:
   *
   * LEFT  = full portrait Kit image
   * RIGHT = editorial content
   *
   * No cropping of the main Kit creative.
   * =========================================================
   */

  const expandedCard = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-[#171717]/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <article
        className="fixed left-1/2 top-1/2 z-[100] flex h-[min(88vh,760px)] w-[min(1100px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white shadow-[0_40px_120px_-30px_rgba(30,20,20,0.42)]"
        role="dialog"
        aria-modal="true"
        aria-label={
          kit.title ??
          kit.name ??
          "Kit details"
        }
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-[120] flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-2xl text-[#171717] shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
        >
          ×
        </button>

        {/* ===================================================
            LEFT — FULL PORTRAIT IMAGE
            Same logic as ToolCard.
            Image is never artificially cropped.
           =================================================== */}
        <div className="relative hidden h-full shrink-0 bg-[#F7F4F2] md:flex md:items-start md:justify-start">
          {kit.imageUrl ? (
            <img
              src={kit.imageUrl}
              alt={
                kit.altText ??
                kit.creativePunchline ??
                kit.name
              }
              className="h-auto max-h-full w-auto max-w-[52vw] object-contain object-top"
            />
          ) : (
            <div className="flex h-full w-[420px] max-w-[52vw] items-center justify-center bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B96F75]">
                Ponop Finds
              </span>
            </div>
          )}
        </div>

        {/* ===================================================
            RIGHT — EDITORIAL CONTENT
           =================================================== */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-8 px-7 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-12">

              {/* =================================================
                  MOBILE IMAGE
                 ================================================= */}
              <div className="relative -mx-7 -mt-10 overflow-hidden bg-[#F7F4F2] sm:-mx-10 sm:-mt-12 md:hidden">
                {kit.imageUrl ? (
                  <img
                    src={kit.imageUrl}
                    alt={
                      kit.altText ??
                      kit.creativePunchline ??
                      kit.name
                    }
                    className="h-auto max-h-[70vh] w-full object-contain object-top"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
                )}
              </div>

              {/* =================================================
                  KIT TITLE + HOOK
                 ================================================= */}
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-4xl">
                  {kit.title ?? kit.name}
                </h2>

                {kit.hook && (
                  <p className="text-lg leading-7 text-[#68615F]">
                    {kit.hook}
                  </p>
                )}
              </div>

              {/* =================================================
                  KIT DESCRIPTION / SUMMARY
                 ================================================= */}
              {kit.summary && (
                <section className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                    Why we put it together
                  </p>

                  <p className="text-base leading-7 text-[#514B49]">
                    {kit.summary}
                  </p>
                </section>
              )}

              {/* =================================================
                  EDITORIAL STORY
                 ================================================= */}
              {kit.editorialStory && (
                <section className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                    The idea
                  </p>

                  <p className="text-base leading-7 text-[#514B49]">
                    {kit.editorialStory}
                  </p>
                </section>
              )}

              {/* =================================================
                  PRODUCTS
                  One affiliate CTA per product.
                 ================================================= */}
              {kit.products &&
                kit.products.length > 0 && (
                  <section className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                      Shop the kit
                    </p>

                    <div className="space-y-3">
                      {kit.products
                        .slice()
                        .sort(
                          (a, b) =>
                            (a.position ?? 999) -
                            (b.position ?? 999)
                        )
                        .map((product) => (
                          <div
                            key={product.id}
                            className="rounded-xl border border-[#E8E2DF] bg-[#FAF8F7] px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-5 text-[#171717]">
                                  {product.title}
                                </p>

                                {product.reason && (
                                  <p className="mt-1 text-xs leading-5 text-[#68615F]">
                                    {product.reason}
                                  </p>
                                )}
                              </div>

                              {product.affiliateLink &&
                                product.affiliateLink !== "#" && (
                                  <a
                                    href={
                                      product.affiliateLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F2B5B8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171717] shadow-[0_8px_24px_-8px_rgba(217,143,148,0.45)] transition hover:scale-[1.02] hover:bg-[#EFA9AD]"
                                  >
                                    Shop
                                    <span className="ml-2">
                                      →
                                    </span>
                                  </a>
                                )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

              {/* =================================================
                  KEY BENEFITS
                 ================================================= */}
              {keyBenefits.length > 0 && (
                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                    Why it works
                  </p>

                  <ul className="space-y-3">
                    {keyBenefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="rounded-xl border border-[#E8E2DF] bg-[#FAF8F7] px-4 py-3 text-sm leading-6 text-[#514B49]"
                      >
                        <span className="mr-2 font-semibold text-[#D98F94]">
                          ✓
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* =================================================
                  IDEAL FOR
                 ================================================= */}
              {kit.idealFor && (
                <section className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                    Ideal for
                  </p>

                  <p className="text-base leading-7 text-[#514B49]">
                    {kit.idealFor}
                  </p>
                </section>
              )}

              {/* =================================================
                  CATEGORIES
                 ================================================= */}
              {categories.length > 0 && (
                <section className="border-t border-[#E8E2DF] pt-7">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-[#EBC1C3] bg-[#FDF3F3] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[#B96F75]"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* =================================================
                  PUBLISHED DATE
                 ================================================= */}
              {kit.publishedAt && (
                <div className="border-t border-[#E8E2DF] pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#A39A97]">
                    Published
                  </p>

                  <p className="mt-1 text-sm text-[#68615F]">
                    {new Date(
                      kit.publishedAt
                    ).toLocaleDateString("en-GB")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      {card}

      {createPortal(
        expandedCard,
        document.body
      )}
    </>
  );
}
