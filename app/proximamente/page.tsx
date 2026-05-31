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

        {/* Card */}
        <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-6 shadow-sm mb-8">
          <p className="text-[#1a3a2a] font-black text-sm uppercase tracking-widest mb-1">
            🔔 ¿Quieres que te avisemos?
          </p>
          <p className="text-neutral-500 text-xs mb-4">
            Escríbenos por WhatsApp y te notificamos cuando esté listo.
          </p>
          <a
            href="https://wa.me/51999000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black text-sm uppercase tracking-widest px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#c9a84c]/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.302-1.51A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.001-1.373l-.36-.214-3.732.894.944-3.641-.235-.374A9.8 9.8 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
            </svg>
            Avisar por WhatsApp
          </a>
        </div>

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