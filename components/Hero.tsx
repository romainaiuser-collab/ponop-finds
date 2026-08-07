import Image from "next/image";

export default function Hero() {
  return (
    <section className="ponop-hero relative flex h-[20vh] min-h-[13rem] items-end overflow-hidden px-6 pb-8">
      <div className="ponop-hero-glow" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start justify-end text-left">
        <div className="hero-wordmark mt-6 mb-4">
          <Image
            src="/images/Ponop-Logo-white-transparent.png"
            alt="Ponop"
            width={320}
            height={80}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </div>

        <h1 className="hero-headline">
          Search less. Build more.
        </h1>

        <p className="hero-subtext">
          Discover software, AI tools and exclusive deals that are actually worth your time.
        </p>
      </div>
    </section>
  );
}