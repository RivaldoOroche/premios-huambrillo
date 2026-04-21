import Link from "next/link";
import { empresas } from "../data/empresas";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { sorteos } from "../data/sorteos";

export default function PaginaEmpresas() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
        <span className="text-5xl block mb-3">🏢</span>
        <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#e8b800] mb-2">
          Empresas Donantes
        </h1>
        <p className="text-neutral-400 text-sm uppercase tracking-widest max-w-lg mx-auto">
          Conoce las empresas y emprendedores que hacen posibles nuestros premios
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8b800]" />
          <span className="text-[#e8b800] text-xs tracking-[6px]">★ ★ ★</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8b800]" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { valor: `${empresas.length}+`, label: "Aliadas" },
            { valor: "100%", label: "Verificadas" },
            { valor: "Perú", label: "Nacional" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#111] border border-neutral-800 rounded-2xl p-4 text-center">
              <p className="font-bebas text-3xl sm:text-4xl text-[#e8b800] tracking-widest">{stat.valor}</p>
              <p className="text-neutral-500 text-[10px] sm:text-xs uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grid empresas */}
        <h2 className="font-bebas text-3xl tracking-widest text-[#e8b800] uppercase mb-2">
          Nuestros Aliados
        </h2>
        <div className="w-16 h-1 bg-red-600 rounded mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {empresas.map((empresa) => {
            const sorteosEmpresa = sorteos.filter((s) => empresa.sorteos.includes(s.id));
            return (
              <Link
                key={empresa.id}
                href={`/empresas/${empresa.id}`}
                className="bg-[#111] border-2 border-neutral-800 rounded-2xl overflow-hidden hover:border-[#e8b800] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(232,184,0,0.1)] group"
              >
                {/* Logo */}
                <div className="aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#1a1000] flex items-center justify-center text-6xl relative">
                  {empresa.emoji}
                  <div className="absolute top-2 right-2 bg-[#e8b800] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                    {empresa.categoria}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bebas text-xl tracking-widest text-white group-hover:text-[#e8b800] transition-colors mb-1">
                    {empresa.nombre}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2">
                    {empresa.descripcion}
                  </p>

                  {/* Sorteos */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {sorteosEmpresa.map((s) => (
                      <span key={s.id} className="text-[10px] bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full">
                        {s.fecha}
                      </span>
                    ))}
                  </div>

                  {/* Contacto rápido */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>📞 {empresa.telefono}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA para empresas - CORREGIDO */}
        <div className="mt-12 bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-8 text-center">
          <p className="font-bebas text-3xl text-[#e8b800] tracking-widest mb-2">
            ¿Quieres ser empresa donante?
          </p>
          <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">
            Dale visibilidad a tu negocio participando como donante en nuestros sorteos. Miles de personas verán tu marca.
          </p>
          
          <a
            href="https://wa.me/51999000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-green-700 via-green-500 to-green-700 text-white font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:brightness-110 hover:scale-105 transition-all"
          >
            💬 Contáctanos por WhatsApp
          </a>
        </div>

      </section>

      <Footer />
    </main>
  );
}