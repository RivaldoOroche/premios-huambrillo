export default function AlertaSeguridad() {
  return (
    <section className="bg-[#fffbf0] border-y-4 border-[#c9a84c] py-10 px-4 text-center">

      <span className="text-5xl block mb-3">⚠️</span>

      <h2 className="text-3xl font-black tracking-widest uppercase text-[#8a6a00] mb-4">
        ⚠️ Alerta de Seguridad ⚠️
      </h2>

      <p className="text-neutral-600 max-w-lg mx-auto mb-6 leading-relaxed">
       Atención el pago debe ser a nombre de: Cristian Melendez
      </p>

      <div className="inline-block bg-[#1a3a2a] text-white font-black text-xl px-8 py-3 rounded-lg tracking-wide mb-6">
      Cristian Melendez
      </div>

      <p className="text-red-600 font-black tracking-wide text-sm">
        Si sale otro nombre, ¡ESTÁS SIENDO ESTAFADO! No realices ningún pago.
      </p>

    </section>
  );
}