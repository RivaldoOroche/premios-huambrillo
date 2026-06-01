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
    <div className={`relative w-full bg-white rounded-2xl overflow-hidden border-2 hover:-translate-y-1 transition-all duration-300 shadow-lg ${
      esEspecial
        ? "border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.2)]"
        : "border-[#1a3a2a] hover:border-[#c9a84c] hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
    }`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

      {/* Header */}
      <div className={`px-4 py-3 flex flex-wrap items-center gap-2 ${
        esEspecial
          ? "bg-gradient-to-r from-[#1a3a2a] via-[#2a5a3a] to-[#1a3a2a]"
          : "bg-gradient-to-r from-[#1a3a2a] via-[#2a5a3a] to-[#1a3a2a]"
      }`}>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-black/20 uppercase tracking-wide text-white">
          {sorteo.badge as string}
        </span>
        <span className="font-bebas text-xl tracking-widest uppercase text-[#c9a84c]">
          {sorteo.fecha as string}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <h2 className="font-bebas text-3xl tracking-widest uppercase mb-4 text-[#1a3a2a]">
          {sorteo.titulo as string}
        </h2>

        <ul className="mb-4 space-y-1.5">
          {premios.map((premio, i) => (
            <li key={i} className={`flex items-center gap-3 py-1.5 border-b last:border-0 ${
              premio.esMayor ? "border-[#c9a84c]/30" : "border-neutral-200"
            }`}>
              <span className="bg-[#c9a84c] text-black text-xs font-black px-2 py-0.5 rounded min-w-[28px] text-center shrink-0">
                {premio.cantidad}
              </span>
              <span className={`text-sm ${premio.esMayor ? "text-[#1a3a2a] font-black" : "text-neutral-600"}`}>
                {premio.nombre}
              </span>
            </li>
          ))}
        </ul>

        <Contador fechaSorteo={sorteo.fecha_sorteo as string} esEspecial={esEspecial} />

        <div className="rounded-xl p-3 text-center mb-4 border bg-[#c9a84c]/5 border-[#c9a84c]/30">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Precio del ticket</p>
          <p className="text-4xl sm:text-5xl font-bebas leading-none text-[#1a3a2a]">
            <span className="text-xl sm:text-2xl">S/ </span>{sorteo.precio as number}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Paga con PLIN</p>
        </div>

        <Link
          href={`/sorteos/${id}`}
          className="block w-full text-center py-3.5 rounded-xl font-black text-base uppercase tracking-widest transition-all hover:scale-105 shadow-lg bg-gradient-to-r from-[#b8942a] via-[#c9a84c] to-[#b8942a] text-black hover:brightness-110"
        >
          ¡Participar ahora! →
        </Link>

        <p className="text-center text-xs text-neutral-500 mt-2">
          A nombre de: <strong className="text-[#1a3a2a]">Cristian Melendez</strong>
        </p>
      </div>
    </div>
  );
}