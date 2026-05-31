"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Estado = "idle" | "enviando" | "enviado" | "error";

export default function FormularioContacto() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setEstado("enviado");
    } catch {
      setEstado("error");
    }
  };

  const inputClass = "w-full bg-white border-2 border-[#c9a84c]/30 rounded-xl px-4 py-3 text-[#1a1a1a] text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-6 shadow-sm">
      <h2 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] uppercase mb-2">
        ✉️ Envíanos un mensaje
      </h2>
      <div className="w-12 h-1 bg-[#c9a84c] rounded mb-6" />

      {estado === "enviado" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 space-y-3"
        >
          <span className="text-6xl block">✅</span>
          <p className="font-bebas text-2xl text-[#1a3a2a] tracking-widest">¡Mensaje enviado!</p>
          <p className="text-neutral-500 text-sm">Te responderemos lo antes posible.</p>
          <button
            onClick={() => { setEstado("idle"); setForm({ nombre: "", email: "", asunto: "", mensaje: "" }); }}
            className="mt-4 text-xs text-neutral-400 hover:text-[#c9a84c] transition-colors underline"
          >
            Enviar otro mensaje
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Correo</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@correo.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Asunto</label>
            <select
              name="asunto"
              value={form.asunto}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="" disabled>Selecciona un asunto</option>
              <option value="consulta-sorteo">Consulta sobre un sorteo</option>
              <option value="verificar-pago">Verificar mi pago</option>
              <option value="empresa-donante">Quiero ser empresa donante</option>
              <option value="reclamo">Reclamo o sugerencia</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Mensaje</label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Escribe tu mensaje aquí..."
              className={inputClass + " resize-none"}
            />
          </div>

          <button
            type="submit"
            disabled={estado === "enviando"}
            className="w-full bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black text-base uppercase tracking-widest py-3.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#c9a84c]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {estado === "enviando" ? "Enviando..." : "Enviar mensaje →"}
          </button>

          {estado === "error" && (
            <p className="text-red-500 text-xs text-center">Ocurrió un error. Intenta de nuevo.</p>
          )}
        </form>
      )}
    </div>
  );
}