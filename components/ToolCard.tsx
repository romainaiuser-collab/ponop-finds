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
  const categories = formatList(tool.categories);

  /*
   * Normal card
   */
  const card = (
    <button
      type="button"
      onClick={onOpen}
      className="tool-card group flex-shrink-0 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 text-left shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-[#3FC1C9]/30 hover:shadow-[0_30px_80px_-30px_rgba(63,193,201,0.35)]"
    >
      <div className="overflow-hidden rounded-t-[2rem]">
        {tool.imageUrl ? (
          <img
            src={tool.imageUrl}
            alt={tool.altText ?? tool.title ?? ""}
            className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#364F6B] via-[#3FC1C9] to-[#BEED6E]" />
        )}
      </div>

      <div className="space-y-4 px-6 pb-6 pt-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold leading-tight text-white">
            {tool.title}
          </h3>

          <p className="text-sm leading-6 text-slate-300">
            {tool.hook ?? tool.description ?? tool.summary}
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.24em] text-[#BEED6E]/80">
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
        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Expanded Netflix-style card */}
      <article
        className="fixed left-1/2 top-1/2 z-[100] w-[min(900px,calc(100vw-2rem))] max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-white/15 bg-[#1c2430] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
        role="dialog"
        aria-modal="true"
        aria-label={tool.title ?? "Tool details"}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative overflow-hidden rounded-t-[2rem]">
          {tool.imageUrl ? (
            <img
              src={tool.imageUrl}
              alt={tool.altText ?? tool.title ?? ""}
              className="aspect-[16/7] w-full object-cover"
            />
          ) : (
            <div className="aspect-[16/7] w-full bg-gradient-to-br from-[#364F6B] via-[#3FC1C9] to-[#BEED6E]" />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur transition hover:bg-black/80"
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
                  className="rounded-full border border-[#3FC1C9]/30 bg-[#3FC1C9]/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#3FC1C9]"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Title + hook */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {tool.title}
            </h2>

            {tool.hook && (
              <p className="text-lg leading-7 text-slate-300">
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
                className="inline-flex items-center justify-center rounded-full bg-[#BEED6E] px-7 py-3 font-semibold text-[#111827] shadow-[0_10px_30px_-10px_rgba(190,237,110,0.5)] transition hover:scale-[1.02] hover:bg-[#d4f58d]"
              >
                Visit website
                <span className="ml-2">→</span>
              </a>
            </div>
          )}

          {/* Summary */}
          {tool.summary && (
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3FC1C9]">
                The short version
              </p>

              <p className="text-base leading-7 text-slate-300">
                {tool.summary}
              </p>
            </section>
          )}

          {/* Key benefits */}
          {keyBenefits.length > 0 && (
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3FC1C9]">
                Key benefits
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {keyBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
                  >
                    <span className="mr-2 text-[#BEED6E]">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Editorial story */}
          {tool.editorialStory && (
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3FC1C9]">
                Why we picked it
              </p>

              <p className="text-base leading-7 text-slate-300">
                {tool.editorialStory}
              </p>
            </section>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Published
              </p>

              <p className="mt-1 text-sm text-slate-400">
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
                className="inline-flex items-center justify-center rounded-full bg-[#BEED6E] px-7 py-3 font-semibold text-[#111827] transition hover:scale-[1.02] hover:bg-[#d4f58d]"
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