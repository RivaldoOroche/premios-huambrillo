import FadeIn from "./FadeIn";
import Link from "next/link";

interface Ganador {
  id: string;
  nombre: string;
  premio: string;
  emoji: string;
  fecha: string;
  foto_url?: string;
  sorteo?: string;
}

interface Props {
  ganadores: Ganador[];
}

export default function Ganadores({ ganadores = [] }: Props) {
  if (!ganadores.length) return null;

  const visibles = ganadores.slice(0, 10);

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <FadeIn>
        <h2 className="text-center text-3xl sm:text-4xl font-bebas tracking-widest uppercase text-[#e8b800] mb-2">
          Nuestros Ganadores
        </h2>
        <div className="w-20 h-1 bg-[#c9a84c] mx-auto rounded mb-10" />
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {visibles.map((g, i) => (
          <FadeIn key={g.id} delay={i * 0.05}>
            <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden hover:border-[#c9a84c] hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
              <div className="aspect-[4/3] bg-[#f0ede6] flex items-center justify-center text-4xl sm:text-5xl overflow-hidden">
                {g.foto_url ? (
                  <img
                    src={g.foto_url}
                    alt={`${g.nombre} — ${g.premio}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  g.emoji
                )}
              </div>
              <p className="text-center text-xs text-neutral-400 font-bold p-2 sm:p-3 leading-tight flex-1">
                {g.nombre} — {g.premio}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {ganadores.length > 10 && (
        <FadeIn delay={0.3}>
          <div className="text-center mt-8">
            <Link
              href="/ganadores"
              className="inline-block text-[#c9a84c] font-black text-sm uppercase tracking-widest hover:underline"
            >
              Ver todos los ganadores →
            </Link>
          </div>
        </FadeIn>
      )}
    </section>
  );
}