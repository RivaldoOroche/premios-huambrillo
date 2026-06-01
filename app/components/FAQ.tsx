"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";

const preguntas = [
  {
    pregunta: "¿Cómo sé que el sorteo es legítimo?",
    respuesta: "Todos nuestros sorteos se realizan en vivo por Facebook con transmisión en tiempo real. Usamos plataformas verificadas y publicamos los resultados inmediatamente.",
  },
  {
    pregunta: "¿Cuántos tickets puedo comprar?",
    respuesta: "Puedes comprar todos los tickets que desees. Entre más tickets tengas, mayores son tus posibilidades de ganar.",
  },
  {
    pregunta: "¿Cómo me entregan el premio si gano?",
    respuesta: "Te contactamos por WhatsApp al número con el que te registraste. Coordinamos la entrega del premio contigo directamente.",
  },
  {
    pregunta: "¿Puedo participar desde cualquier parte del Perú?",
    respuesta: "Si, puedes participar desde cualquier parte del PERÚ, nuestros premios podran ser enviados a nivel nacional como el caso de los premios en efectivo, a excepcion de algunos premios que por su naturaleza solo pueden ser entregados en Pucallpa",
  },
  {
    pregunta: "¿Qué pasa si ya pasó la fecha del sorteo?",
    respuesta: "Una vez realizado el sorteo, no se aceptan más tickets. Te recomendamos participar con anticipación para asegurar tu lugar.",
  },
  {
    pregunta: "¿Cómo verifico que mi pago fue recibido?",
    respuesta: "Después de enviar tu comprobante por WhatsApp, te confirmamos tu número de ticket en un plazo máximo de 24 horas.",
  },
];

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <FadeIn>
        <h2 className="font-bebas text-4xl tracking-widest text-[#e8b800] uppercase text-center mb-2">
          Preguntas Frecuentes
        </h2>
        <div className="w-16 h-1 bg-[#c9a84c] rounded mx-auto mb-10" />
      </FadeIn>

      <div className="space-y-3">
        {preguntas.map((item, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
              abierto === i ? "border-[#c9a84c]" : "border-neutral-200 hover:border-neutral-400"
            }`}>
              <button
                onClick={() => setAbierto(abierto === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <span className="font-bold text-[#c9a84c] text-sm sm:text-base">{item.pregunta}</span>
                <motion.span
                  animate={{ rotate: abierto === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#e8b800] text-2xl font-black shrink-0"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {abierto === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-5 pb-5 text-neutral-600 text-sm leading-relaxed border-t border-neutral-200 pt-4">
                      {item.respuesta}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}