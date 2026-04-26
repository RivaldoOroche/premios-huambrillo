"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sorteo } from "../types/sorteo";

interface Props {
  sorteo: Sorteo;
}

type Paso = "datos" | "pago" | "confirmado";

export default function ComprarTickets({ sorteo }: Props) {
  const [paso, setPaso] = useState<Paso>("datos");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [numerosAsignados, setNumerosAsignados] = useState<number[]>([]);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    cantidad: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.name === "cantidad" ? parseInt(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleReservar = async () => {
    setError("");
    if (!form.nombre || !form.telefono) {
      setError("Nombre y teléfono son obligatorios");
      return;
    }
    setCargando(true);
    try {
      const res = await fetch("/api/tickets/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sorteo_id: sorteo.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNumerosAsignados(data.numeros);
      setPaso("pago");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al reservar");
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmar = async () => {
    if (!comprobante) { setError("Debes subir tu comprobante"); return; }
    setError("");
    setCargando(true);
    try {
      const fd = new FormData();
      fd.append("sorteo_id", sorteo.id);
      fd.append("numeros", JSON.stringify(numerosAsignados));
      fd.append("comprobante", comprobante);
      const res = await fetch("/api/tickets/confirmar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPaso("confirmado");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al confirmar");
    } finally {
      setCargando(false);
    }
  };

  const inputClass = "w-full bg-[#1a1a1a] border-2 border-neutral-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#e8b800] transition-colors";

  return (
    <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className={`px-5 py-4 ${sorteo.esEspecial ? "bg-gradient-to-r from-yellow-600 via-[#e8b800] to-yellow-600" : "bg-gradient-to-r from-red-800 via-red-600 to-red-800"}`}>
        <p className="font-bebas text-2xl tracking-widest text-white">
          🎫 Comprar Tickets — {sorteo.titulo}
        </p>
        <p className={`text-sm font-bold ${sorteo.esEspecial ? "text-black/70" : "text-white/70"}`}>
          S/ {sorteo.precio} por ticket · Paga con YAPE o PLIN
        </p>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">

          {/* PASO 1: DATOS */}
          {paso === "datos" && (
            <motion.div
              key="datos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Paso 1 — Tus datos</p>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Nombre completo *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputClass} />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">WhatsApp / Teléfono *</label>
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="999 000 000" className={inputClass} />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Correo (opcional)</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@correo.com" className={inputClass} />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Cantidad de tickets (máx. 20)</label>
                <input name="cantidad" type="number" min={1} max={20} value={form.cantidad} onChange={handleChange} className={inputClass} />
                <p className="text-xs text-neutral-600 mt-1">
                  Total a pagar: <strong className="text-[#e8b800]">S/ {sorteo.precio * form.cantidad}</strong>
                </p>
              </div>

              {error && <p className="text-red-500 text-sm font-bold">⚠️ {error}</p>}

              <button
                onClick={handleReservar}
                disabled={cargando}
                className="w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-base uppercase tracking-widest py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
              >
                {cargando ? "Reservando..." : "Reservar tickets →"}
              </button>

              <p className="text-xs text-neutral-600 text-center">
                Tienes 15 minutos para completar el pago después de reservar
              </p>
            </motion.div>
          )}

          {/* PASO 2: PAGO */}
          {paso === "pago" && (
            <motion.div
              key="pago"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Paso 2 — Realiza el pago</p>

              {/* Tickets asignados */}
              <div className="bg-[#e8b800]/10 border-2 border-[#e8b800]/30 rounded-xl p-4">
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">Tus números de ticket</p>
                <div className="flex flex-wrap gap-2">
                  {numerosAsignados.map((n) => (
                    <span key={n} className="bg-[#e8b800] text-black font-black text-sm px-3 py-1 rounded-lg">
                      #{String(n).padStart(4, "0")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instrucciones de pago */}
              <div className="bg-[#1a1a1a] border border-neutral-700 rounded-xl p-4 space-y-2">
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Instrucciones</p>
                <p className="text-sm text-neutral-300">1. Abre <strong className="text-white">YAPE o PLIN</strong></p>
                <p className="text-sm text-neutral-300">2. Busca: <strong className="text-[#e8b800]">HUAMBRILLO S.A.C.</strong></p>
                <p className="text-sm text-neutral-300">3. Paga exactamente: <strong className="text-[#e8b800]">S/ {sorteo.precio * form.cantidad}</strong></p>
                <p className="text-sm text-neutral-300">4. Guarda la captura de pantalla</p>
              </div>

              {/* Subir comprobante */}
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-2">Sube tu comprobante *</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-600 rounded-xl p-6 cursor-pointer hover:border-[#e8b800] transition-colors">
                  <span className="text-3xl">{comprobante ? "✅" : "📸"}</span>
                  <span className="text-sm text-neutral-400">
                    {comprobante ? comprobante.name : "Toca para subir la foto"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setComprobante(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {error && <p className="text-red-500 text-sm font-bold">⚠️ {error}</p>}

              <button
                onClick={handleConfirmar}
                disabled={cargando || !comprobante}
                className="w-full bg-gradient-to-r from-green-700 via-green-500 to-green-700 text-white font-black text-base uppercase tracking-widest py-3.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
              >
                {cargando ? "Enviando..." : "Confirmar pago →"}
              </button>
            </motion.div>
          )}

          {/* PASO 3: CONFIRMADO */}
          {paso === "confirmado" && (
            <motion.div
              key="confirmado"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <span className="text-6xl block">🎉</span>
              <p className="font-bebas text-3xl text-[#e8b800] tracking-widest">¡Tickets registrados!</p>
              <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                Tu comprobante fue enviado. Te confirmaremos tus tickets por WhatsApp en menos de 24 horas.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {numerosAsignados.map((n) => (
                  <span key={n} className="bg-[#e8b800] text-black font-black text-sm px-3 py-1 rounded-lg">
                    #{String(n).padStart(4, "0")}
                  </span>
                ))}
              </div>
              <p className="text-xs text-neutral-600">Guarda estos números, son tus tickets oficiales</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}