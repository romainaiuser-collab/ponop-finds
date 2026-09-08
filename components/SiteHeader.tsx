"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  const isKitsPage =
    pathname === "/kits" ||
    pathname.startsWith("/kits/");

  return (
    <header className="site-header-editorial w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 sm:py-6">
        {/* Brand */}
        <Link
          href="/"
          aria-label="Ponop Finds home"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/Ponop-finds-logo-black-transparent.png"
            alt="Ponop Finds"
            width={320}
            height={164}
            priority
            className="block h-14 w-auto sm:h-16"
          />
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-6 text-sm font-medium sm:gap-8"
        >
          <Link
            href="/"
            className={
              !isKitsPage
                ? "text-[#171717]"
                : "text-[#68615f] transition-colors hover:text-[#d98f94]"
            }
          >
            Finds
          </Link>

          <Link
            href="/kits"
            className={
              isKitsPage
                ? "text-[#171717]"
                : "text-[#68615f] transition-colors hover:text-[#d98f94]"
            }
          >
            Kits
          </Link>
        </nav>
      </div>
    </header>
  );
}
