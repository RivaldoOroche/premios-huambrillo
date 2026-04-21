export default function Hero() {
  return (
    <section className="relative bg-[#0d0d0d] text-center py-16 px-4 overflow-hidden border-b-2 border-gold-400">

      {/* Fondo radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(224,48,48,0.06)_0%,_transparent_60%)] pointer-events-none" />

      <span className="text-6xl block mb-4 drop-shadow-lg">🏆</span>

      <h1 className="font-bebas text-6xl sm:text-8xl tracking-[6px] uppercase text-gold-400 leading-none mb-2 drop-shadow-[0_0_30px_rgba(232,184,0,0.35)]">
        Premios <br className="sm:hidden" />
        <span className="text-red-500 drop-shadow-[0_0_20px_rgba(224,48,48,0.4)]">Huambrillo</span>
      </h1>

      <p className="text-neutral-400 uppercase tracking-[4px] text-xs font-bold mb-6">
        Elige tu oportunidad de ganar
      </p>

      {/* Línea decorativa */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
        <span className="text-gold-400 text-sm tracking-[8px]">★ ★ ★</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
      </div>

    </section>
  );
}