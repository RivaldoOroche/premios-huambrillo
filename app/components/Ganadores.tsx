import FadeIn from "./FadeIn";

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
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <FadeIn>
        <h2 className="text-center text-3xl sm:text-4xl font-bebas tracking-widest uppercase text-[#e8b800] mb-2">
          Nuestros Ganadores
        </h2>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded mb-10" />
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {ganadores.map((g, i) => (
          <FadeIn key={g.id} delay={i * 0.05}>
            <div className="bg-[#111] border-2 border-neutral-700 rounded-xl overflow-hidden hover:border-[#e8b800] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div className="aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center text-4xl sm:text-5xl">
                {g.foto_url ? (
                  <img src={g.foto_url} alt={g.nombre} className="w-full h-full object-cover" />
                ) : (
                  g.emoji
                )}
              </div>
              <p className="text-center text-xs text-neutral-400 font-bold p-2 sm:p-3 leading-tight">
                {g.nombre} — {g.premio}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}