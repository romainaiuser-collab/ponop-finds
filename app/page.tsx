import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ToolFeed from "../components/ToolFeed";
import { getPublishedTools } from "../lib/tools";

export default async function Home() {
  const tools = await getPublishedTools();

  return (
    <div className="min-h-screen bg-[#101820] text-white">
      <Hero />
      <ToolFeed tools={tools} />
      <Footer />
    </div>
  );
}