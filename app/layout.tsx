import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ponop Finds",
  description:
    "Smart finds for everyday life. Discover products worth knowing.",
  icons: {
    icon: "/images/logo-p-rose.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#101820] text-white font-[family:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
