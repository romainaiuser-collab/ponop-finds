import Image from "next/image";

export default function Hero() {
  return (
    <section className="ponop-hero relative flex h-[20vh] min-h-[13rem] items-end overflow-hidden px-6 pb-8">
      <div className="ponop-hero-glow" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start justify-end text-left">
        <div className="hero-wordmark mt-6 mb-4">
          <img
            src="/images/Ponop-Logo-white-transparent.png"
            alt="Ponop"
            style={{ width: "320px", height: "80px" }}
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