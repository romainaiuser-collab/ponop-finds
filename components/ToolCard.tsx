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
    return value
      .map((item) => String(item))
      .filter(Boolean);
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
  const idealFor = formatList(tool.idealFor);

  /*
   * ---------------------------------------------------------
   * Normal card
   * ---------------------------------------------------------
   */

  const card = (
    <button
      type="button"
      onClick={onOpen}
      className="tool-card group flex-shrink-0 overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white text-left shadow-[0_18px_45px_-28px_rgba(30,20,20,0.28)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:border-[#F3B1B4] hover:shadow-[0_30px_80px_-30px_rgba(217,143,148,0.38)]"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-t-[2rem] bg-[#F7F4F2]">
        {tool.imageUrl ? (
          <img
            src={tool.imageUrl}
            alt={tool.altText ?? tool.title ?? ""}
            className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 px-6 pb-6 pt-6">
        <div className="space-y-3">
          {/* Creative punchline */}
          <h3 className="text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-[#171717]">
            {tool.creativePunchline ?? tool.hook ?? tool.title}
          </h3>

          {/* Hook */}
          <p className="text-sm leading-6 text-[#68615F]">
            {tool.hook ?? tool.description ?? tool.summary}
          </p>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D98F94]">
          Click to explore
        </p>
      </div>
    </button>
  );

  if (!isExpanded) {
    return card;
  }

  if (typeof document === "undefined") {
    return card;
  }

  /*
   * ---------------------------------------------------------
   * Expanded modal
   * ---------------------------------------------------------
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
        className="fixed left-1/2 top-1/2 z-[100] grid w-[min(1100px,calc(100vw-2rem))] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white shadow-[0_40px_120px_-30px_rgba(30,20,20,0.42)] md:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]"
        role="dialog"
        aria-modal="true"
        aria-label={tool.title ?? "Tool details"}
        onClick={(event) => event.stopPropagation()}
      >
        {/* -------------------------------------------------
            Left: Pinterest image
           ------------------------------------------------- */}

        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[#F7F4F2] md:min-h-[600px]">
          {tool.imageUrl ? (
            <img
              src={tool.imageUrl}
              alt={tool.altText ?? tool.title ?? ""}
              className="h-full max-h-[88vh] w-full object-contain"
            />
          ) : (
            <div className="h-full min-h-[320px] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-2xl text-[#171717] shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            ×
          </button>
        </div>

        {/* -------------------------------------------------
            Right: Editorial content
           ------------------------------------------------- */}

        <div className="overflow-y-auto">
          <div className="flex min-h-full flex-col space-y-7 px-7 py-8 sm:px-9 sm:py-10">

            {/* Punchline + hook */}
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold leading-[1.12] tracking-tight text-[#171717] sm:text-4xl">
                {tool.creativePunchline ?? tool.hook ?? tool.title}
              </h2>

              {tool.hook && (
                <p className="text-lg leading-7 text-[#68615F]">
                  {tool.hook}
                </p>
              )}
            </div>

            {/* Ideal for */}
            {idealFor.length > 0 && (
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                  Ideal for
                </p>

                <div className="flex flex-wrap gap-2">
                  {idealFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#EBC1C3] bg-[#FDF3F3] px-3 py-1.5 text-sm font-medium text-[#B96F75]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Key benefits */}
            {keyBenefits.length > 0 && (
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                  Why we like it
                </p>

                <ul className="space-y-2">
                  {keyBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex gap-3 rounded-xl border border-[#E8E2DF] bg-[#FAF8F7] px-4 py-3 text-sm leading-6 text-[#514B49]"
                    >
                      <span className="font-semibold text-[#D98F94]">
                        ✓
                      </span>

                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* CTA */}
            {tool.affiliateLink && (
              <div className="pt-1">
                <a
                  href={tool.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#F2B5B8] px-7 py-3.5 font-semibold text-[#171717] shadow-[0_10px_30px_-10px_rgba(217,143,148,0.45)] transition hover:scale-[1.02] hover:bg-[#EFA9AD]"
                >
                  Visit website
                  <span className="ml-2">→</span>
                </a>
              </div>
            )}

            {/* Summary */}
            {tool.summary && (
              <section className="space-y-2 border-t border-[#E8E2DF] pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A39A97]">
                  More about this find
                </p>

                <p className="text-sm leading-6 text-[#68615F]">
                  {tool.summary}
                </p>
              </section>
            )}

            {/* Editorial story */}
            {tool.editorialStory && (
              <section className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A39A97]">
                  Why we picked it
                </p>

                <p className="text-sm leading-6 text-[#68615F]">
                  {tool.editorialStory}
                </p>
              </section>
            )}
          </div>
        </div>
      </article>
    </>
  );

  return (
    <>
      {card}

      {createPortal(expandedCard, document.body)}
    </>
  );
}
