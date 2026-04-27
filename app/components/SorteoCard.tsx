import Link from "next/link";
import Contador from "./Contador";

interface Premio {
  cantidad: number;
  nombre: string;
  esMayor?: boolean;
}

interface Props {
  sorteo: Record<string, unknown>;
}

export default function SorteoCard({ sorteo }: Props) {
  const premios = sorteo.premios as Premio[];
  const esEspecial = sorteo.es_especial as boolean;
  const id = sorteo.sorteo_id as string;

  return (
    <div className={`relative w-full bg-[#111] rounded-2xl overflow-hidden border-2 hover:-translate-y-1 transition-all duration-300 shadow-lg ${
      esEspecial
        ? "border-[#e8b800] shadow-[0_0_20px_rgba(232,184,0,0.15)]"
        : "border-neutral-800 hover:border-red-600 hover:shadow-[0_0_20px_rgba(224,48,48,0.15)]"
    }`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header */}
      <div className={`px-4 py-3 flex flex-wrap items-center gap-2 ${
        esEspecial
          ? "bg-gradient-to-r from-yellow-600 via-[#e8b800] to-yellow-600"
          : "bg-gradient-to-r from-red-800 via-red-600 to-red-800"
      }`}>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-black/30 uppercase tracking-wide text-white">
          {sorteo.badge as string}
        </span>
        <span className={`font-bebas text-xl tracking-widest uppercase ${esEspecial ? "text-black" : "text-white"}`}>
          {sorteo.fecha as string}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <h2 className={`font-bebas text-3xl tracking-widest uppercase mb-4 ${esEspecial ? "text-[#e8b800]" : "text-white"}`}>
          {sorteo.titulo as string}
        </h2>

        <ul className="mb-4 space-y-1.5">
          {premios.map((premio, i) => (
            <li key={i} className={`flex items-center gap-3 py-1.5 border-b last:border-0 ${
              premio.esMayor ? "border-[#e8b800]/20" : "border-neutral-800"
            }`}>
              <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded min-w-[28px] text-center shrink-0">
                {premio.cantidad}
              </span>
              <span className={`text-sm ${premio.esMayor ? "text-[#e8b800] font-black" : "text-neutral-300"}`}>
                {premio.nombre}
              </span>
            </li>
          ))}
        </ul>

        <Contador fechaSorteo={sorteo.fecha_sorteo as string} esEspecial={esEspecial} />

        <div className={`rounded-xl p-3 text-center mb-4 border ${
          esEspecial ? "bg-[#e8b800]/5 border-[#e8b800]/20" : "bg-red-600/5 border-red-600/20"
        }`}>
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Precio del ticket</p>
          <p className={`text-4xl sm:text-5xl font-bebas leading-none ${esEspecial ? "text-[#e8b800]" : "text-white"}`}>
            <span className="text-xl sm:text-2xl">S/ </span>{sorteo.precio as number}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Paga con YAPE o PLIN</p>
        </div>

        <Link
          href={`/sorteos/${id}`}
          className={`block w-full text-center py-3.5 rounded-xl font-black text-base uppercase tracking-widest transition-all hover:scale-105 shadow-lg ${
            esEspecial
              ? "bg-gradient-to-r from-yellow-600 via-[#e8b800] to-yellow-600 text-black hover:brightness-110"
              : "bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white hover:brightness-110"
          }`}
        >
          ¡Participar ahora! →
        </Link>

        <p className="text-center text-xs text-neutral-600 mt-2">
          A nombre de: <strong className="text-[#e8b800]">HUAMBRILLO S.A.C.</strong>
        </p>
      </div>
    </div>
  );
}