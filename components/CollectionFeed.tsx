"use client";

import { useState } from "react";
import ToolCard from "./ToolCard";
import type { PublishedTool } from "../lib/types";

interface CollectionFeedProps {
  tools: PublishedTool[];
}

function sortByNewest(tools: PublishedTool[]): PublishedTool[] {
  return [...tools].sort((a, b) => {
    if (!a.createdAt && !b.createdAt) return 0;
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export default function CollectionFeed({ tools }: CollectionFeedProps) {
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const sortedTools = sortByNewest(tools);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedTools.map((tool) => (
        <div key={tool.id} className="min-w-0 w-full [&>div]:!w-full">
          <ToolCard
            tool={tool}
            isExpanded={expandedToolId === tool.id}
            onOpen={() => setExpandedToolId(tool.id)}
            onClose={() => setExpandedToolId(null)}
          />
        </div>
      ))}
    </div>
  );
}
