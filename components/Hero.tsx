import Image from "next/image";

export default function Hero() {
  return (
    <section className="ponop-hero relative overflow-hidden px-4 py-8 sm:px-6">
      <div className="relative ml-[var(--page-gutter)] mr-[var(--page-gutter)] flex w-auto flex-col items-start text-left max-[639px]:ml-2 max-[639px]:mr-2">
        <div className="mb-4">
          <a href="https://www.ponop.io" aria-label="Ponop home">
            <Image
              src="/images/Ponop-finds-logo-black-transparent.png"
              alt="Ponop"
              width={320}
              height={164}
              priority
              className="block h-14 w-auto sm:h-16"
            />
          </a>
        </div>

        <h1 className="hero-headline">
          Search less. Build more.
        </h1>

        <p className="hero-subtext">
          Discover software, AI tools and exclusive deals that are actually
          worth your time.
        </p>
      </div>
    </section>
  );
}
