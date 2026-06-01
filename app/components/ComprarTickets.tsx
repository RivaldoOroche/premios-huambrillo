"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sorteo } from "../types/sorteo";

interface Props {
  sorteo: Sorteo;
}

type Paso = "pago" | "datos" | "confirmado";

export default function ComprarTickets({ sorteo }: Props) {
  const [paso, setPaso] = useState<Paso>("pago");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [numerosAsignados, setNumerosAsignados] = useState<number[]>([]);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [mostrarQR, setMostrarQR] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmar = async () => {
    if (!comprobante) { setError("Debes subir tu comprobante"); return; }
    if (!form.nombre || !form.telefono) { setError("Nombre y teléfono son obligatorios"); return; }
    setError("");
    setCargando(true);
    try {
      const fd = new FormData();
      fd.append("sorteo_id", sorteo.id);
      fd.append("cantidad", String(cantidad));
      fd.append("nombre", form.nombre);
      fd.append("telefono", form.telefono);
      fd.append("email", form.email);
      fd.append("tipo", "aleatorio");
      fd.append("comprobante", comprobante);
      const res = await fetch("/api/tickets/confirmar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNumerosAsignados(data.numeros ?? []);
      setPaso("confirmado");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al confirmar");
    } finally {
      setCargando(false);
    }
  };

  const inputClass = "w-full bg-white border-2 border-[#c9a84c]/30 rounded-xl px-4 py-3 text-[#1a1a1a] text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <>
      {/* Modal QR */}
      <AnimatePresence>
        {mostrarQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setMostrarQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-bebas text-2xl tracking-widest text-[#1a3a2a] mb-1">QR PLIN</p>
              <p className="text-xs text-neutral-400 mb-4">Escanea el QR para pagar</p>
              <img
                src="/QR_PLIN.png"
                alt="QR PLIN Huambrillo"
                className="w-full rounded-xl border border-[#c9a84c]/20"
              />
              <button
                onClick={() => setMostrarQR(false)}
                className="mt-4 w-full bg-[#1a3a2a] hover:bg-[#2a5a3a] text-white font-black text-sm uppercase tracking-widest py-2.5 rounded-xl transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className={`px-5 py-4 ${sorteo.esEspecial
          ? "bg-gradient-to-r from-[#c9a84c] via-[#e0c068] to-[#c9a84c]"
          : "bg-gradient-to-r from-[#1a3a2a] via-[#2a5a3a] to-[#1a3a2a]"
        }`}>
          <p className="font-bebas text-2xl tracking-widest text-white">
            🎫 Comprar Tickets — {sorteo.titulo}
          </p>
          <p className={`text-sm font-bold ${sorteo.esEspecial ? "text-[#1a3a2a]/80" : "text-white/70"}`}>
            S/ {sorteo.precio} por ticket · Paga con PLIN
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-2 px-5 pt-5">
          {[
            { n: 1, label: "Pago" },
            { n: 2, label: "Datos" },
            { n: 3, label: "Listo" },
          ].map((s, i, arr) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                (paso === "pago" && s.n === 1) ||
                (paso === "datos" && s.n === 2) ||
                (paso === "confirmado" && s.n === 3)
                  ? "bg-[#1a3a2a] text-white"
                  : (paso === "datos" && s.n === 1) || (paso === "confirmado" && s.n <= 2)
                  ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                  : "bg-neutral-100 text-neutral-400"
              }`}>
                <span>{s.n}</span>
                <span className="uppercase tracking-widest">{s.label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px w-6 ${
                  (paso === "datos" && s.n === 1) || (paso === "confirmado" && s.n <= 2)
                    ? "bg-[#c9a84c]"
                    : "bg-neutral-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">

            {/* PASO 1: PAGO */}
            {paso === "pago" && (
              <motion.div key="pago" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Paso 1 — Elige cantidad y paga</p>

                {/* Selector cantidad */}
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-2">Cantidad de tickets</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      className="w-11 h-11 rounded-xl border-2 border-[#c9a84c]/30 bg-white text-[#1a3a2a] font-black text-xl hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center">
                      <p className="font-bebas text-4xl text-[#1a3a2a]">{cantidad}</p>
                      <p className="text-xs text-neutral-400">ticket{cantidad > 1 ? "s" : ""}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCantidad(Math.min(20, cantidad + 1))}
                      className="w-11 h-11 rounded-xl border-2 border-[#c9a84c]/30 bg-white text-[#1a3a2a] font-black text-xl hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[#1a3a2a] rounded-2xl p-4 text-center">
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Total a pagar</p>
                  <p className="font-bebas text-5xl text-[#c9a84c] tracking-widest">
                    S/ {sorteo.precio * cantidad}
                  </p>
                  <p className="text-white/50 text-xs mt-1">{cantidad} ticket{cantidad > 1 ? "s" : ""} × S/ {sorteo.precio}</p>
                </div>

                {/* Instrucción PLIN */}
                <div className="bg-[#f5f0e8] border border-[#c9a84c]/30 rounded-xl p-4 text-center space-y-1">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">💙 Instrucción de pago</p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Escanea el QR o paga directo al PLIN{" "}
                    <strong className="text-[#1a3a2a]">958 748 545</strong>{" "}
                    a nombre de{" "}
                    <strong className="text-[#c9a84c]">Cristian Melendez</strong>
                  </p>
                </div>

                {/* Botón QR */}
                <button
                  type="button"
                  onClick={() => setMostrarQR(true)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-[#c9a84c] bg-[#c9a84c]/5 hover:bg-[#c9a84c]/15 text-[#1a3a2a] font-black text-sm uppercase tracking-widest py-3 rounded-xl transition-all"
                >
                  📷 Ver QR PLIN
                </button>

                <button
                  type="button"
                  onClick={() => setPaso("datos")}
                  className="w-full bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black text-base uppercase tracking-widest py-3.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#c9a84c]/30"
                >
                  Ya pagué → Registrar datos
                </button>
              </motion.div>
            )}

            {/* PASO 2: DATOS + COMPROBANTE */}
            {paso === "datos" && (
              <motion.div key="datos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Paso 2 — Tus datos y comprobante</p>

                {/* Resumen pago */}
                <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl px-4 py-3 flex items-center justify-between">
                  <p className="text-xs text-neutral-500 uppercase tracking-widest">Total pagado</p>
                  <p className="font-bebas text-2xl text-[#1a3a2a]">S/ {sorteo.precio * cantidad}</p>
                </div>

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

                {/* Subir comprobante */}
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-2">Sube tu comprobante *</label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#c9a84c]/40 rounded-xl p-6 cursor-pointer hover:border-[#c9a84c] transition-colors bg-[#f5f0e8]/50">
                    <span className="text-3xl">{comprobante ? "✅" : "📸"}</span>
                    <span className="text-sm text-neutral-500 text-center">
                      {comprobante ? comprobante.name : "Toca para subir la captura de tu pago"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setComprobante(e.target.files?.[0] || null)} />
                  </label>
                </div>

                {error && <p className="text-red-500 text-sm font-bold">⚠️ {error}</p>}

                <button
                  onClick={handleConfirmar}
                  disabled={cargando || !comprobante}
                  className="w-full bg-[#1a3a2a] hover:bg-[#2a5a3a] text-white font-black text-base uppercase tracking-widest py-3.5 rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                >
                  {cargando ? "Registrando..." : "Confirmar y obtener tickets →"}
                </button>

                <button
                  type="button"
                  onClick={() => setPaso("pago")}
                  className="w-full text-neutral-400 hover:text-[#1a3a2a] text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  ← Volver
                </button>
              </motion.div>
            )}

            {/* PASO 3: CONFIRMADO */}
            {paso === "confirmado" && (
              <motion.div key="confirmado" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                <span className="text-6xl block">🎉</span>
                <p className="font-bebas text-3xl text-[#1a3a2a] tracking-widest">¡Tickets registrados!</p>
                <p className="text-neutral-500 text-sm max-w-xs mx-auto">
                  Tu comprobante fue enviado. Te confirmaremos tus tickets por WhatsApp en menos de 24 horas.
                </p>
                {numerosAsignados.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {numerosAsignados.map((n) => (
                      <span key={n} className="bg-[#c9a84c] text-[#1a3a2a] font-black text-sm px-3 py-1 rounded-lg">
                        #{String(n).padStart(4, "0")}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-neutral-400">Guarda estos números, son tus tickets oficiales</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
}