import Link from "next/link";
import { getEmpresas, getSorteos } from "../lib/queries";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

export const revalidate = 60;

export default async function PaginaEmpresas() {
  const [empresas, sorteos] = await Promise.all([getEmpresas(), getSorteos()]);

  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      <section className="relative bg-[#1a3a2a] text-center py-12 px-4 border-b-2 border-[#c9a84c] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">🏢</span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#c9a84c] mb-2">
            Empresas Aliadas
          </h1>
          <p className="text-white/70 text-sm uppercase tracking-widest max-w-lg mx-auto">
            Conoce las empresas y emprendedores que hacen posibles nuestros premios
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[6px]">★ ★ ★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
        </FadeIn>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { valor: `${empresas.length}+`, label: "Empresas aliadas" },
            { valor: "100%", label: "Verificadas" },
            { valor: "Perú", label: "Cobertura nacional" },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-white border border-[#c9a84c]/30 rounded-2xl p-4 text-center shadow-sm">
                <p className="font-bebas text-3xl sm:text-4xl text-[#1a3a2a] tracking-widest">{stat.valor}</p>
                <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <h2 className="font-bebas text-3xl tracking-widest text-[#1a3a2a] uppercase mb-2">Nuestros Aliados</h2>
        <div className="w-16 h-1 bg-[#c9a84c] rounded mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {empresas.map((empresa, i) => {
            const sorteosEmpresa = empresa.empresa_sorteo?.map((es: { sorteo_id: string }) =>
              sorteos.find((s) => s.sorteo_id === es.sorteo_id)
            ).filter(Boolean) ?? [];

            return (
              <FadeIn key={empresa.id} delay={i * 0.05}>
                <Link
                  href={`/empresas/${empresa.id}`}
                  className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl overflow-hidden hover:border-[#c9a84c] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] group block"
                >
                <div className="aspect-video bg-gradient-to-br from-[#f5f0e8] to-[#e8dfc8] flex items-center justify-center relative overflow-hidden">
                  {empresa.logo_url ? (
                    <img
                      src={empresa.logo_url}
                      alt={empresa.nombre}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-6xl">{empresa.emoji}</span>
                  )}
                  <div className="absolute top-2 right-2 bg-[#c9a84c] text-[#1a3a2a] text-xs font-black px-2 py-0.5 rounded-full">
                    {empresa.categoria}
                  </div>
                </div>
                  <div className="p-4">
                    <h3 className="font-bebas text-xl tracking-widest text-[#1a3a2a] group-hover:text-[#c9a84c] transition-colors mb-1">
                      {empresa.nombre}
                    </h3>
                    <p className="text-neutral-500 text-xs leading-relaxed mb-3 line-clamp-2">{empresa.descripcion}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {sorteosEmpresa.map((s: Record<string, unknown> | undefined) => s && (
                        <span key={s.sorteo_id as string} className="text-xs bg-[#1a3a2a]/10 text-[#1a3a2a] border border-[#1a3a2a]/20 px-2 py-0.5 rounded-full">
                          {s.fecha as string}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">📞 {empresa.telefono}</p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-12 bg-[#1a3a2a] border-2 border-[#c9a84c]/40 rounded-2xl p-8 text-center">
            <p className="font-bebas text-3xl text-[#c9a84c] tracking-widest mb-2">¿Quieres ser una empresa aliada?</p>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Dale visibilidad a tu negocio participando en nuestros sorteos.
            </p>
            <a href="https://wa.me/51958748545" target="_blank"
              className="inline-block bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#c9a84c]/30">
              💬 Contáctanos por WhatsApp
            </a>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  );
}