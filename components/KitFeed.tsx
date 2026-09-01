"use client";

import { useState } from "react";
import KitCard from "./KitCard";
import type { PublishedKit } from "../lib/types";

interface KitFeedProps {
  kits: PublishedKit[];
}

/*
 * Sort Kits by creation date:
 * newest first.
 *
 * Kits without a createdAt date are placed at the end.
 */
function sortByNewest(kits: PublishedKit[]): PublishedKit[] {
  return [...kits].sort((a, b) => {
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

export default function KitFeed({ kits }: KitFeedProps) {
  const [expandedKitId, setExpandedKitId] =
    useState<string | null>(null);

  const sortedKits = sortByNewest(kits);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedKits.map((kit) => (
        <KitCard
          key={kit.id}
          kit={kit}
          isExpanded={expandedKitId === kit.id}
          onOpen={() => setExpandedKitId(kit.id)}
          onClose={() => setExpandedKitId(null)}
        />
      ))}
    </div>
  );
}
