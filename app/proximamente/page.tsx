export default function Proximamente() {
  return (
    <main className="bg-[#f5f0e8] min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">

        {/* Logo */}
        <p className="font-bebas text-2xl tracking-[4px] text-[#1a3a2a] uppercase mb-8">
          PREMIOS <span className="text-[#c9a84c]">HUAMBRILLO</span>
        </p>

        {/* Icono */}
        <div className="relative inline-block mb-6">
          <span className="text-8xl">🏗️</span>
        </div>

        {/* Título */}
        <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#1a3a2a] mb-2">
          Próximamente
        </h1>

        {/* Línea decorativa */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[6px]">★ ★ ★</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
        </div>

        {/* Descripción */}
        <p className="text-neutral-600 text-base mb-2">
          Estamos trabajando en algo increíble para ti.
        </p>
        <p className="text-neutral-400 text-sm mb-10">
          Esta sección estará disponible muy pronto.
        </p>
        {/* Volver */}
        <a
          href="/"
          className="text-neutral-400 hover:text-[#1a3a2a] transition-colors text-sm font-bold"
        >
          ← Volver al inicio
        </a>

      </div>
    </main>
  );
}