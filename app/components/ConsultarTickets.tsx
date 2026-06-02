"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  id: string;
  sorteo_id: string;
  numero: number;
  estado: string;
  created_at: string;
  cantidad: number;
}

const estadoConfig: Record<string, { label: string; color: string; emoji: string }> = {
  pendiente:  { label: "Pendiente",  color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-600", emoji: "⏳" },
  confirmado: { label: "Confirmado", color: "bg-green-600/20 border-green-600/40 text-green-600",   emoji: "✅" },
  rechazado:  { label: "Rechazado",  color: "bg-red-600/20 border-red-600/40 text-red-600",         emoji: "❌" },
  reservado:  { label: "Reservado",  color: "bg-blue-600/20 border-blue-600/40 text-blue-600",      emoji: "🔒" },
};

export default function ConsultarTickets() {
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscar = async () => {
    if (!telefono.trim() || !dni.trim()) {
      setError("Ingresa tu teléfono y DNI para continuar");
      return;
    }
    setError("");
    setCargando(true);
    setBuscado(false);
    const res = await fetch(
      `/api/tickets/consultar?telefono=${encodeURIComponent(telefono.trim())}&dni=${encodeURIComponent(dni.trim())}`
    );
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
    setBuscado(true);
    setCargando(false);
  };

  const inputClass = "flex-1 bg-white border-2 border-[#c9a84c]/30 rounded-xl px-4 py-3 text-[#1a1a1a] text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <div className="space-y-6">

      {/* Buscador */}
      <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-6 shadow-sm space-y-3">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Ingresa tus datos para consultar tus tickets
        </p>

        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">📞 Teléfono / WhatsApp</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="Ej: 999 000 000"
            className={inputClass + " w-full"}
          />
        </div>

        <div>
          <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">🪪 DNI</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="Ej: 12345678"
            maxLength={8}
            className={inputClass + " w-full"}
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold">⚠️ {error}</p>}

        <button
          onClick={buscar}
          disabled={cargando}
          className="w-full bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black uppercase tracking-widest py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50 shadow-md"
        >
          {cargando ? "Buscando..." : "Buscar mis tickets"}
        </button>
      </div>

      {/* Resultados */}
      <AnimatePresence>
        {buscado && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {tickets.length === 0 ? (
              <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-8 text-center shadow-sm">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="text-neutral-600 font-bold">No encontramos tickets con esos datos.</p>
                <p className="text-neutral-400 text-sm mt-1">Verifica que el teléfono y DNI sean los mismos con los que compraste.</p>
              </div>
            ) : (
              <>
                <p className="text-neutral-500 text-sm">
                  Se encontraron <strong className="text-[#1a3a2a]">{tickets.length} ticket(s)</strong>
                </p>
                {tickets.map((ticket, i) => {
                  const cfg = estadoConfig[ticket.estado] ?? estadoConfig.reservado;
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-5 hover:border-[#c9a84c] transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#c9a84c] text-[#1a3a2a] font-black text-base px-3 py-0.5 rounded-lg">
                              #{String(ticket.numero).padStart(4, "0")}
                            </span>
                            <span className="text-xs bg-[#1a3a2a]/10 text-[#1a3a2a] px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {ticket.sorteo_id}
                            </span>
                          </div>
                          <p className="text-neutral-400 text-xs">
                            {new Date(ticket.created_at).toLocaleString("es-PE")}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border ${cfg.color}`}>
                          {cfg.emoji} {cfg.label}
                        </span>
                      </div>

                      {ticket.estado === "pendiente" && (
                        <p className="text-yellow-600/80 text-xs mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
                          ⏳ Tu comprobante está siendo revisado. Te confirmaremos pronto.
                        </p>
                      )}
                      {ticket.estado === "confirmado" && (
                        <p className="text-green-600/80 text-xs mt-3 bg-green-600/5 border border-green-600/20 rounded-lg p-2">
                          ✅ Tu ticket está confirmado y participará en el sorteo. ¡Buena suerte!
                        </p>
                      )}
                      {ticket.estado === "rechazado" && (
                        <p className="text-red-600/80 text-xs mt-3 bg-red-600/5 border border-red-600/20 rounded-lg p-2">
                          ❌ Tu comprobante fue rechazado. Contáctanos por WhatsApp para más información.
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}