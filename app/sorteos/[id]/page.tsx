import { sorteos } from "../../data/sorteos";
import { notFound } from "next/navigation";
import Link from "next/link";
import Contador from "../../components/Contador";
import ComprarTickets from "../../components/ComprarTickets";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DetalleSorteo({ params }: Props) {
  const { id } = await params;
  const sorteo = sorteos.find((s) => s.id === id);

  if (!sorteo) return notFound();

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">

      {/* Header */}
      <div className={`py-10 px-4 text-center border-b-4 border-yellow-400 ${sorteo.esEspecial ? "bg-yellow-500" : "bg-red-700"}`}>
        <p className={`text-sm font-black uppercase tracking-widest mb-1 ${sorteo.esEspecial ? "text-black" : "text-white/70"}`}>
          {sorteo.badge}
        </p>
        <h1 className={`text-4xl md:text-6xl font-black tracking-widest uppercase ${sorteo.esEspecial ? "text-black" : "text-white"}`}>
          {sorteo.titulo}
        </h1>
        <p className={`mt-2 font-bold tracking-widest uppercase ${sorteo.esEspecial ? "text-black/70" : "text-white/70"}`}>
          📅 {sorteo.fecha}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Premios */}
        <section>
          <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-widest mb-4">
            🎁 Lista de Premios
          </h2>
          <ul className="space-y-3">
            {sorteo.premios.map((premio, i) => (
              <li
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                  premio.esMayor
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-neutral-800 bg-[#111]"
                }`}
              >
                <span className="bg-red-600 text-white font-black text-sm px-3 py-1 rounded-lg min-w-[40px] text-center">
                  x{premio.cantidad}
                </span>
                <span className={`font-bold text-base ${premio.esMayor ? "text-yellow-400 text-lg" : "text-neutral-200"}`}>
                  {premio.esMayor && "⭐ "}{premio.nombre}
                  {premio.esMayor && " (Premio Mayor)"}
                </span>
              </li>
            ))}
          </ul>
        </section>
        {/* Comprar tickets */}
        <ComprarTickets sorteo={sorteo} />
        <Contador fechaSorteo={sorteo.fechaSorteo} esEspecial={sorteo.esEspecial} />
{/*         Precio y pago
        <section className="bg-[#111] border-2 border-neutral-700 rounded-2xl p-6 text-center">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Precio del ticket</p>
          <p className="text-7xl font-black text-yellow-400 leading-none mb-1">
            <span className="text-3xl">S/ </span>{sorteo.precio}
          </p>
          <p className="text-neutral-500 text-sm mb-6">Paga con YAPE o PLIN</p>

          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Instrucciones de pago</p>
            <p className="text-neutral-300 text-sm">1. Abre YAPE o PLIN en tu celular.</p>
            <p className="text-neutral-300 text-sm">2. Busca el número registrado de <strong className="text-yellow-400">Huambrillo S.A.C.</strong></p>
            <p className="text-neutral-300 text-sm">3. Verifica que el nombre sea exactamente <strong className="text-yellow-400">HUAMBRILLO S.A.C.</strong></p>
            <p className="text-neutral-300 text-sm">4. Envía el monto y guarda tu comprobante.</p>
            <p className="text-neutral-300 text-sm">5. Envía el comprobante por WhatsApp para confirmar tu ticket.</p>
          </div>

          {/* BOTÓN CORREGIDO AQUÍ */}
{/*           <a
            href={sorteo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-black text-xl uppercase tracking-wide py-4 rounded-xl transition-all hover:scale-105"
          >
            💬 Confirmar por WhatsApp
          </a>
        </section> */} 

        {/* Alerta */}
        <section className="bg-[#1a0a00] border-2 border-yellow-400 rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="text-yellow-400 font-black uppercase tracking-wide mb-2">Verifica antes de pagar</p>
          <p className="text-neutral-400 text-sm">
            El nombre del destinatario debe ser exactamente:{" "}
            <strong className="text-yellow-400">HUAMBRILLO S.A.C.</strong>
          </p>
        </section>

        {/* Volver */}
        <Link
          href="/"
          className="block text-center text-neutral-500 hover:text-yellow-400 transition-colors font-bold"
        >
          ← Volver a todos los sorteos
        </Link>

      </div>
    </main>
  );
}