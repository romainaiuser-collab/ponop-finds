import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E2DF] bg-[#faf8f7] px-6 py-10 text-sm text-[#68615F] sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-sm text-[#8B8380] sm:text-left">
          © 2026 Ponop. All rights reserved.
        </p>

        <div className="flex items-center justify-center gap-5 sm:justify-end">
          <a
            href="https://fr.pinterest.com/HeyPonop/"
            target="_blank"
            rel="noreferrer"
            aria-label="Ponop on Pinterest"
            title="Pinterest"
            className="text-[#68615F] transition-colors hover:text-[#D98F94]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 2.25a9.75 9.75 0 0 0-3.56 18.83c-.08-1.6-.01-3.52.4-5.05l1.45-6.13s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.69 0 1.03-.66 2.57-1 4-.29 1.2.6 2.18 1.79 2.18 2.15 0 3.8-2.27 3.8-5.55 0-2.9-2.08-4.93-5.05-4.93-3.44 0-5.46 2.58-5.46 5.25 0 1.04.4 2.16.9 2.77.1.12.11.23.08.36l-.34 1.38c-.06.22-.18.27-.41.16-1.5-.7-2.44-2.9-2.44-4.67 0-3.8 2.76-7.3 7.96-7.3 4.18 0 7.43 2.98 7.43 6.96 0 4.15-2.62 7.5-6.26 7.5-1.22 0-2.36-.64-2.75-1.4l-.75 2.84c-.27 1.04-1 2.35-1.5 3.15.96.3 1.97.46 3.02.46A9.75 9.75 0 1 0 12 2.25Z" />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/heyponop/"
            target="_blank"
            rel="noreferrer"
            aria-label="Ponop on Instagram"
            title="Instagram"
            className="text-[#68615F] transition-colors hover:text-[#D98F94]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-none stroke-current"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.25" />
              <circle cx="17.25" cy="6.75" r="1" className="fill-current stroke-none" />
            </svg>
          </a>

          <span className="h-5 w-px bg-[#E8E2DF]" aria-hidden="true" />

          <Link
            href="/privacy"
            className="font-medium text-[#68615F] transition-colors hover:text-[#D98F94]"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
