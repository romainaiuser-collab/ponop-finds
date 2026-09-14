"use client";

import { useEffect, useRef, useState } from "react";
import ToolCard from "./ToolCard";
import KitRail from "./KitRail";
import type {
  PublishedKit,
  PublishedTool,
} from "../lib/types";

const sections = [
  {
    id: "wanted",
    label: "⭐ Most Wanted",
    subtitle: "The things we’d buy ourselves.",
    href: "/finds/most-wanted",
  },
  {
    id: "halloween",
    label: "🎃 Halloween Finds",
    subtitle: "Spooky finds for a frightfully good season.",
    href: "/finds/halloween",
  },
  {
    id: "school",
    label: "🎒 Back To School",
    subtitle: "Smart finds for a fresh start.",
    href: "/finds/back-to-school",
  },
  {
    id: "home",
    label: "💡 Smart Home Essentials",
    subtitle: "Clever finds to make home life easier.",
    href: "/finds/smart-home",
  },
];

interface ToolFeedProps {
  tools: PublishedTool[];
  kits: PublishedKit[];
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
      String(item).trim().toLowerCase() ===
      collection.toLowerCase()
  );
}

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

export default function ToolFeed({
  tools,
  kits,
}: ToolFeedProps) {
  const railRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  const touchStartRefs = useRef<
    Record<
      string,
      {
        x: number;
        y: number;
        scrollLeft: number;
        direction:
          | "undecided"
          | "horizontal"
          | "vertical";
      } | null
    >
  >({});

  const [arrowState, setArrowState] =
    useState<
      Record<
        string,
        {
          left: boolean;
          right: boolean;
        }
      >
    >({});

  const [expandedToolId, setExpandedToolId] =
    useState<string | null>(null);

  const updateRailArrowState = (
    railId: string
  ) => {
    const rail =
      railRefs.current[railId];

    if (!rail) {
      return;
    }

    const maxScrollLeft = Math.max(
      rail.scrollWidth -
        rail.clientWidth,
      0
    );

    const leftDisabled =
      rail.scrollLeft <= 4;

    const rightDisabled =
      rail.scrollLeft >=
      maxScrollLeft - 4;

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
    const rail =
      railRefs.current[railId];

    if (!rail) {
      return;
    }

    const firstCard =
      rail.querySelector(
        ".tool-card"
      ) as HTMLElement | null;

    if (!firstCard) {
      return;
    }

    const cardWidth =
      firstCard.getBoundingClientRect()
        .width;

    const computedStyle =
      window.getComputedStyle(rail);

    const gap =
      Number.parseFloat(
        computedStyle.gap ||
          computedStyle.columnGap ||
          "0"
      ) || 0;

    rail.scrollBy({
      left:
        direction *
        (cardWidth + gap),
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      updateRailArrowState(
        railId
      );
    });
  };

  const handleTouchStart = (
    railId: string,
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    const touch =
      event.touches[0];

    if (!touch) {
      return;
    }

    const rail =
      railRefs.current[railId];

    if (!rail) {
      return;
    }

    touchStartRefs.current[
      railId
    ] = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft:
        rail.scrollLeft,
      direction: "undecided",
    };
  };

  const handleTouchMove = (
    railId: string,
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    const start =
      touchStartRefs.current[
        railId
      ];

    if (!start) {
      return;
    }

    const touch =
      event.touches[0];

    if (!touch) {
      return;
    }

    const rail =
      railRefs.current[railId];

    if (!rail) {
      return;
    }

    const deltaX =
      touch.clientX - start.x;

    const deltaY =
      touch.clientY - start.y;

    if (
      start.direction ===
        "undecided" &&
      Math.abs(deltaX) < 8 &&
      Math.abs(deltaY) < 8
    ) {
      return;
    }

    if (
      start.direction ===
      "undecided"
    ) {
      start.direction =
        Math.abs(deltaY) >
        Math.abs(deltaX)
          ? "vertical"
          : "horizontal";
    }

    if (
      start.direction ===
      "vertical"
    ) {
      return;
    }

    event.preventDefault();

    rail.scrollLeft =
      start.scrollLeft -
      deltaX;

    updateRailArrowState(
      railId
    );
  };

  const handleTouchEnd = (
    railId: string
  ) => {
    touchStartRefs.current[
      railId
    ] = null;

    requestAnimationFrame(() => {
      updateRailArrowState(
        railId
      );
    });
  };

  useEffect(() => {
    sections.forEach((section) => {
      updateRailArrowState(
        section.id
      );
    });
  }, [tools]);

  return (
    <section
      id="all-finds"
      className="w-full space-y-16 pb-24 pt-8"
    >
      {/* Curated Kits first */}
      <div id="curated-kits">
        <KitRail kits={kits} />
      </div>

      {sections.map((section) => {
        let sectionTools: PublishedTool[];

        if (section.id === "wanted") {
          sectionTools = sortByNewest(
            tools.filter(
              (tool) => tool.isMostWanted
            )
          );
        } else if (section.id === "school") {
          sectionTools = sortByNewest(
            tools.filter((tool) =>
              hasCollection(
                tool,
                "back_to_school"
              )
            )
          );
        } else if (section.id === "home") {
          sectionTools = sortByNewest(
            tools.filter((tool) =>
              hasCollection(
                tool,
                "smart_home"
              )
            )
          );
        } else if (section.id === "halloween") {
          sectionTools = sortByNewest(
            tools.filter((tool) =>
              hasCollection(
                tool,
                "halloween"
              )
            )
          );
        } else {
          sectionTools = sortByNewest(tools);
        }

        // Keep every homepage rail limited to 10 items.
        sectionTools = sectionTools.slice(0, 10);

        return (
          <div
            id={
              section.id === "wanted"
                ? "most-wanted"
                : section.id === "school"
                  ? "back-to-school"
                  : section.id === "home"
                    ? "smart-home"
                    : section.id === "halloween"
                      ? "halloween"
                      : undefined
            }
            key={section.id}
            className="tool-section w-full"
          >
            <div className="tool-section-heading mb-3">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D98F94]">
                    {section.label}
                  </p>

                  <p className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
                    {section.subtitle}
                  </p>
                </div>

                <a
                  href={section.href}
                  className="mb-1 shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#68615F] transition-colors hover:text-[#D98F94]"
                >
                  Explore all
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            <div className="relative w-full rail-viewport">
              <div className="rail-carousel group relative w-full">
                <button
                  type="button"
                  className="rail-button rail-button-left"
                  aria-label={`Scroll ${section.label} left`}
                  disabled={
                    arrowState[
                      section.id
                    ]?.left ?? true
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

                <div
                  ref={(node) => {
                    railRefs.current[
                      section.id
                    ] = node;
                  }}
                  data-rail-id={
                    section.id
                  }
                  className="rail-track flex gap-6 overflow-x-auto overflow-y-visible pl-0 pr-0 scrollbar-none sm:pl-2 sm:pr-2"
                  onTouchStart={(
                    event
                  ) =>
                    handleTouchStart(
                      section.id,
                      event
                    )
                  }
                  onTouchMove={(
                    event
                  ) =>
                    handleTouchMove(
                      section.id,
                      event
                    )
                  }
                  onTouchEnd={() =>
                    handleTouchEnd(
                      section.id
                    )
                  }
                  onTouchCancel={() =>
                    handleTouchEnd(
                      section.id
                    )
                  }
                  onScroll={() =>
                    updateRailArrowState(
                      section.id
                    )
                  }
                >
                  {sectionTools.map(
                    (tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isExpanded={
                          expandedToolId ===
                          tool.id
                        }
                        onOpen={() =>
                          setExpandedToolId(
                            tool.id
                          )
                        }
                        onClose={() =>
                          setExpandedToolId(
                            null
                          )
                        }
                      />
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="rail-button rail-button-right"
                  aria-label={`Scroll ${section.label} right`}
                  disabled={
                    arrowState[
                      section.id
                    ]?.right ?? false
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
