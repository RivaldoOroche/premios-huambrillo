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
  pendiente:  { label: "Pendiente",  color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-400", emoji: "⏳" },
  confirmado: { label: "Confirmado", color: "bg-green-600/20 border-green-600/40 text-green-400",  emoji: "✅" },
  rechazado:  { label: "Rechazado",  color: "bg-red-600/20 border-red-600/40 text-red-400",        emoji: "❌" },
  reservado:  { label: "Reservado",  color: "bg-blue-600/20 border-blue-600/40 text-blue-400",     emoji: "🔒" },
};

export default function ConsultarTickets() {
  const [telefono, setTelefono] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const buscar = async () => {
    if (!telefono.trim()) return;
    setCargando(true);
    setBuscado(false);
    const res = await fetch(`/api/tickets/consultar?telefono=${encodeURIComponent(telefono.trim())}`);
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
    setBuscado(true);
    setCargando(false);
  };

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-6">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4">
          Ingresa tu número de WhatsApp con el que compraste
        </p>
        <div className="flex gap-3">
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="Ej: 999 000 000"
            className="flex-1 bg-[#1a1a1a] border-2 border-neutral-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-[#e8b800] transition-colors"
          />
          <button
            onClick={buscar}
            disabled={cargando}
            className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
          >
            {cargando ? "..." : "Buscar"}
          </button>
        </div>
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
              <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-8 text-center">
                <span className="text-4xl block mb-3">🔍</span>
                <p className="text-neutral-400 font-bold">No encontramos tickets con ese número.</p>
                <p className="text-neutral-600 text-sm mt-1">Verifica que el número sea el mismo con el que compraste.</p>
              </div>
            ) : (
              <>
                <p className="text-neutral-500 text-sm">
                  Se encontraron <strong className="text-[#e8b800]">{tickets.length} ticket(s)</strong>
                </p>
                {tickets.map((ticket, i) => {
                  const cfg = estadoConfig[ticket.estado] ?? estadoConfig.reservado;
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5 hover:border-[#e8b800]/30 transition-all"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-[#e8b800] text-black font-black text-base px-3 py-0.5 rounded-lg">
                              #{String(ticket.numero).padStart(4, "0")}
                            </span>
                            <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {ticket.sorteo_id}
                            </span>
                          </div>
                          <p className="text-neutral-500 text-xs">
                            {new Date(ticket.created_at).toLocaleString("es-PE")}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border ${cfg.color}`}>
                          {cfg.emoji} {cfg.label}
                        </span>
                      </div>

                      {ticket.estado === "pendiente" && (
                        <p className="text-yellow-400/70 text-xs mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
                          ⏳ Tu comprobante está siendo revisado. Te confirmaremos pronto.
                        </p>
                      )}
                      {ticket.estado === "confirmado" && (
                        <p className="text-green-400/70 text-xs mt-3 bg-green-600/5 border border-green-600/20 rounded-lg p-2">
                          ✅ Tu ticket está confirmado y participará en el sorteo. ¡Buena suerte!
                        </p>
                      )}
                      {ticket.estado === "rechazado" && (
                        <p className="text-red-400/70 text-xs mt-3 bg-red-600/5 border border-red-600/20 rounded-lg p-2">
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