"use client";

import { useEffect, useState } from "react";

interface Props {
  fechaSorteo: string;
  esEspecial?: boolean;
}

interface Tiempo {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcularTiempo(fechaSorteo: string): Tiempo {
  // Aseguramos que la fecha se interprete correctamente
  const fechaStr = fechaSorteo?.replace(" ", "T");
  const fecha = new Date(fechaStr);
  const diferencia = fecha.getTime() - Date.now();

  if (!fechaStr || isNaN(fecha.getTime()) || diferencia <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diferencia / (1000 * 60)) % 60),
    segundos: Math.floor((diferencia / 1000) % 60),
  };
}

export default function Contador({ fechaSorteo, esEspecial }: Props) {
  const [tiempo, setTiempo] = useState<Tiempo | null>(null);

  useEffect(() => {
    if (!fechaSorteo) return;
    setTiempo(calcularTiempo(fechaSorteo));
    const intervalo = setInterval(() => {
      setTiempo(calcularTiempo(fechaSorteo));
    }, 1000);
    return () => clearInterval(intervalo);
  }, [fechaSorteo]);

  if (!tiempo) return null;

  const terminado =
    tiempo.dias === 0 &&
    tiempo.horas === 0 &&
    tiempo.minutos === 0 &&
    tiempo.segundos === 0;

  const unidades = [
    { valor: tiempo.dias, label: "Días" },
    { valor: tiempo.horas, label: "Horas" },
    { valor: tiempo.minutos, label: "Min" },
    { valor: tiempo.segundos, label: "Seg" },
  ];

  return (
    <div className="mb-4">
      <p className={`text-xs uppercase tracking-widest text-center mb-2 font-bold ${
        esEspecial ? "text-yellow-600" : "text-neutral-500"
      }`}>
        ⏳ Tiempo restante
      </p>

      {terminado ? (
        <div className="text-center text-red-500 font-black text-lg uppercase tracking-wide">
          ¡Sorteo finalizado!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {unidades.map((u) => (
            <div
              key={u.label}
              className={`rounded-xl p-2 text-center border-2 ${
                esEspecial
                  ? "bg-[#e8b800]/10 border-[#e8b800]/30"
                  : "bg-red-600/10 border-red-600/30"
              }`}
            >
              <p className={`text-2xl sm:text-3xl font-bebas leading-none ${
                esEspecial ? "text-[#e8b800]" : "text-red-400"
              }`}>
                {String(u.valor).padStart(2, "0")}
              </p>
              <p className="text-xs text-neutral-500 font-bold mt-1">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}