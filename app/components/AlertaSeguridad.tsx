import FadeIn from "./FadeIn";
export default function AlertaSeguridad() {
  return (
    <section className="bg-[#1a0a00] border-y-4 border-yellow-400 py-10 px-4 text-center">

      <span className="text-5xl block mb-3">⚠️</span>

      <h2 className="text-3xl font-black tracking-widest uppercase text-yellow-400 mb-4">
        ⚠️ Alerta de Seguridad ⚠️
      </h2>

      <p className="text-neutral-300 max-w-lg mx-auto mb-6 leading-relaxed">
        No te dejes engañar por cuentas falsas. Verifica siempre que al
        realizar el pago el nombre del destinatario sea exactamente:
      </p>

      <div className="inline-block bg-yellow-400 text-black font-black text-xl px-8 py-3 rounded-lg tracking-wide mb-6">
        HUAMBRILLO S.A.C.
      </div>

      <p className="text-red-500 font-black tracking-wide text-sm">
        Si sale otro nombre, ¡ESTÁS SIENDO ESTAFADO! No realices ningún pago.
      </p>

    </section>
  );
}