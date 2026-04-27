import { getSorteo } from "../../lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Contador from "../../components/Contador";
import ComprarTickets from "../../components/ComprarTickets";

interface Props {
  params: Promise<{ id: string }>;
}

interface Premio {
  cantidad: number;
  nombre: string;
  esMayor?: boolean;
}

export default async function DetalleSorteo({ params }: Props) {
  const { id } = await params;

  let sorteo;
  try {
    sorteo = await getSorteo(id);
  } catch {
    return notFound();
  }

  const premios = sorteo.premios as Premio[];
  const esEspecial = sorteo.es_especial as boolean;

  // Adaptamos el sorteo al tipo que espera ComprarTickets
  const sorteoAdaptado = {
    id: sorteo.sorteo_id,
    badge: sorteo.badge,
    fecha: sorteo.fecha,
    fechaSorteo: sorteo.fecha_sorteo,
    titulo: sorteo.titulo,
    premios: premios,
    precio: sorteo.precio,
    esEspecial: esEspecial,
    link: "#",
  };

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className={`py-10 px-4 text-center border-b-2 border-[#e8b800] relative overflow-hidden ${esEspecial ? "bg-yellow-500" : "bg-red-700"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.3)_0%,_transparent_70%)] pointer-events-none" />
        <p className={`text-sm font-black uppercase tracking-widest mb-1 ${esEspecial ? "text-black/70" : "text-white/70"}`}>
          {sorteo.badge}
        </p>
        <h1 className={`font-bebas text-4xl md:text-6xl tracking-widest uppercase ${esEspecial ? "text-black" : "text-white"}`}>
          {sorteo.titulo}
        </h1>
        <p className={`mt-2 font-bold tracking-widest uppercase ${esEspecial ? "text-black/70" : "text-white/70"}`}>
          📅 {sorteo.fecha}
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Premios */}
        <section>
          <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-4">
            🎁 Lista de Premios
          </h2>
          <ul className="space-y-3">
            {premios.map((premio, i) => (
              <li key={i} className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                premio.esMayor
                  ? "border-[#e8b800] bg-[#e8b800]/10"
                  : "border-neutral-800 bg-[#111]"
              }`}>
                <span className="bg-red-600 text-white font-black text-sm px-3 py-1 rounded-lg min-w-[40px] text-center">
                  x{premio.cantidad}
                </span>
                <span className={`font-bold text-base ${premio.esMayor ? "text-[#e8b800] text-lg" : "text-neutral-200"}`}>
                  {premio.esMayor && "⭐ "}{premio.nombre}
                  {premio.esMayor && " (Premio Mayor)"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Comprar tickets */}
        <ComprarTickets sorteo={sorteoAdaptado} />

        {/* Contador */}
        <section className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-widest text-center mb-3">⏳ Tiempo restante</p>
          <Contador fechaSorteo={sorteo.fecha_sorteo} esEspecial={esEspecial} />
        </section>

        {/* Alerta */}
        <section className="bg-[#1a0a00] border-2 border-[#e8b800] rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="text-[#e8b800] font-black uppercase tracking-wide mb-2">Verifica antes de pagar</p>
          <p className="text-neutral-400 text-sm">
            El nombre del destinatario debe ser exactamente:{" "}
            <strong className="text-[#e8b800]">HUAMBRILLO S.A.C.</strong>
          </p>
        </section>

        <Link href="/" className="block text-center text-neutral-500 hover:text-[#e8b800] transition-colors font-bold">
          ← Volver a todos los sorteos
        </Link>

      </div>

      <Footer />
    </main>
  );
}