const ganadores = [
  { emoji: "🏆", label: "Ganador Ford Ranger - Marzo 2026" },
  { emoji: "🚗", label: "Ganador Toyota Yaris - Febrero 2026" },
  { emoji: "🎉", label: "Ganador iPhone 17 - Enero 2026" },
  { emoji: "🥇", label: "Ganador Efectivo - Diciembre 2025" },
];

export default function Ganadores() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-center text-4xl font-black tracking-widest uppercase text-yellow-400 mb-2">
        Nuestros Ganadores
      </h2>
      <div className="w-20 h-1 bg-red-600 mx-auto rounded mb-10" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ganadores.map((g, i) => (
          <div
            key={i}
            className="bg-[#111] border-2 border-neutral-700 rounded-xl overflow-hidden hover:border-yellow-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center text-5xl">
              {g.emoji}
            </div>
            <p className="text-center text-xs text-neutral-400 font-bold p-3">
              {g.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}