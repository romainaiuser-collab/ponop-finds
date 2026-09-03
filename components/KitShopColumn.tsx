"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { PublishedKit } from "../lib/types";

interface KitShopColumnProps {
  kit: PublishedKit;
}

export default function KitShopColumn({
  kit,
}: KitShopColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);

  const [stickyTop, setStickyTop] =
    useState(32);

  useLayoutEffect(() => {
    const element = columnRef.current;

    if (!element) {
      return;
    }

    const updateStickyPosition = () => {
      const height =
        element.getBoundingClientRect().height;

      const viewportHeight =
        window.innerHeight;

      const bottomMargin = 32;

      const calculatedTop =
        viewportHeight -
        height -
        bottomMargin;

      /*
       * If the column is taller than the viewport,
       * keep a small top margin instead of creating
       * a negative sticky position.
       */
      setStickyTop(
        Math.max(32, calculatedTop)
      );
    };

    updateStickyPosition();

    const resizeObserver =
      new ResizeObserver(
        updateStickyPosition
      );

    resizeObserver.observe(element);

    window.addEventListener(
      "resize",
      updateStickyPosition
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateStickyPosition
      );
    };
  }, [kit.products.length]);

  return (
    <div
      ref={columnRef}
      className="min-w-0 lg:sticky lg:self-start"
      style={{
        top: `${stickyTop}px`,
      }}
    >
      {/* Kit introduction */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d98f94]">
          ✨ Curated Kit
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {kit.title ?? kit.name}
        </h1>

        {kit.description && (
          <p className="mt-5 text-lg leading-8 text-[#68615f]">
            {kit.description}
          </p>
        )}
      </div>

      {/* Shop the Kit */}
      {kit.products.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">
            Shop the Kit
          </h2>

          <div className="mt-5 space-y-3">
            {kit.products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-[#e8e2df] bg-white p-4"
              >
                {/* Product image */}
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title ?? ""}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-[#f3efed]" />
                )}

                {/* Product content */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-6 text-[#171717]">
                    {product.title ??
                      product.reason ??
                      "Selected product"}
                  </p>

                  {product.reason && (
                    <p className="mt-1 text-sm leading-5 text-[#68615f]">
                      {product.reason}
                    </p>
                  )}
                </div>

                {/* CTA */}
                {product.affiliateLink && (
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="shrink-0 rounded-full bg-[#f2b5b8] px-4 py-2 text-sm font-semibold text-[#171717] transition hover:bg-[#d98f94]"
                  >
                    Shop
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
