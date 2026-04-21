import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";
import FormularioContacto from "../components/FormularioContacto";

const redesSociales = [
  {
    nombre: "WhatsApp",
    descripcion: "Escríbenos directo, respondemos rápido",
    emoji: "💬",
    color: "border-green-600/40 bg-green-600/10 hover:border-green-500",
    textColor: "text-green-400",
    href: "https://wa.me/51999000000",
  },
  {
    nombre: "Facebook",
    descripcion: "Síguenos y mira los sorteos en vivo",
    emoji: "🔵",
    color: "border-blue-600/40 bg-blue-600/10 hover:border-blue-500",
    textColor: "text-blue-400",
    href: "https://facebook.com/premioshuambrillo",
  },
  {
    nombre: "Instagram",
    descripcion: "Fotos de ganadores y premios",
    emoji: "📸",
    color: "border-pink-600/40 bg-pink-600/10 hover:border-pink-500",
    textColor: "text-pink-400",
    href: "https://instagram.com/premioshuambrillo",
  },
  {
    nombre: "TikTok",
    descripcion: "Videos de sorteos y ganadores",
    emoji: "🎵",
    color: "border-neutral-600/40 bg-neutral-800 hover:border-white",
    textColor: "text-white",
    href: "https://tiktok.com/@premioshuambrillo",
  },
];

export default function Contacto() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">📬</span>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#e8b800] mb-2">
            Contáctanos
          </h1>
          <p className="text-neutral-400 text-sm uppercase tracking-widest max-w-lg mx-auto">
            Estamos aquí para ayudarte con cualquier consulta
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8b800]" />
            <span className="text-[#e8b800] text-xs tracking-[6px]">★ ★ ★</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8b800]" />
          </div>
        </FadeIn>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {/* Redes sociales - CORREGIDO */}
        <FadeIn>
          <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-2">
            📣 Encuéntranos en
          </h2>
          <div className="w-12 h-1 bg-red-600 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {redesSociales.map((red, i) => (
              <a
                key={i}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${red.color}`}
              >
                <span className="text-4xl">{red.emoji}</span>
                <p className={`font-bebas text-xl tracking-widest ${red.textColor}`}>{red.nombre}</p>
                <p className="text-neutral-500 text-xs text-center">{red.descripcion}</p>
              </a>
            ))}
          </div>
        </FadeIn>

        {/* Layout formulario + info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Formulario */}
          <FadeIn direction="left">
            <FormularioContacto />
          </FadeIn>

          {/* Info de contacto - CORREGIDO */}
          <FadeIn direction="right">
            <div className="space-y-4">
              <h2 className="font-bebas text-2xl tracking-widest text-[#e8b800] uppercase mb-2">
                📞 Información de Contacto
              </h2>
              <div className="w-12 h-1 bg-red-600 rounded mb-6" />

              {[
                { emoji: "💬", label: "WhatsApp", valor: "+51 999 000 000", href: "https://wa.me/51999000000", color: "text-green-400" },
                { emoji: "📧", label: "Correo", valor: "contacto@premioshuambrillo.com", href: "mailto:contacto@premioshuambrillo.com", color: "text-[#e8b800]" },
                { emoji: "📍", label: "Ubicación", valor: "Pucallpa, Ucayali, Perú", href: "#", color: "text-red-400" },
                { emoji: "⏰", label: "Horario", valor: "Lun - Sáb: 9am - 8pm", href: "#", color: "text-blue-400" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-center gap-4 bg-[#111] border-2 border-neutral-800 rounded-2xl p-4 hover:border-[#e8b800] transition-all duration-300 group"
                >
                  <span className="text-3xl shrink-0">{item.emoji}</span>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest">{item.label}</p>
                    <p className={`font-bold text-sm transition-colors ${item.color}`}>
                      {item.valor}
                    </p>
                  </div>
                </a>
              ))}

              {/* Alerta */}
              <div className="bg-[#1a0a00] border-2 border-[#e8b800]/30 rounded-2xl p-4 mt-4">
                <p className="text-[#e8b800] font-black text-sm mb-1">⚠️ Recuerda verificar</p>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Nuestro único nombre de pago es <strong className="text-[#e8b800]">HUAMBRILLO S.A.C.</strong> No realices pagos a otras cuentas.
                </p>
              </div>

            </div>
          </FadeIn>
        </div>

      </div>

      <Footer />
    </main>
  );
}