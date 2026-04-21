import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Sorteos from "./components/Sorteos";
import AlertaSeguridad from "./components/AlertaSeguridad";
import Ganadores from "./components/Ganadores";
import FAQ from "./components/Faq";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />
      <Hero />
      <Sorteos />
      <AlertaSeguridad />
      <Ganadores />
      <FAQ />
      <Footer />
    </main>
  );
}