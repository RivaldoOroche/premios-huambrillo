import { getEmpresa, getSorteos } from "../../lib/queries";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PerfilEmpresa({ params }: Props) {
  const { id } = await params;

  let empresa;
  try {
    empresa = await getEmpresa(id);
  } catch {
    return notFound();
  }

  const sorteos = await getSorteos();
  const sorteoIds = empresa.empresa_sorteo?.map((es: { sorteo_id: string }) => es.sorteo_id) ?? [];
  const sorteosEmpresa = sorteos.filter((s) => sorteoIds.includes(s.sorteo_id));

  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      <section className="relative bg-[#1a3a2a] text-center py-12 px-4 border-b-2 border-[#c9a84c] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none" />

        <div className="mb-4 flex justify-center">
          {empresa.logo_url ? (
            <img
              src={empresa.logo_url}
              alt={empresa.nombre}
              className="w-28 h-28 object-contain rounded-2xl bg-white p-2"
            />
          ) : (
            <span className="text-6xl">{empresa.emoji}</span>
          )}
        </div>

        <div className="inline-block bg-[#c9a84c] text-[#1a3a2a] text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          {empresa.categoria}
        </div>
        <h1 className="font-bebas text-4xl sm:text-6xl tracking-[4px] uppercase text-white mb-2">
          {empresa.nombre}
        </h1>
        <p className="text-white/70 text-sm max-w-lg mx-auto leading-relaxed">
          {empresa.descripcion}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Contacto */}
        <section className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] uppercase mb-4">📞 Contacto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={`https://wa.me/${empresa.whatsapp}`} target="_blank"
              className="flex items-center gap-3 bg-green-600/10 border border-green-600/30 rounded-xl p-4 hover:border-green-500 transition-all group">
              <span className="text-2xl">💬</span>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">WhatsApp</p>
                <p className="text-green-600 font-bold">{empresa.telefono}</p>
              </div>
            </a>
            {empresa.instagram && (
              <a href={`https://instagram.com/${empresa.instagram}`} target="_blank"
                className="flex items-center gap-3 bg-pink-600/10 border border-pink-600/30 rounded-xl p-4 hover:border-pink-500 transition-all">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Instagram</p>
                  <p className="text-pink-600 font-bold">@{empresa.instagram}</p>
                </div>
              </a>
            )}
            {empresa.facebook && (
              <a href={`https://facebook.com/${empresa.facebook}`} target="_blank"
                className="flex items-center gap-3 bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 hover:border-blue-500 transition-all">
                <span className="text-2xl">🔵</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Facebook</p>
                  <p className="text-blue-600 font-bold">{empresa.facebook}</p>
                </div>
              </a>
            )}
            {empresa.tiktok && (
              <a href={`https://tiktok.com/@${empresa.tiktok}`} target="_blank"
                className="flex items-center gap-3 bg-neutral-100 border border-neutral-300 rounded-xl p-4 hover:border-neutral-500 transition-all">
                <span className="text-2xl">🎵</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">TikTok</p>
                  <p className="text-neutral-700 font-bold">@{empresa.tiktok}</p>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* Misión y Visión */}
        {(empresa.mision || empresa.vision) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {empresa.mision && (
              <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-5 hover:border-[#c9a84c] transition-all shadow-sm">
                <h2 className="font-bebas text-xl tracking-widest text-[#1a3a2a] uppercase mb-3">
                  🎯 Misión
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed">{empresa.mision}</p>
              </div>
            )}
            {empresa.vision && (
              <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-5 hover:border-[#c9a84c] transition-all shadow-sm">
                <h2 className="font-bebas text-xl tracking-widest text-[#1a3a2a] uppercase mb-3">
                  🔭 Visión
                </h2>
                <p className="text-neutral-600 text-sm leading-relaxed">{empresa.vision}</p>
              </div>
            )}
          </section>
        )}

        {/* Productos */}
        {empresa.productos?.length > 0 && (
          <section>
            <h2 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] uppercase mb-2">🎁 Productos y Servicios</h2>
            <div className="w-12 h-1 bg-[#c9a84c] rounded mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {empresa.productos.map((p: { nombre: string; descripcion: string; emoji: string }, i: number) => (
                <div key={i} className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-5 hover:border-[#c9a84c] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                  <span className="text-4xl block mb-3">{p.emoji}</span>
                  <h3 className="font-bebas text-lg tracking-wide text-[#1a3a2a] mb-1">{p.nombre}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{p.descripcion}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sorteos */}
        {sorteosEmpresa.length > 0 && (
          <section>
            <h2 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] uppercase mb-2">🎫 Sorteos en que Participó</h2>
            <div className="w-12 h-1 bg-[#c9a84c] rounded mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sorteosEmpresa.map((s) => (
                <Link key={s.sorteo_id} href={`/sorteos/${s.sorteo_id}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 hover:-translate-y-1 transition-all duration-300 ${
                    s.es_especial
                      ? "bg-[#c9a84c]/5 border-[#c9a84c]/30 hover:border-[#c9a84c]"
                      : "bg-[#1a3a2a]/5 border-[#1a3a2a]/20 hover:border-[#1a3a2a]"
                  }`}>
                  <span className="text-3xl">{s.es_especial ? "⭐" : "🎫"}</span>
                  <div>
                    <p className={`font-bebas text-lg tracking-wide ${s.es_especial ? "text-[#c9a84c]" : "text-[#1a3a2a]"}`}>{s.titulo}</p>
                    <p className="text-neutral-500 text-xs">{s.fecha}</p>
                  </div>
                  <span className="ml-auto text-neutral-400 text-sm">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link href="/empresas" className="block text-center text-neutral-500 hover:text-[#1a3a2a] transition-colors font-bold">
          ← Ver todas las empresas
        </Link>
      </div>

      <Footer />
    </main>
  );
}