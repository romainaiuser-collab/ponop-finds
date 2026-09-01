import KitFeed from "../../components/KitFeed";
import { getPublishedKits } from "../../lib/kits";

export const dynamic = "force-dynamic";

export default async function KitsPage() {
  const kits = await getPublishedKits();

  return (
    <main className="min-h-screen bg-[#faf8f7] text-[#171717]">
      {/* Header */}
      <section className="px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D98F94]">
            ✨ Curated Kits
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Thoughtfully put together.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#68615f]">
            Complete ideas, carefully selected and ready to explore.
          </p>
        </div>
      </section>

      {/* Kit wall */}
      <section className="px-6 pb-24 sm:px-10">
        <KitFeed kits={kits} />
      </section>
    </main>
  );
}
