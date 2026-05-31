export default function Hero() {
  return (
    <section className="relative bg-[#f5f0e8] text-center py-16 px-4 overflow-hidden border-b-2 border-[#c9a84c]">

      {/* Fondo radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.12)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(26,58,42,0.06)_0%,_transparent_60%)] pointer-events-none" />

      <span className="text-6xl block mb-4 drop-shadow-lg">🏆</span>

      <h1 className="font-bebas text-6xl sm:text-8xl tracking-[6px] uppercase text-[#1a3a2a] leading-none mb-2 drop-shadow-[0_0_30px_rgba(26,58,42,0.2)]">
        Premios <br className="sm:hidden" />
        <span className="text-[#c9a84c] drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]">Huambrillo</span>
      </h1>

      <p className="text-[#5a6b5a] uppercase tracking-[4px] text-xs font-bold mb-6">
        Talento que florece en la Amazonía
      </p>

      {/* Línea decorativa */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]" />
        <span className="text-[#c9a84c] text-sm tracking-[8px]">★ ★ ★</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]" />
      </div>

    </section>
  );
}