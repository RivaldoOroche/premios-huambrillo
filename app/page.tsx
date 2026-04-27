import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SorteosSection from "./components/Sorteos";
import AlertaSeguridad from "./components/AlertaSeguridad";
import GanadoresSection from "./components/Ganadores";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { getSorteos, getGanadores } from "./lib/queries";

export const revalidate = 60; // refresca cada 60 segundos

export default async function Home() {
  const [sorteos, ganadores] = await Promise.all([
    getSorteos(),
    getGanadores(),
  ]);
  // console.log("🔥 sorteos:", sorteos);
  // console.log("🔥 ganadores:", ganadores);
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />
      <Hero />
      <SorteosSection sorteos={sorteos} />
      <AlertaSeguridad />
      <GanadoresSection ganadores={ganadores} />
      <FAQ />
      <Footer />
    </main>
  );
}