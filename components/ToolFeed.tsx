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

function hasCollection(
  tool: PublishedTool,
  collection: string
): boolean {
  if (!Array.isArray(tool.collections)) {
    return false;
  }

  return tool.collections.some(
    (item) =>
      String(item).trim().toLowerCase() === collection.toLowerCase()
  );
}

/*
 * Sort tools by creation date:
 * newest first.
 *
 * Tools without a createdAt date are placed at the end.
 */
function sortByNewest(
  tools: PublishedTool[]
): PublishedTool[] {
  return [...tools].sort((a, b) => {
    if (!a.createdAt && !b.createdAt) {
      return 0;
    }

    if (!a.createdAt) {
      return 1;
    }

    if (!b.createdAt) {
      return -1;
    }

    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });
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

    const maxScrollLeft = Math.max(
      rail.scrollWidth - rail.clientWidth,
      0
    );

    const leftDisabled = rail.scrollLeft <= 4;
    const rightDisabled =
      rail.scrollLeft >= maxScrollLeft - 4;

    setArrowState((current) => ({
      ...current,
      [railId]: {
        left: leftDisabled,
        right: rightDisabled,
      },
    }));
  };

  const scrollRail = (
    railId: string,
    direction: -1 | 1
  ) => {
    const rail = railRefs.current[railId];

    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector(
      ".tool-card"
    ) as HTMLElement | null;

    if (!firstCard) {
      return;
    }

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const computedStyle =
      window.getComputedStyle(rail);

    const gap =
      Number.parseFloat(
        computedStyle.gap ||
          computedStyle.columnGap ||
          "0"
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
    <section className="space-y-8 border-t border-[#E9E4E1] bg-transparent px-4 pb-24 pt-10 sm:px-6">
      {sections.map((section) => {
        let sectionTools: PublishedTool[];

        /*
         * ⭐ MOST WANTED
         *
         * Editorial selection controlled directly
         * from the database.
         *
         * Then sorted by creation date,
         * newest first.
         */
        if (section.id === "wanted") {
          sectionTools = sortByNewest(
            tools.filter(
              (tool) => tool.isMostWanted
            )
          );

        /*
         * 🎒 BACK TO SCHOOL
         *
         * Products whose collections array contains:
         * "back_to_school"
         *
         * Then sorted by creation date,
         * newest first.
         */
        } else if (section.id === "school") {
          sectionTools = sortByNewest(
            tools.filter((tool) =>
              hasCollection(
                tool,
                "back_to_school"
              )
            )
          );

        /*
         * 💡 SMART HOME ESSENTIALS
         *
         * Products whose collections array contains:
         * "smart_home"
         *
         * Then sorted by creation date,
         * newest first.
         */
        } else if (section.id === "home") {
          sectionTools = sortByNewest(
            tools.filter((tool) =>
              hasCollection(
                tool,
                "smart_home"
              )
            )
          );

        /*
         * Fallback
         */
        } else {
          sectionTools = sortByNewest(tools);
        }

        return (
          <div
            key={section.id}
            className="tool-section w-full"
          >
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
                  disabled={
                    arrowState[section.id]?.left ?? true
                  }
                  onClick={() =>
                    scrollRail(
                      section.id,
                      -1
                    )
                  }
                >
                  <span aria-hidden="true">
                    ‹
                  </span>
                </button>

                {/* Cards */}
                <div
                  ref={(node) => {
                    railRefs.current[section.id] =
                      node;
                  }}
                  data-rail-id={section.id}
                  className="rail-track flex gap-6 overflow-x-auto overflow-y-visible pl-0 pr-0 scrollbar-none sm:pl-2 sm:pr-2"
                  style={{
                    touchAction: "auto",
                  }}
                  onScroll={() =>
                    updateRailArrowState(
                      section.id
                    )
                  }
                >
                  {sectionTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isExpanded={
                        expandedToolId === tool.id
                      }
                      onOpen={() =>
                        setExpandedToolId(
                          tool.id
                        )
                      }
                      onClose={() =>
                        setExpandedToolId(null)
                      }
                    />
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  type="button"
                  className="rail-button rail-button-right"
                  aria-label={`Scroll ${section.label} right`}
                  disabled={
                    arrowState[section.id]?.right ??
                    false
                  }
                  onClick={() =>
                    scrollRail(
                      section.id,
                      1
                    )
                  }
                >
                  <span aria-hidden="true">
                    ›
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
