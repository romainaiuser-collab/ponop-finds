import Image from "next/image";

export default function Hero() {
  return (
    <section className="ponop-hero relative overflow-hidden px-6 py-8">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-start text-left">

        <div className="mb-4">
          <Image
            src="/images/Ponop-Logo-white-transparent.png"
            alt="Ponop"
            width={320}
            height={80}
            priority
            className="block h-14 w-auto sm:h-16"
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