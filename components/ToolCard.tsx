import type { PublishedTool } from "../lib/types";

interface ToolCardProps {
  tool: PublishedTool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const isExpanded = false;

  return (
    <a
      href={tool.affiliateLink ?? "#"}
      className="tool-card group flex-shrink-0 overflow-visible rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_30px_80px_-30px_rgba(63,193,201,0.35)] hover:border-[#3FC1C9]/30"
      aria-expanded={isExpanded}
    >
      <div className="overflow-hidden rounded-t-[2rem]">
        {tool.imageUrl ? (
          <img
            src={tool.imageUrl}
            alt={tool.altText ?? tool.title ?? ""}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#3FC1C9] to-[#BEED6E]" />
        )}
      </div>

      <div className="card-content space-y-4 px-6 pb-3 pt-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-white">
            {tool.title}
          </h3>

          <p className="text-sm leading-6 text-slate-300">
            {tool.hook ?? tool.description ?? tool.summary}
          </p>
        </div>

        <p className="text-sm uppercase tracking-[0.24em] text-[#BEED6E]/80">
          {tool.publishedAt
            ? new Date(tool.publishedAt).toLocaleDateString("en-GB")
            : ""}
        </p>
      </div>
    </a>
  );
}