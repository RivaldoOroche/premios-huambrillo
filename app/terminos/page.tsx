import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeIn from "../components/FadeIn";

export default function Terminos() {
  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]">
      <Navbar />

      <section className="relative bg-[#1a3a2a] text-center py-12 px-4 border-b-2 border-[#c9a84c] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,168,76,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <FadeIn>
          <span className="text-5xl block mb-3">📋</span>
          <h1 className="font-bebas text-5xl sm:text-6xl tracking-[5px] uppercase text-[#c9a84c] mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-white/70 text-sm">Última actualización: Abril 2026</p>
        </FadeIn>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {[
          {
            titulo: "1. Aceptación de los Términos",
            contenido: "Al participar en cualquier sorteo organizado por Premios Huambrillo, el participante acepta íntegramente los presentes términos y condiciones. Si no está de acuerdo con alguna de las condiciones, no debe participar.",
          },
          {
            titulo: "2. Requisitos de Participación",
            contenido: "Pueden participar todas las personas mayores de 18 años residentes en el territorio peruano. La participación está sujeta al pago del valor del ticket mediante los métodos de pago habilitados (YAPE o PLIN). Cada ticket otorga una oportunidad de participar en el sorteo correspondiente.",
          },
          {
            titulo: "3. Proceso de Compra",
            contenido: "El participante debe realizar el pago del valor del ticket a la cuenta verificada de HUAMBRILLO S.A.C. y enviar el comprobante de pago a través de la plataforma web. Una vez verificado el pago, se asignará el número de ticket correspondiente. Premios Huambrillo no se hace responsable de pagos realizados a cuentas distintas a la oficial.",
          },
          {
            titulo: "4. Realización del Sorteo",
            contenido: "Los sorteos se realizan en la fecha y hora indicada en cada convocatoria, mediante transmisión en vivo a través de Facebook. El proceso es transparente y aleatorio. El resultado del sorteo es definitivo e inapelable.",
          },
          {
            titulo: "5. Entrega de Premios",
            contenido: "El ganador será contactado a través del número de WhatsApp registrado al momento de la compra. El premio debe ser reclamado dentro de los 30 días calendario posteriores al sorteo. Premios Huambrillo coordinará la entrega del premio con el ganador.",
          },
          {
            titulo: "6. Cancelaciones y Reembolsos",
            contenido: "Una vez confirmado el pago, no se realizan reembolsos. En caso de cancelación del sorteo por causas de fuerza mayor, se notificará a todos los participantes y se procederá según lo establecido en cada caso particular.",
          },
          {
            titulo: "7. Modificaciones",
            contenido: "Premios Huambrillo se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de los canales oficiales.",
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
              ¿Tienes dudas? Contáctanos en{" "}
              <a href="/contacto" className="text-[#c9a84c] hover:underline font-bold">nuestra página de contacto</a>
            </p>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </main>
  );
}