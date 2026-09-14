"use client";

import { useEffect, useRef, useState } from "react";
import type { PublishedKit } from "../lib/types";

interface KitRailProps {
  kits: PublishedKit[];
}

export default function KitRail({ kits }: KitRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    direction: "undecided" | "horizontal" | "vertical";
  } | null>(null);
  const [arrowState, setArrowState] = useState({ left: true, right: false });

  const visibleKits = kits.slice(0, 10);

  const updateArrowState = () => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScrollLeft = Math.max(rail.scrollWidth - rail.clientWidth, 0);
    setArrowState({
      left: rail.scrollLeft <= 4,
      right: rail.scrollLeft >= maxScrollLeft - 4,
    });
  };

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const firstCard = rail.querySelector(".kit-rail-card") as HTMLElement | null;
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(rail);
    const gap = Number.parseFloat(computedStyle.gap || computedStyle.columnGap || "0") || 0;
    rail.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
    requestAnimationFrame(updateArrowState);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const rail = railRef.current;
    if (!touch || !rail) return;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: rail.scrollLeft,
      direction: "undecided",
    };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.touches[0];
    const rail = railRef.current;
    if (!start || !touch || !rail) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (start.direction === "undecided" && Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) {
      return;
    }

    if (start.direction === "undecided") {
      start.direction = Math.abs(deltaY) > Math.abs(deltaX) ? "vertical" : "horizontal";
    }

    if (start.direction === "vertical") return;

    event.preventDefault();
    rail.scrollLeft = start.scrollLeft - deltaX;
    updateArrowState();
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    requestAnimationFrame(updateArrowState);
  };

  useEffect(() => {
    updateArrowState();
  }, [visibleKits.length]);

  if (visibleKits.length === 0) return null;

  return (
    <div className="tool-section w-full">
      <div className="tool-section-heading mb-3">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D98F94]">
              ✨ Curated Kits
            </p>
            <p className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
              Thoughtfully put together.
            </p>
          </div>

          <a
            href="/kits"
            className="mb-1 shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#68615F] transition-colors hover:text-[#D98F94]"
          >
            Explore all
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>

      <div className="relative w-full rail-viewport">
        <div className="rail-carousel relative w-full">
          <button
            type="button"
            className="rail-button rail-button-left"
            aria-label="Scroll Curated Kits left"
            disabled={arrowState.left}
            onClick={() => scrollRail(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div
            ref={railRef}
            className="rail-track flex gap-6 overflow-x-auto overflow-y-visible pl-0 pr-0 scrollbar-none sm:pl-2 sm:pr-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onScroll={updateArrowState}
          >
            {visibleKits.map((kit) => (
              <article
                key={kit.id}
                className="kit-rail-card relative w-[76vw] max-w-[calc(100vw-2rem)] flex-shrink-0 sm:w-[360px]"
              >
                <a
                  href={`/kits/${kit.slug}`}
                  className="group relative block w-full overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white text-left shadow-[0_18px_45px_-28px_rgba(30,20,20,0.28)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:border-[#F3B1B4] hover:shadow-[0_30px_80px_-30px_rgba(217,143,148,0.38)]"
                >
                  <div className="relative w-full overflow-hidden bg-[#F7F4F2]">
                    {kit.imageUrl ? (
                      <img
                        src={kit.imageUrl}
                        alt={kit.altText ?? kit.title ?? kit.name ?? "Ponop Kit"}
                        className="block h-auto w-full object-top transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[2/3] w-full bg-gradient-to-br from-[#F8D9DA] via-[#F4BFC2] to-[#EED9D5]" />
                    )}

                    <div className="absolute inset-x-0 bottom-0 z-10 bg-[rgba(255,255,255,0.78)] px-5 pb-5 pt-5 backdrop-blur-[5px] sm:px-6 sm:pb-6 sm:pt-5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D98F94]">
                          Explore the idea
                        </p>
                        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F2B5B8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#171717] shadow-[0_8px_24px_-8px_rgba(217,143,148,0.45)] transition group-hover:scale-[1.02] group-hover:bg-[#EFA9AD]">
                          Explore Kit
                          <span className="ml-2">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="rail-button rail-button-right"
            aria-label="Scroll Curated Kits right"
            disabled={arrowState.right}
            onClick={() => scrollRail(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
