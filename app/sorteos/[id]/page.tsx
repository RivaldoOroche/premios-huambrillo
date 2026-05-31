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
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      {/* Header */}
      <section className={`py-10 px-4 text-center border-b-2 border-[#c9a84c] relative overflow-hidden ${
        esEspecial
          ? "bg-gradient-to-r from-[#c9a84c] via-[#e0c068] to-[#c9a84c]"
          : "bg-gradient-to-r from-[#1a3a2a] via-[#2a5a3a] to-[#1a3a2a]"
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.15)_0%,_transparent_70%)] pointer-events-none" />
        <p className={`text-sm font-black uppercase tracking-widest mb-1 ${esEspecial ? "text-[#1a3a2a]/70" : "text-white/70"}`}>
          {sorteo.badge}
        </p>
        <h1 className={`font-bebas text-4xl md:text-6xl tracking-widest uppercase ${esEspecial ? "text-[#1a3a2a]" : "text-white"}`}>
          {sorteo.titulo}
        </h1>
        <p className={`mt-2 font-bold tracking-widest uppercase ${esEspecial ? "text-[#1a3a2a]/70" : "text-white/70"}`}>
          📅 {sorteo.fecha}
        </p>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Premios */}
        <section>
          <h2 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] uppercase mb-4">
            🎁 Lista de Premios
          </h2>
          <ul className="space-y-3">
            {premios.map((premio, i) => (
              <li key={i} className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                premio.esMayor
                  ? "border-[#c9a84c] bg-[#c9a84c]/10"
                  : "border-[#c9a84c]/20 bg-white shadow-sm"
              }`}>
                <span className="bg-[#1a3a2a] text-white font-black text-sm px-3 py-1 rounded-lg min-w-[40px] text-center">
                  x{premio.cantidad}
                </span>
                <span className={`font-bold text-base ${premio.esMayor ? "text-[#c9a84c] text-lg" : "text-neutral-700"}`}>
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
        <section className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-neutral-500 uppercase tracking-widest text-center mb-3">⏳ Tiempo restante</p>
          <Contador fechaSorteo={sorteo.fecha_sorteo} esEspecial={esEspecial} />
        </section>

        {/* Alerta */}
        <section className="bg-[#1a3a2a] border-2 border-[#c9a84c] rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="text-[#c9a84c] font-black uppercase tracking-wide mb-2">Verifica antes de pagar</p>
          <p className="text-white/70 text-sm">
            El nombre del destinatario debe ser exactamente:{" "}
            <strong className="text-[#c9a84c]">HUAMBRILLO S.A.C.</strong>
          </p>
        </section>

        <Link href="/" className="block text-center text-neutral-500 hover:text-[#1a3a2a] transition-colors font-bold">
          ← Volver a todos los sorteos
        </Link>

      </div>

      <Footer />
    </main>
  );
}