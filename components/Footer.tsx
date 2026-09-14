import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E2DF] bg-[#faf8f7] px-6 py-10 text-center">
      <div className="flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-center sm:gap-6">
        <Link
          href="/privacy"
          className="text-[#68615F] transition-colors hover:text-[#D98F94]"
        >
          Privacy Policy
        </Link>
      </div>

      <p className="mt-4 text-sm text-[#8B8380]">
        © 2026 Ponop. All rights reserved.
      </p>
    </footer>
  );
}
