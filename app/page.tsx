import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ToolFeed from "../components/ToolFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#101820] text-white">
      <Hero />
      <ToolFeed />
      <Footer />
    </div>
  );
}
