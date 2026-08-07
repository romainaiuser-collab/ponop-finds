export default function Hero() {
  return (
    <section className="ponop-hero relative flex h-[25vh] min-h-[16rem] items-end overflow-hidden px-6 pb-8">
      <div className="ponop-hero-glow" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start justify-end gap-4 text-left">
            <Image
              src="/images/logo-p.png"
              alt="Ponop"
              width={220}
              height={70}
              priority
              className="h-16 w-auto sm:h-20"
            />
        <h1 className="text-balance text-5xl font-black uppercase tracking-[-0.05em] text-white sm:text-6xl">
          Search less. Build more.
        </h1>
        <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          Discover software, AI tools and exclusive deals that are actually worth your time.
        </p>
      </div>
    </section>
  );
}
