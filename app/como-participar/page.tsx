import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

const pasos = [
  {
    numero: "01",
    emoji: "🎫",
    titulo: "Elige tu sorteo",
    descripcion: "Revisa los sorteos activos y elige el que más te guste. Cada sorteo tiene diferentes premios y precios de ticket.",
    color: "border-[#c9a84c] bg-[#c9a84c]/5",
    numColor: "text-[#c9a84c]",
  },
  {
    numero: "02",
    emoji: "💰",
    titulo: "Realiza el pago",
    descripcion: "Paga el valor del ticket por YAPE o PLIN. Verifica que el nombre del destinatario sea exactamente HUAMBRILLO S.A.C.",
    color: "border-[#1a3a2a] bg-[#1a3a2a]/10",
    numColor: "text-[#2a5a3a]",
  },
  {
    numero: "03",
    emoji: "📸",
    titulo: "Envía tu comprobante",
    descripcion: "Toma una captura de tu pago y envíala por WhatsApp. Te confirmaremos tu número de ticket en minutos.",
    color: "border-[#c9a84c] bg-[#c9a84c]/5",
    numColor: "text-[#c9a84c]",
  },
  {
    numero: "04",
    emoji: "🏆",
    titulo: "Espera el sorteo",
    descripcion: "El sorteo se realiza en vivo por Facebook. Todos los participantes tienen las mismas posibilidades de ganar.",
    color: "border-[#1a3a2a] bg-[#1a3a2a]/10",
    numColor: "text-[#2a5a3a]",
  },
  {
    numero: "05",
    emoji: "🎉",
    titulo: "¡Recoge tu premio!",
    descripcion: "Si eres el ganador te contactamos de inmediato. Coordina la entrega de tu premio con nuestro equipo.",
    color: "border-[#c9a84c] bg-[#c9a84c]/5",
    numColor: "text-[#c9a84c]",
  },
];

const metodos = [
  // { nombre: "YAPE", emoji: "💜", color: "border-[#c9a84c]/40 bg-[#c9a84c]/10", textColor: "text-[#c9a84c]" },
  { nombre: "PLIN", emoji: "💙", color: "border-[#1a3a2a] bg-[#1a3a2a]/20", textColor: "text-[#2a5a3a]" },
];

export default function ComoParticipar() {
  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#1a3a2a] text-center py-12 px-4 border-b-2 border-[#c9a84c] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">🎯</span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#c9a84c] mb-2">
            ¿Cómo Participar?
          </h1>
          <p className="text-white/70 text-sm uppercase tracking-widest max-w-lg mx-auto">
            Participar es fácil, rápido y seguro. Sigue estos pasos
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[6px]">★ ★ ★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]" />
          </div>
        </FadeIn>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* Pasos */}
        <div className="space-y-5">
          {pasos.map((paso, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`flex gap-5 p-5 rounded-2xl border-2 ${paso.color} transition-all hover:-translate-y-0.5 duration-300`}>
                <div className="shrink-0 text-center">
                  <p className={`font-bebas text-4xl leading-none ${paso.numColor}`}>{paso.numero}</p>
                  <span className="text-3xl block mt-1">{paso.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] mb-1">{paso.titulo}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{paso.descripcion}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Métodos de pago */}
       <FadeIn delay={0.2}>
        <div className="mx-auto max-w-4xl w-full bg-white border-2 border-[#c9a84c]/40 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bebas text-2xl tracking-widest text-[#1a3a2a] uppercase mb-4 text-center">
            💳 Métodos de Pago Aceptados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {metodos.map((m, i) => (
              <div
                key={i}
                className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 ${m.color}`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className={`font-bebas text-2xl tracking-widest ${m.textColor}`}>
                  {m.nombre}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#1a3a2a]/5 border border-[#c9a84c]/40 rounded-xl p-4 text-center">
            <p className="text-xs text-neutral-500 mb-1">
              Verifica siempre que el nombre del destinatario sea:
            </p>
            <p className="font-bebas text-xl tracking-widest text-[#1a3a2a]">
              HUAMBRILLO S.A.C.
            </p>
            <p className="text-red-600 text-xs font-bold mt-1">
              ⚠️ Si sale otro nombre, NO realices el pago
            </p>
          </div>
        </div>
      </FadeIn>
        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="text-center space-y-4">
            <p className="font-bebas text-3xl text-[#1a3a2a] tracking-widest">¿Listo para participar?</p>
            <a 
              href="/"
              className="inline-block bg-[#c9a84c] hover:bg-[#e0c068] text-[#1a3a2a] font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#c9a84c]/30"
            >
              Ver sorteos activos →
            </a>
          </div>
        </FadeIn>

      </div>

      <Footer />
    </main>
  );
}