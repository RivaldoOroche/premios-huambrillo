import Link from "next/link";
import { ganadores } from "../data/ganadores";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PaginaGanadores() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
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
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { valor: "500+", label: "Ganadores" },
            { valor: "S/ 2M+", label: "En premios" },
            { valor: "4 años", label: "De confianza" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111] border border-neutral-800 rounded-2xl p-4 text-center">
              <p className="font-bebas text-3xl sm:text-4xl text-[#e8b800] tracking-widest">{stat.valor}</p>
              <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grid de ganadores */}
        <h2 className="font-bebas text-3xl tracking-widest text-[#e8b800] uppercase mb-2">
          Ganadores Recientes
        </h2>
        <div className="w-16 h-1 bg-red-600 rounded mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {ganadores.map((ganador) => (
            <div
              key={ganador.id}
              className="bg-[#111] border-2 border-neutral-800 rounded-2xl overflow-hidden hover:border-[#e8b800] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(232,184,0,0.1)]"
            >
              {/* Imagen placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#2a1500] flex items-center justify-center text-6xl relative">
                {ganador.emoji}
                <div className="absolute bottom-2 right-2 bg-[#e8b800] text-black text-xs font-black px-2 py-0.5 rounded-full">
                  {ganador.fecha}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-bebas text-xl tracking-widest text-white mb-1">
                  {ganador.nombre}
                </p>
                <p className="text-[#e8b800] font-black text-sm mb-1">
                  {ganador.premio}
                </p>
                <p className="text-neutral-500 text-xs uppercase tracking-wide">
                  {ganador.sorteo}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-8 text-center">
          <p className="font-bebas text-3xl text-[#e8b800] tracking-widest mb-2">
            ¡Tú puedes ser el próximo!
          </p>
          <p className="text-neutral-400 text-sm mb-6">
            Participa en nuestros sorteos activos y cambia tu vida.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:brightness-110 hover:scale-105 transition-all"
          >
            Ver sorteos activos →
          </Link>
        </div>

      </section>

      <Footer />
    </main>
  );
}