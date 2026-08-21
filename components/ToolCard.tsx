"use client";

import { createPortal } from "react-dom";
import type { PublishedTool } from "../lib/types";

interface ToolCardProps {
  tool: PublishedTool;
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

export default function ToolCard({
  tool,
  isExpanded,
  onOpen,
  onClose,
}: ToolCardProps) {
  const keyBenefits = formatList(tool.keyBenefits);
  const categories = formatList(tool.categories);

  /*
   * =========================================================
   * NORMAL CARD
   *
   * The image defines the height of the card.
   * The editorial content is positioned over the bottom
   * of the image.
   *
   * Mobile:
   *   width = 88vw
   *
   * Laptop / desktop:
   *   width = 400px
   *
   * The image keeps its natural aspect ratio.
   * =========================================================
   */
  const card = (
    <button
      type="button"
      onClick={onOpen}
      style={{ height: "fit-content" }}
      className="tool-card group relative h-fit !w-[76vw] max-w-[calc(100vw-2rem)] flex-shrink-0 overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white text-left shadow-[0_18px_45px_-28px_rgba(30,20,20,0.28)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:border-[#F3B1B4] hover:shadow-[0_30px_80px_-30px_rgba(217,143,148,0.38)] sm:!w-[360px]"
    >
      {/* =====================================================
          IMAGE
          Natural image ratio — no artificial card height.
         ===================================================== */}
      <div className="relative w-full overflow-hidden bg-[#F7F4F2]">
        {tool.imageUrl ? (
          <img
            src={tool.imageUrl}
            alt={tool.altText ?? tool.creativePunchline ?? ""}
            className="block h-auto w-full object-top transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[2/3] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
        )}

        {/* ===================================================
            EDITORIAL OVERLAY
            Translucent editorial layer over the bottom
            of the creative.
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
            {/* Creative punchline */}
            {tool.creativePunchline && (
              <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#171717]">
                {tool.creativePunchline}
              </h3>
            )}

            {/* Hook */}
            {tool.hook && (
              <p className="text-sm leading-6 text-[#68615F]">
                {tool.hook}
              </p>
            )}

            {/* CTA */}
            <p className="pt-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#D98F94]">
              Click to explore
            </p>
          </div>
        </div>
      </div>
    </button>
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
   * Avoid rendering the portal during SSR
   */
  if (typeof document === "undefined") {
    return card;
  }

  /*
   * =========================================================
   * EXPANDED MODAL
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
          tool.creativePunchline ??
          tool.title ??
          "Product details"
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
            Image aligned to the top and never cropped.
           =================================================== */}
        <div className="relative hidden h-full shrink-0 bg-[#F7F4F2] md:flex md:items-start md:justify-start">
          {tool.imageUrl ? (
            <img
              src={tool.imageUrl}
              alt={
                tool.altText ??
                tool.creativePunchline ??
                ""
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

              {/* Mobile image */}
              <div className="relative -mx-7 -mt-10 overflow-hidden bg-[#F7F4F2] sm:-mx-10 sm:-mt-12 md:hidden">
                {tool.imageUrl ? (
                  <img
                    src={tool.imageUrl}
                    alt={
                      tool.altText ??
                      tool.creativePunchline ??
                      ""
                    }
                    className="h-auto max-h-[70vh] w-full object-contain object-top"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
                )}
              </div>

              {/* Punchline + hook */}
              <div className="space-y-4">
                {tool.creativePunchline && (
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-4xl">
                    {tool.creativePunchline}
                  </h2>
                )}

                {tool.hook && (
                  <p className="text-lg leading-7 text-[#68615F]">
                    {tool.hook}
                  </p>
                )}
              </div>

              {/* Primary CTA */}
              {tool.affiliateLink && (
                <div>
                  <a
                    href={tool.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    className="inline-flex items-center justify-center rounded-full bg-[#F2B5B8] px-7 py-3 font-semibold text-[#171717] shadow-[0_10px_30px_-10px_rgba(217,143,148,0.45)] transition hover:scale-[1.02] hover:bg-[#EFA9AD]"
                  >
                    Visit website
                    <span className="ml-2">→</span>
                  </a>
                </div>
              )}

              {/* Why we like it = Summary */}
              {tool.summary && (
                <section className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                    Why we like it
                  </p>

                  <p className="text-base leading-7 text-[#514B49]">
                    {tool.summary}
                  </p>
                </section>
              )}

              {/* Key benefits */}
              {keyBenefits.length > 0 && (
                <section className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                    Why it stands out
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

              {/* Keywords / categories at the bottom */}
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

              {/* Published date */}
              {tool.publishedAt && (
                <div className="border-t border-[#E8E2DF] pt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#A39A97]">
                    Published
                  </p>

                  <p className="mt-1 text-sm text-[#68615F]">
                    {new Date(
                      tool.publishedAt
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
