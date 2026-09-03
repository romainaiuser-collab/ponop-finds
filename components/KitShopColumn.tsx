"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { PublishedKit } from "../lib/types";

interface KitShopColumnProps {
  kit: PublishedKit;
}

const DESKTOP_BREAKPOINT = 1024;
const BOTTOM_OFFSET = 32;

export default function KitShopColumn({
  kit,
}: KitShopColumnProps) {
  const placeholderRef =
    useRef<HTMLDivElement | null>(null);

  const contentRef =
    useRef<HTMLDivElement | null>(null);

  const [isFixed, setIsFixed] =
    useState(false);

  const [fixedPosition, setFixedPosition] =
    useState<{
      left: number;
      width: number;
    } | null>(null);

  const lastScrollY =
    useRef(0);

  const contentHeight =
    useRef(0);

  /*
   * Measure the column.
   */
  const measure = () => {
    const placeholder =
      placeholderRef.current;

    const content =
      contentRef.current;

    if (!placeholder || !content) {
      return;
    }

    if (
      window.innerWidth <
      DESKTOP_BREAKPOINT
    ) {
      return;
    }

    const rect =
      placeholder.getBoundingClientRect();

    const contentRect =
      content.getBoundingClientRect();

    contentHeight.current =
      contentRect.height;

    setFixedPosition({
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    lastScrollY.current =
      window.scrollY;

    measure();

    const handleScroll = () => {
      if (
        window.innerWidth <
        DESKTOP_BREAKPOINT
      ) {
        return;
      }

      const placeholder =
        placeholderRef.current;

      if (!placeholder) {
        return;
      }

      const currentScrollY =
        window.scrollY;

      const scrollingDown =
        currentScrollY >
        lastScrollY.current;

      const scrollingUp =
        currentScrollY <
        lastScrollY.current;

      lastScrollY.current =
        currentScrollY;

      const rect =
        placeholder.getBoundingClientRect();

      const bottomLimit =
        window.innerHeight -
        BOTTOM_OFFSET;

      /*
       * NORMAL MODE
       *
       * The two columns scroll together.
       *
       * We only freeze the right column when
       * its bottom reaches the bottom of the viewport.
       */
      if (!isFixed && scrollingDown) {
        if (
          rect.bottom <=
          bottomLimit
        ) {
          const content =
            contentRef.current;

          if (!content) {
            return;
          }

          const contentRect =
            content.getBoundingClientRect();

          setFixedPosition({
            left: rect.left,
            width: rect.width,
          });

          contentHeight.current =
            contentRect.height;

          setIsFixed(true);
        }
      }

      /*
       * FIXED MODE
       *
       * When scrolling back up, release the
       * right column as soon as its natural
       * position would put it back above the
       * bottom limit.
       */
      if (isFixed && scrollingUp) {
        if (
          rect.bottom >
          bottomLimit
        ) {
          setIsFixed(false);
          setFixedPosition(null);
        }
      }
    };

    const handleResize = () => {
      /*
       * On resize, always return to normal flow
       * and recalculate dimensions.
       */
      if (
        window.innerWidth <
        DESKTOP_BREAKPOINT
      ) {
        setIsFixed(false);
        setFixedPosition(null);
      } else {
        setIsFixed(false);
        setFixedPosition(null);

        window.requestAnimationFrame(
          measure
        );
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    const resizeObserver =
      new ResizeObserver(() => {
        if (!isFixed) {
          measure();
        }
      });

    if (contentRef.current) {
      resizeObserver.observe(
        contentRef.current
      );
    }

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      resizeObserver.disconnect();
    };
  }, [isFixed]);

  /*
   * When fixed, keep the original space
   * occupied in the grid.
   */
  const placeholderStyle =
    isFixed
      ? {
          minHeight: `${contentHeight.current}px`,
        }
      : undefined;

  const contentStyle =
    isFixed && fixedPosition
      ? {
          position: "fixed" as const,
          left: `${fixedPosition.left}px`,
          width: `${fixedPosition.width}px`,
          bottom: `${BOTTOM_OFFSET}px`,
          zIndex: 20,
        }
      : undefined;

  return (
    <div
      ref={placeholderRef}
      className="min-w-0"
      style={placeholderStyle}
    >
      <div
        ref={contentRef}
        className="min-w-0"
        style={contentStyle}
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
              {kit.products.map(
                (product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-2xl border border-[#e8e2df] bg-white p-4"
                  >
                    {/* Product image */}
                    {product.imageUrl ? (
                      <img
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.title ??
                          ""
                        }
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
                          {
                            product.reason
                          }
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    {product.affiliateLink && (
                      <a
                        href={
                          product.affiliateLink
                        }
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="shrink-0 rounded-full bg-[#f2b5b8] px-4 py-2 text-sm font-semibold text-[#171717] transition hover:bg-[#d98f94]"
                      >
                        Shop
                      </a>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
