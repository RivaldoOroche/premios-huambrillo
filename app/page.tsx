import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Sorteos from "./components/Sorteos";

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />
      <Hero />
      <Sorteos />
    </main>
  );
}