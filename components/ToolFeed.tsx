"use client";

import { useEffect, useRef, useState } from "react";
import ToolCard from "./ToolCard";
import type { PublishedTool } from "../lib/types";

const sections = [
  {
    id: "wanted",
    label: "⭐ Most Wanted",
    subtitle: "The things we’d buy ourselves.",
  },
  {
    id: "school",
    label: "🎒 Back To School",
    subtitle: "Smart finds for a fresh start.",
  },
  {
    id: "home",
    label: "💡 Smart Home Essentials",
    subtitle: "Clever finds to make home life easier.",
  },
];

interface ToolFeedProps {
  tools: PublishedTool[];
}

export default function ToolFeed({ tools }: ToolFeedProps) {
  const railRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [arrowState, setArrowState] = useState<
    Record<string, { left: boolean; right: boolean }>
  >({});
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  const updateRailArrowState = (railId: string) => {
    const rail = railRefs.current[railId];

    if (!rail) {
      return;
    }

    const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
    const leftDisabled = rail.scrollLeft <= 4;
    const rightDisabled = rail.scrollLeft >= maxScrollLeft - 4;

    setArrowState((current) => ({
      ...current,
      [railId]: {
        left: leftDisabled,
        right: rightDisabled,
      },
    }));
  };

  const scrollRail = (railId: string, direction: -1 | 1) => {
    const rail = railRefs.current[railId];

    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector(".tool-card") as HTMLElement | null;

    if (!firstCard) {
      return;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(rail);

    const gap =
      Number.parseFloat(
        computedStyle.gap || computedStyle.columnGap || "0"
      ) || 0;

    rail.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      updateRailArrowState(railId);
    });
  };

  useEffect(() => {
    sections.forEach((section) => {
      updateRailArrowState(section.id);
    });
  }, [tools]);

  return (
    <section className="space-y-16 border-t border-[#E9E4E1] bg-transparent px-4 pb-24 pt-10 sm:px-6">
      {sections.map((section) => {
        let sectionTools: PublishedTool[];

        if (section.id === "wanted") {
          // Most Wanted = explicitly selected in the database
          sectionTools = tools.filter((tool) => tool.isMostWanted);
        } else if (section.id === "trending") {
          // Trending Now = most recently updated publications
          sectionTools = [...tools].sort((a, b) => {
            if (!a.updatedAt && !b.updatedAt) return 0;
            if (!a.updatedAt) return 1;
            if (!b.updatedAt) return -1;

            return (
              new Date(b.updatedAt).getTime() -
              new Date(a.updatedAt).getTime()
            );
          });
        } else if (section.id === "ai") {
          // AI Tools = products with at least one category starting with "AI"
          sectionTools = tools.filter((tool) =>
            Array.isArray(tool.categories)
              ? tool.categories.some((category) =>
                  String(category)
                    .trim()
                    .toLowerCase()
                    .startsWith("ai")
                )
              : typeof tool.categories === "string"
                ? tool.categories.split(",").some((category) =>
                    category
                      .trim()
                      .toLowerCase()
                      .startsWith("ai")
                  )
                : false
          );
        } else {
          sectionTools = tools;
        }

        return (
          <div key={section.id} className="tool-section w-full">
            {/* Section heading */}
            <div className="tool-section-heading mb-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D98F94]">
                {section.label}
              </p>

              <p className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
                {section.subtitle}
              </p>
            </div>

            {/* Tool rail */}
            <div className="relative w-full rail-viewport">
              <div className="rail-carousel group relative w-full">
                {/* Left arrow */}
                <button
                  type="button"
                  className="rail-button rail-button-left"
                  aria-label={`Scroll ${section.label} left`}
                  disabled={arrowState[section.id]?.left ?? true}
                  onClick={() => scrollRail(section.id, -1)}
                >
                  <span aria-hidden="true">‹</span>
                </button>

                <div
                  ref={(node) => {
                    railRefs.current[section.id] = node;
                  }}
                  data-rail-id={section.id}
                  className="rail-track flex gap-6 overflow-x-auto overflow-y-visible pb-6 pl-0 pr-0 scrollbar-none sm:pl-2 sm:pr-2"
                  onScroll={() => updateRailArrowState(section.id)}
                >
                  {sectionTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isExpanded={expandedToolId === tool.id}
                      onOpen={() => setExpandedToolId(tool.id)}
                      onClose={() => setExpandedToolId(null)}
                    />
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  type="button"
                  className="rail-button rail-button-right"
                  aria-label={`Scroll ${section.label} right`}
                  disabled={arrowState[section.id]?.right ?? false}
                  onClick={() => scrollRail(section.id, 1)}
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
