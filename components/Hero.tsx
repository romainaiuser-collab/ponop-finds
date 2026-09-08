import Image from "next/image";

export default function Hero() {
  return (
    <section className="ponop-hero ponop-hero-editorial relative overflow-hidden px-4 py-8 sm:px-6">
      <div className="relative ml-[var(--page-gutter)] mr-[var(--page-gutter)] flex w-auto flex-col items-start text-left max-[639px]:ml-2 max-[639px]:mr-2">
        <div className="mb-4">
          <a href="https://finds.ponop.io" aria-label="Ponop home">
            <Image
              src="/images/Ponop-finds-logo-black-transparent.png"
              alt="Ponop Finds"
              width={320}
              height={164}
              priority
              className="block h-14 w-auto sm:h-16"
            />
          </a>
        </div>

        <h1 className="hero-headline">
          Search less. Live more.
        </h1>

        <p className="hero-subtext">
          Everyday finds that make life easier, prettier and a little more fun.
        </p>

        <div className="hero-collections">
          <p className="hero-collections-label">
            Explore by collection
          </p>

          <nav
            className="hero-collections-nav"
            aria-label="Explore collections"
          >
            <a
              href="#most-wanted"
              className="hero-collection-link"
            >
              <span>Most Wanted</span>
              <span
                className="hero-collection-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>

            <a
              href="#curated-kits"
              className="hero-collection-link"
            >
              <span>Curated Kits</span>
              <span
                className="hero-collection-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>

            <a
              href="#back-to-school"
              className="hero-collection-link"
            >
              <span>Back to School</span>
              <span
                className="hero-collection-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>

            <a
              href="#smart-home"
              className="hero-collection-link"
            >
              <span>Smart Home</span>
              <span
                className="hero-collection-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>

            <a
              href="#halloween"
              className="hero-collection-link"
            >
              <span>Halloween</span>
              <span
                className="hero-collection-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>

            <a
              href="#all-finds"
              className="hero-collection-link"
            >
              <span>All Finds</span>
              <span
                className="hero-collection-arrow"
                aria-hidden="true"
              >
                ↓
              </span>
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
