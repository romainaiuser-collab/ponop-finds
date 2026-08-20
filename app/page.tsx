import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ToolFeed from "../components/ToolFeed";
import { getPublishedTools } from "../lib/tools";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tools = await getPublishedTools();

  return (
    <div className="min-h-screen bg-[#FAF8F7] text-[#171717]">
      <Hero />
      <ToolFeed tools={tools} />
      <Footer />
    </div>
  );
}
