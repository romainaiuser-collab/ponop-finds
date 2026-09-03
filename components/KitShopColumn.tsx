"use client";

import {
  useEffect,
  useLayoutEffect,
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
  const columnRef =
    useRef<HTMLDivElement | null>(null);

  const [isFixed, setIsFixed] =
    useState(false);

  const [fixedStyle, setFixedStyle] =
    useState<{
      left: number;
      width: number;
    } | null>(null);

  /*
   * Keep the column's original document position.
   * This allows us to know when it should return
   * to the normal document flow while scrolling up.
   */
  const originalTopRef = useRef<number | null>(
    null
  );

  const heightRef = useRef(0);

  const updateMeasurements = () => {
    const element = columnRef.current;

    if (!element) {
      return;
    }

    const isDesktop =
      window.innerWidth >=
      DESKTOP_BREAKPOINT;

    if (!isDesktop) {
      setIsFixed(false);
      setFixedStyle(null);
      originalTopRef.current = null;
      return;
    }

    const rect =
      element.getBoundingClientRect();

    /*
     * When the element is in the normal flow,
     * record its absolute document position.
     */
    if (!isFixed) {
      originalTopRef.current =
        rect.top + window.scrollY;
    }

    heightRef.current = rect.height;

    setFixedStyle({
      left: rect.left,
      width: rect.width,
    });
  };

  const checkPosition = () => {
    const element = columnRef.current;

    if (!element) {
      return;
    }

    const isDesktop =
      window.innerWidth >=
      DESKTOP_BREAKPOINT;

    if (!isDesktop) {
      if (isFixed) {
        setIsFixed(false);
      }

      return;
    }

    /*
     * If the column is currently fixed, determine
     * whether scrolling back up should release it.
     */
    if (isFixed) {
      const originalTop =
        originalTopRef.current;

      if (originalTop === null) {
        return;
      }

      const naturalBottom =
        originalTop +
        heightRef.current -
        window.scrollY;

      /*
       * Once the natural position of the column
       * would put its bottom below the desired
       * viewport position, release the fixed state.
       */
      if (
        naturalBottom >
        window.innerHeight -
          BOTTOM_OFFSET
      ) {
        setIsFixed(false);
      }

      return;
    }

    /*
     * Normal scrolling:
     * detect when the bottom of the right column
     * reaches the bottom of the viewport.
     */
    const rect =
      element.getBoundingClientRect();

    if (
      rect.bottom <=
      window.innerHeight -
        BOTTOM_OFFSET
    ) {
      return;
    }

    /*
     * Only fix the column when its bottom has
     * reached/passed the viewport bottom.
     */
    if (
      rect.bottom >=
      window.innerHeight -
        BOTTOM_OFFSET
    ) {
      originalTopRef.current =
        rect.top + window.scrollY;

      heightRef.current =
        rect.height;

      setFixedStyle({
        left: rect.left,
        width: rect.width,
      });

      setIsFixed(true);
    }
  };

  useLayoutEffect(() => {
    updateMeasurements();
  });

  useEffect(() => {
    let frameId: number | null = null;

    const handleScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId =
        window.requestAnimationFrame(() => {
          frameId = null;
          checkPosition();
        });
    };

    const handleResize = () => {
      /*
       * Resize can change both the column width
       * and its height, so release fixed mode and
       * recalculate everything.
       */
      setIsFixed(false);
      originalTopRef.current = null;

      window.requestAnimationFrame(
        updateMeasurements
      );
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
      columnRef.current
        ? new ResizeObserver(() => {
            updateMeasurements();
          })
        : null;

    if (
      resizeObserver &&
      columnRef.current
    ) {
      resizeObserver.observe(
        columnRef.current
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

      resizeObserver?.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(
          frameId
        );
      }
    };
  }, [isFixed, kit.products.length]);

  /*
   * When fixed, keep a placeholder in the grid
   * so the left column does not move horizontally
   * or change the page layout.
   */
  const columnStyle = isFixed &&
    fixedStyle
    ? {
        position: "fixed" as const,
        left: `${fixedStyle.left}px`,
        width: `${fixedStyle.width}px`,
        bottom: `${BOTTOM_OFFSET}px`,
        zIndex: 20,
      }
    : undefined;

  return (
    <div
      className="min-w-0"
      style={{
        minHeight: isFixed
          ? `${heightRef.current}px`
          : undefined,
      }}
    >
      <div
        ref={columnRef}
        className="min-w-0"
        style={columnStyle}
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
