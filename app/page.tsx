import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ToolFeed from "../components/ToolFeed";
import { getPublishedKits } from "../lib/kits";
import { getPublishedTools } from "../lib/tools";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [tools, kits] = await Promise.all([
    getPublishedTools(),
    getPublishedKits(),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F7] text-[#171717]">
      <Hero />

      <ToolFeed
        tools={tools}
        kits={kits}
      />

      <Footer />
    </div>
  );
}
