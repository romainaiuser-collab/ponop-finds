import Image from "next/image";

export default function Hero() {
  return (
    <section className="ponop-hero relative flex h-[20vh] min-h-[13rem] items-end overflow-hidden px-6 pb-8">
      <div className="ponop-hero-glow" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start justify-end text-left">

        {/* Logo */}
        <div className="mb-4 -ml-2">
          <Image
            src="/images/Ponop-Logo-white-transparent.png"
            alt="Ponop"
            width={320}
            height={80}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </div>

        {/* Titre */}
        <h1 className="mb-3 text-balance text-5xl font-black uppercase tracking-[-0.05em] text-white sm:text-6xl">
          Search less. Build more.
        </h1>

        {/* Sous-titre */}
        <p className="max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          Discover software, AI tools and exclusive deals that are actually worth your time.
        </p>

      </div>
    </section>
  );
}
