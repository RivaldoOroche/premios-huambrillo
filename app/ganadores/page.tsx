import Link from "next/link";
import { getGanadores } from "../lib/queries";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

export const revalidate = 60;

export default async function PaginaGanadores() {
  const ganadores = await getGanadores();

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">🏆</span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#e8b800] mb-2">
            Nuestros Ganadores
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-widest">
            Ellos ya cambiaron su vida con Premios Huambrillo
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8b800]" />
            <span className="text-[#e8b800] text-xs tracking-[6px]">★ ★ ★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8b800]" />
          </div>
        </FadeIn>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { valor: `${ganadores.length}+`, label: "Ganadores" },
            { valor: "S/ 2M+", label: "En premios" },
            { valor: "4 años", label: "De confianza" },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-[#111] border border-neutral-800 rounded-2xl p-4 text-center">
                <p className="font-bebas text-3xl sm:text-4xl text-[#e8b800] tracking-widest">{stat.valor}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <h2 className="font-bebas text-3xl tracking-widest text-[#e8b800] uppercase mb-2">Ganadores Recientes</h2>
        <div className="w-16 h-1 bg-red-600 rounded mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {ganadores.map((g, i) => (
            <FadeIn key={g.id} delay={i * 0.05}>
              <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl overflow-hidden hover:border-[#e8b800] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(232,184,0,0.1)]">
                <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#2a1500] flex items-center justify-center relative">
                  {g.foto_url ? (
                    <img src={g.foto_url} alt={g.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">{g.emoji}</span>
                  )}
                  <div className="absolute bottom-2 right-2 bg-[#e8b800] text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {g.fecha}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bebas text-xl tracking-widest text-white mb-1">{g.nombre}</p>
                  <p className="text-[#e8b800] font-black text-sm mb-1">{g.premio}</p>
                  <p className="text-neutral-500 text-xs uppercase tracking-wide">{g.sorteo}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-12 bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-8 text-center">
            <p className="font-bebas text-3xl text-[#e8b800] tracking-widest mb-2">¡Tú puedes ser el próximo!</p>
            <p className="text-neutral-400 text-sm mb-6">Participa en nuestros sorteos activos y cambia tu vida.</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:brightness-110 hover:scale-105 transition-all">
              Ver sorteos activos →
            </Link>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}