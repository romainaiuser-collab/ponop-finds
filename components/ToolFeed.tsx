"use client";

import { useEffect, useRef, useState } from "react";
import ToolCard from "./ToolCard";
import { tools } from "../data/tools";

const sections = [
  {
    id: "trending",
    label: "🔥 Trending Now",
    subtitle: "The tools everyone is talking about.",
    toolIds: ["mailer-lite", "beehiiv", "notion", "canva", "figma", "linear", "cursor", "claude"],
  },
  {
    id: "ai",
    label: "🤖 AI Tools",
    subtitle: "Our favorite AI-powered software.",
    toolIds: ["notion", "canva", "mailer-lite", "beehiiv", "cursor", "claude", "perplexity", "framer"],
  },
  {
    id: "wanted",
    label: "⭐ Most Wanted",
    subtitle: "The tools we recommend first.",
    toolIds: ["canva", "mailer-lite", "beehiiv", "notion", "zapier", "framer", "make", "airtable"],
  },
];

const featuredTools = (ids: string[]) =>
  ids
    .map((id) => tools.find((tool) => tool.id === id))
    .filter(Boolean) as typeof tools;

export default function ToolFeed() {
  const railRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [arrowState, setArrowState] = useState<Record<string, { left: boolean; right: boolean }>>({});

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
    const gap = Number.parseFloat(computedStyle.gap || computedStyle.columnGap || "0") || 0;

    rail.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });

    requestAnimationFrame(() => {
      updateRailArrowState(railId);
    });
  };
  
/*
  const handleRailWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const rail = event.currentTarget;

    if (Math.abs(event.deltaY) > 2) {
      event.preventDefault();
      rail.scrollLeft += event.deltaY;
      const railId = event.currentTarget.dataset.railId;
      if (railId) {
        updateRailArrowState(railId);
      }
    }
  };*/

  useEffect(() => {
    sections.forEach((section) => {
      updateRailArrowState(section.id);
    });
  }, []);

  return (
    <section className="space-y-16 border-t border-white/10 px-4 pb-24 pt-6 backdrop-blur-sm sm:px-6">
      {sections.map((section) => (
        <div key={section.id} className="tool-section w-full">
          <div className="tool-section-heading mb-4">
            <p className="text-sm uppercase tracking-[0.28em] text-[#3FC1C9] opacity-90">
              {section.label}
            </p>
            <p className="mt-2 max-w-2xl text-2xl font-semibold text-white sm:text-3xl">
              {section.subtitle}
            </p>
          </div>
          <div className="relative w-full rail-viewport">
            <div className="rail-carousel group relative w-full">
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
                onWheel={handleRailWheel}
                onScroll={() => updateRailArrowState(section.id)}
              >
                {featuredTools(section.toolIds).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

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
      ))}
    </section>
  );
}
