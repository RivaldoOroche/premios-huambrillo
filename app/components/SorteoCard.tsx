import Link from "next/link";
import { Sorteo } from "../types/sorteo";

interface Props {
  sorteo: Sorteo;
}

export default function SorteoCard({ sorteo }: Props) {
  return (
    <div className="bg-[#111] border-2 border-neutral-700 rounded-2xl overflow-hidden hover:border-yellow-400 hover:-translate-y-1 transition-all duration-200">

      {/* Header */}
      <div className={`px-4 py-3 flex flex-wrap items-center gap-2 ${sorteo.esEspecial ? "bg-yellow-500" : "bg-red-600"}`}>
        <span className={`text-xs font-black px-3 py-1 rounded-full bg-black/25 uppercase tracking-wide ${sorteo.esEspecial ? "text-black" : "text-white"}`}>
          {sorteo.badge}
        </span>
        <span className={`font-black text-base sm:text-lg tracking-widest uppercase ${sorteo.esEspecial ? "text-black" : "text-white"}`}>
          {sorteo.fecha}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <h2 className={`text-xl sm:text-2xl font-black tracking-widest uppercase mb-4 ${sorteo.esEspecial ? "text-white" : "text-yellow-400"}`}>
          {sorteo.titulo}
        </h2>

        {/* Lista de premios */}
        <ul className="mb-4 space-y-2">
          {sorteo.premios.map((premio, i) => (
            <li key={i} className="flex items-center gap-3 border-b border-neutral-800 pb-2 last:border-0">
              <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded min-w-[28px] text-center shrink-0">
                {premio.cantidad}
              </span>
              <span className={`text-sm ${premio.esMayor ? "text-yellow-400 font-black" : "text-neutral-300"}`}>
                {premio.nombre}
              </span>
            </li>
          ))}
        </ul>

        {/* Precio */}
        <div className="bg-[#1a1a1a] rounded-xl p-3 text-center mb-4">
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Precio del ticket</p>
          <p className="text-4xl sm:text-5xl font-black text-yellow-400 leading-none">
            <span className="text-xl sm:text-2xl">S/ </span>{sorteo.precio}
          </p>
          <p className="text-xs text-neutral-500 mt-1">Paga con YAPE o PLIN</p>
        </div>

        {/* Botón */}
        <Link
          href={`/sorteos/${sorteo.id}`}
          className={`block w-full text-center py-3 rounded-xl font-black text-base sm:text-lg uppercase tracking-wide transition-all hover:scale-105 ${
            sorteo.esEspecial
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          ¡Participar ahora!
        </Link>

        <p className="text-center text-xs text-neutral-500 mt-2">
          A nombre de: <strong className="text-yellow-400">HUAMBRILLO S.A.C.</strong>
        </p>
      </div>

    </div>
  );
}