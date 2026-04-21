export default function Hero() {
  return (
    <section className="bg-[#1a0000] text-center py-12 px-4 border-b-4 border-yellow-400">

      <span className="text-5xl block mb-3">🏆</span>

      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest uppercase text-yellow-400 leading-none mb-2">
        Premios <br className="sm:hidden" />
        <span className="text-red-500">Huambrillo</span>
      </h1>

      <p className="text-white uppercase tracking-[3px] text-xs sm:text-sm font-bold mb-4">
        Elige tu oportunidad de ganar
      </p>

      <div className="text-yellow-400 text-lg tracking-[8px] opacity-50">
        ★ ★ ★ ★ ★
      </div>

    </section>
  );
}