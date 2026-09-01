import { getPublishedKits } from "../../lib/kits";

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
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((kit) => (
            <article
              key={kit.id}
              className="overflow-hidden rounded-[2rem] border border-[#E8E2DF] bg-white shadow-[0_18px_45px_-28px_rgba(30,20,20,0.28)]"
            >
              {/* Kit image */}
              <div className="aspect-[4/3] overflow-hidden">
                {kit.imageUrl ? (
                  <img
                    src={kit.imageUrl}
                    alt={kit.altText ?? kit.title ?? kit.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#f2b5b8]" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-4 px-6 pb-7 pt-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {kit.title ?? kit.name}
                  </h2>

                  {kit.hook && (
                    <p className="mt-3 text-sm leading-6 text-[#68615f]">
                      {kit.hook}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]"
                >
                  Explore kit
                  <span className="ml-2">→</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
