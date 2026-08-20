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
   * Normal card
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
          <h3 className="text-2xl font-semibold leading-tight tracking-tight text-[#171717]">
            {tool.title}
          </h3>

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

  const expandedCard = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-[#171717]/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Expanded card */}
      <article
        className="fixed left-1/2 top-1/2 z-[100] w-[min(900px,calc(100vw-2rem))] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-[#E8E2DF] bg-white shadow-[0_40px_120px_-30px_rgba(30,20,20,0.42)]"
        role="dialog"
        aria-modal="true"
        aria-label={tool.title ?? "Tool details"}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative overflow-hidden rounded-t-[2rem] bg-[#F7F4F2]">
          {tool.imageUrl ? (
            <img
              src={tool.imageUrl}
              alt={tool.altText ?? tool.title ?? ""}
              className="aspect-[16/7] w-full object-cover"
            />
          ) : (
            <div className="aspect-[16/7] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-2xl text-[#171717] shadow-lg backdrop-blur transition hover:bg-white hover:scale-105"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-7 px-7 pb-8 pt-7 sm:px-10 sm:pb-10">
          {/* Categories */}
          {categories.length > 0 && (
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
          )}

          {/* Title + hook */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-4xl">
              {tool.title}
            </h2>

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
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center justify-center rounded-full bg-[#F2B5B8] px-7 py-3 font-semibold text-[#171717] shadow-[0_10px_30px_-10px_rgba(217,143,148,0.45)] transition hover:scale-[1.02] hover:bg-[#EFA9AD]"
              >
                Visit website
                <span className="ml-2">→</span>
              </a>
            </div>
          )}

          {/* Summary */}
          {tool.summary && (
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                The short version
              </p>

              <p className="text-base leading-7 text-[#514B49]">
                {tool.summary}
              </p>
            </section>
          )}

          {/* Key benefits */}
          {keyBenefits.length > 0 && (
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                Key benefits
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
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

          {/* Editorial story */}
          {tool.editorialStory && (
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D98F94]">
                Why we picked it
              </p>

              <p className="text-base leading-7 text-[#514B49]">
                {tool.editorialStory}
              </p>
            </section>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t border-[#E8E2DF] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#A39A97]">
                Published
              </p>

              <p className="mt-1 text-sm text-[#68615F]">
                {tool.publishedAt
                  ? new Date(tool.publishedAt).toLocaleDateString("en-GB")
                  : ""}
              </p>
            </div>

            {tool.affiliateLink && (
              <a
                href={tool.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center justify-center rounded-full bg-[#F2B5B8] px-7 py-3 font-semibold text-[#171717] transition hover:scale-[1.02] hover:bg-[#EFA9AD]"
              >
                Visit website
                <span className="ml-2">→</span>
              </a>
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
