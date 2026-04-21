import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

const pasos = [
  {
    numero: "01",
    emoji: "🎫",
    titulo: "Elige tu sorteo",
    descripcion: "Revisa los sorteos activos y elige el que más te guste. Cada sorteo tiene diferentes premios y precios de ticket.",
    color: "border-[#e8b800] bg-[#e8b800]/5",
    numColor: "text-[#e8b800]",
  },
  {
    numero: "02",
    emoji: "💰",
    titulo: "Realiza el pago",
    descripcion: "Paga el valor del ticket por YAPE o PLIN. Verifica que el nombre del destinatario sea exactamente HUAMBRILLO S.A.C.",
    color: "border-red-600 bg-red-600/5",
    numColor: "text-red-500",
  },
  {
    numero: "03",
    emoji: "📸",
    titulo: "Envía tu comprobante",
    descripcion: "Toma una captura de tu pago y envíala por WhatsApp. Te confirmaremos tu número de ticket en minutos.",
    color: "border-green-600 bg-green-600/5",
    numColor: "text-green-500",
  },
  {
    numero: "04",
    emoji: "🏆",
    titulo: "Espera el sorteo",
    descripcion: "El sorteo se realiza en vivo por Facebook. Todos los participantes tienen las mismas posibilidades de ganar.",
    color: "border-blue-600 bg-blue-600/5",
    numColor: "text-blue-400",
  },
  {
    numero: "05",
    emoji: "🎉",
    titulo: "¡Recoge tu premio!",
    descripcion: "Si eres el ganador te contactamos de inmediato. Coordina la entrega de tu premio con nuestro equipo.",
    color: "border-purple-600 bg-purple-600/5",
    numColor: "text-purple-400",
  },
];

const metodos = [
  { nombre: "YAPE", emoji: "💜", color: "border-purple-600/40 bg-purple-600/10", textColor: "text-purple-400" },
  { nombre: "PLIN", emoji: "💙", color: "border-blue-600/40 bg-blue-600/10", textColor: "text-blue-400" },
];

export default function ComoParticipar() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">🎯</span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#e8b800] mb-2">
            ¿Cómo Participar?
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-widest max-w-lg mx-auto">
            Participar es fácil, rápido y seguro. Sigue estos pasos
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8b800]" />
            <span className="text-[#e8b800] text-xs tracking-[6px]">★ ★ ★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8b800]" />
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
                  <h3 className="font-bebas text-2xl tracking-widest text-white mb-1">{paso.titulo}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{paso.descripcion}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Métodos de pago */}
        <FadeIn delay={0.2}>
          <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-6">
            <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-4 text-center">
              💳 Métodos de Pago Aceptados
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {metodos.map((m, i) => (
                <div key={i} className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 ${m.color}`}>
                  <span className="text-3xl">{m.emoji}</span>
                  <span className={`font-bebas text-2xl tracking-widest ${m.textColor}`}>{m.nombre}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#1a0a00] border border-[#e8b800]/30 rounded-xl p-4 text-center">
              <p className="text-xs text-neutral-400 mb-1">Verifica siempre que el nombre del destinatario sea:</p>
              <p className="font-bebas text-xl tracking-widest text-[#e8b800]">HUAMBRILLO S.A.C.</p>
              <p className="text-red-500 text-xs font-bold mt-1">⚠️ Si sale otro nombre, NO realices el pago</p>
            </div>
          </div>
        </FadeIn>

        {/* CTA - CORREGIDO AQUÍ */}
        <FadeIn delay={0.3}>
          <div className="text-center space-y-4">
            <p className="font-bebas text-3xl text-[#e8b800] tracking-widest">¿Listo para participar?</p>
            
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-lg uppercase tracking-widest px-8 py-3 rounded-xl hover:brightness-110 hover:scale-105 transition-all shadow-lg shadow-red-600/20"
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