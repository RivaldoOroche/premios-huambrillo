import { empresas } from "../../data/empresas";
import { sorteos } from "../../data/sorteos";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PerfilEmpresa({ params }: Props) {
  const { id } = await params;
  const empresa = empresas.find((e) => e.id === id);
  if (!empresa) return notFound();

  const sorteosEmpresa = sorteos.filter((s) => empresa.sorteos.includes(s.id));

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
        <span className="text-6xl block mb-3">{empresa.emoji}</span>
        <div className="inline-block bg-[#e8b800] text-black text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          {empresa.categoria}
        </div>
        <h1 className="font-bebas text-4xl sm:text-6xl tracking-[4px] uppercase text-white mb-2">
          {empresa.nombre}
        </h1>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
          {empresa.descripcion}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Contacto - CORREGIDO */}
        <section className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-6">
          <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-4">
            📞 Contacto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <a
              href={`https://wa.me/${empresa.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-600/10 border border-green-600/30 rounded-xl p-4 hover:border-green-500 hover:bg-green-600/20 transition-all group"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">WhatsApp</p>
                <p className="text-green-400 font-bold group-hover:text-green-300">{empresa.telefono}</p>
              </div>
            </a>

            <a
              href={`tel:${empresa.telefono}`}
              className="flex items-center gap-3 bg-[#1a1a1a] border border-neutral-700 rounded-xl p-4 hover:border-[#e8b800] transition-all group"
            >
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">Teléfono</p>
                <p className="text-white font-bold group-hover:text-[#e8b800]">{empresa.telefono}</p>
              </div>
            </a>

            {empresa.instagram && (
              <a
                href={`https://instagram.com/${empresa.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-pink-600/10 border border-pink-600/30 rounded-xl p-4 hover:border-pink-500 transition-all group"
              >
                <span className="text-2xl">📸</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Instagram</p>
                  <p className="text-pink-400 font-bold">@{empresa.instagram}</p>
                </div>
              </a>
            )}

            {empresa.facebook && (
              <a
                href={`https://facebook.com/${empresa.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 hover:border-blue-500 transition-all group"
              >
                <span className="text-2xl">🔵</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Facebook</p>
                  <p className="text-blue-400 font-bold">{empresa.facebook}</p>
                </div>
              </a>
            )}

            {empresa.tiktok && (
              <a
                href={`https://tiktok.com/@${empresa.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-xl p-4 hover:border-white transition-all group"
              >
                <span className="text-2xl">🎵</span>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">TikTok</p>
                  <p className="text-white font-bold">@{empresa.tiktok}</p>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* Productos */}
        <section>
          <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-2">
            🎁 Productos y Servicios
          </h2>
          <div className="w-12 h-1 bg-red-600 rounded mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {empresa.productos.map((producto, i) => (
              <div
                key={i}
                className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5 hover:border-[#e8b800] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_15px_rgba(232,184,0,0.1)]"
              >
                <span className="text-4xl block mb-3">{producto.emoji}</span>
                <h3 className="font-bebas text-lg tracking-wide text-white mb-1">{producto.nombre}</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">{producto.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sorteos en que participó */}
        <section>
          <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-2">
            🎫 Sorteos en que Participó
          </h2>
          <div className="w-12 h-1 bg-red-600 rounded mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sorteosEmpresa.map((sorteo) => (
              <Link
                key={sorteo.id}
                href={`/sorteos/${sorteo.id}`}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 hover:-translate-y-1 transition-all duration-300 ${
                  sorteo.esEspecial
                    ? "bg-[#e8b800]/5 border-[#e8b800]/30 hover:border-[#e8b800]"
                    : "bg-red-600/5 border-red-600/20 hover:border-red-500"
                }`}
              >
                <span className="text-3xl">{sorteo.esEspecial ? "⭐" : "🎫"}</span>
                <div>
                  <p className={`font-bebas text-lg tracking-wide ${sorteo.esEspecial ? "text-[#e8b800]" : "text-white"}`}>
                    {sorteo.titulo}
                  </p>
                  <p className="text-neutral-500 text-xs">{sorteo.fecha}</p>
                </div>
                <span className="ml-auto text-neutral-600 text-sm">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Volver */}
        <Link
          href="/empresas"
          className="block text-center text-neutral-500 hover:text-[#e8b800] transition-colors font-bold"
        >
          ← Ver todas las empresas
        </Link>

      </div>

      <Footer />
    </main>
  );
}