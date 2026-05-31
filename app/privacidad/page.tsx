import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

export default function Privacidad() {
  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      <section className="relative bg-[#1a3a2a] text-center py-12 px-4 border-b-2 border-[#c9a84c] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">🔒</span>
          <h1 className="font-bebas text-5xl sm:text-6xl tracking-[5px] uppercase text-[#c9a84c] mb-2">
            Política de Privacidad
          </h1>
          <p className="text-white/70 text-sm">Última actualización: Abril 2026</p>
        </FadeIn>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {[
          {
            titulo: "1. Información que Recopilamos",
            contenido: "Recopilamos la información que nos proporcionas al comprar un ticket: nombre completo, número de teléfono/WhatsApp y correo electrónico (opcional). También recopilamos el comprobante de pago enviado para verificar tu participación.",
          },
          {
            titulo: "2. Uso de la Información",
            contenido: "Utilizamos tu información para: verificar y confirmar tu participación en el sorteo, comunicarnos contigo sobre el estado de tu ticket, notificarte si eres ganador, y enviarte información relevante sobre futuros sorteos si así lo autorizas.",
          },
          {
            titulo: "3. Protección de Datos",
            contenido: "Tus datos personales son almacenados de forma segura en nuestra base de datos. No vendemos, alquilamos ni compartimos tu información personal con terceros sin tu consentimiento, salvo obligación legal.",
          },
          {
            titulo: "4. Comunicaciones por WhatsApp",
            contenido: "Al proporcionar tu número de WhatsApp, autorizas a Premios Huambrillo a enviarte mensajes relacionados con tu participación en los sorteos. Puedes solicitar en cualquier momento que dejemos de contactarte.",
          },
          {
            titulo: "5. Cookies y Tecnologías Similares",
            contenido: "Nuestro sitio web puede utilizar cookies para mejorar la experiencia del usuario. Estas cookies no recopilan información personal identificable.",
          },
          {
            titulo: "6. Tus Derechos",
            contenido: "Tienes derecho a acceder, corregir o eliminar tu información personal. Para ejercer estos derechos, contáctanos a través de nuestros canales oficiales.",
          },
          {
            titulo: "7. Cambios en esta Política",
            contenido: "Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre cambios significativos a través de nuestros canales oficiales.",
          },
        ].map((seccion, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="bg-white border-2 border-[#c9a84c]/30 rounded-2xl p-6 hover:border-[#c9a84c] transition-all shadow-sm">
              <h2 className="font-bebas text-xl text-[#1a3a2a] tracking-widest mb-3">{seccion.titulo}</h2>
              <p className="text-neutral-600 text-sm leading-relaxed">{seccion.contenido}</p>
            </div>
          </FadeIn>
        ))}

        <FadeIn>
          <div className="bg-[#1a3a2a]/5 border-2 border-[#c9a84c]/30 rounded-2xl p-6 text-center">
            <p className="text-neutral-600 text-sm">
              ¿Tienes preguntas sobre privacidad? Contáctanos en{" "}
              <a href="/contacto" className="text-[#c9a84c] hover:underline font-bold">nuestra página de contacto</a>
            </p>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </main>
  );
}