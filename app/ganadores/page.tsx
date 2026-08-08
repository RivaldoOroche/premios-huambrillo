import Link from "next/link";
import { getGanadores } from "../lib/queries";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

export const revalidate = 60;

export default async function PaginaGanadores() {
  const ganadores = await getGanadores();

  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#1a3a2a] text-center py-12 px-4 border-b-2 border-[#c9a84c] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">🏆</span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#c9a84c] mb-2">
            Nuestros Ganadores
          </h1>
          <p className="text-white/70 text-sm uppercase tracking-widest">
            Ellos ya cambiaron su vida con Premios Huambrillo
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[6px]">★ ★ ★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
        </FadeIn>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { valor: `${ganadores.length}+`, label: "Ganadores" },
            //{ valor: "S/ 600", label: "En premios" },
            // { valor: "4 años", label: "De confianza" },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="w-[150px] sm:w-[200px] bg-white border border-[#c9a84c]/30 rounded-2xl p-4 text-center shadow-sm">
                <p className="font-bebas text-3xl sm:text-4xl text-[#1a3a2a] tracking-widest">{stat.valor}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Título sección */}
        <h2 className="font-bebas text-3xl tracking-widest text-[#1a3a2a] uppercase mb-2">Ganadores Recientes</h2>
        <div className="w-16 h-1 bg-[#c9a84c] rounded mb-8" />

        {/* Grid ganadores */}
        {ganadores.length === 0 ? (
          <p className="text-neutral-500 text-center py-16">
            Aún no hay ganadores publicados. ¡Muy pronto!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {ganadores.map((g, i) => (
              <FadeIn key={g.id} delay={i * 0.05}>
                <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl overflow-hidden hover:border-[#c9a84c] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] h-full flex flex-col">
                  <div className="aspect-video bg-gradient-to-br from-[#f5f0e8] to-[#e8dfc8] flex items-center justify-center relative overflow-hidden">
                    {g.foto_url ? (
                      <img
                        src={g.foto_url}
                        alt={`${g.nombre} — ${g.premio}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">{g.emoji}</span>
                    )}
                    {g.fecha && (
                      <div className="absolute bottom-2 right-2 bg-[#c9a84c] text-[#1a3a2a] text-xs font-black px-2 py-0.5 rounded-full shadow">
                        {g.fecha}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1">
                    <p className="font-bebas text-xl tracking-widest text-[#1a3a2a] mb-1">{g.nombre}</p>
                    <p className="text-[#c9a84c] font-black text-sm mb-1">{g.premio}</p>
                    {g.sorteo && (
                      <p className="text-neutral-500 text-xs uppercase tracking-wide">{g.sorteo}</p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mt-12 bg-[#1a3a2a] border-2 border-[#c9a84c]/40 rounded-2xl p-8 text-center">
            <p className="font-bebas text-3xl text-[#c9a84c] tracking-widest mb-2">¡Tú puedes ser el próximo!</p>
            <p className="text-white/70 text-sm mb-6">Participa en nuestros sorteos activos y cambia tu vida.</p>
            <Link
              href="/"
              className="inline-block bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#c9a84c]/30"
            >
              Ver sorteos activos →
            </Link>
          </div>
        </FadeIn>

      </section>

      <Footer />
    </main>
  );
}