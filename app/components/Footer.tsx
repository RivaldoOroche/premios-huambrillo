export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-yellow-400 py-8 px-4 text-center">

      <p className="text-2xl font-black tracking-widest uppercase text-yellow-400 mb-4">
        Premios <span className="text-red-500">Huambrillo</span>
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <a href="#" className="text-neutral-500 hover:text-yellow-400 text-sm transition-colors">Términos y Condiciones</a>
        <a href="#" className="text-neutral-500 hover:text-yellow-400 text-sm transition-colors">Política de Privacidad</a>
        <a href="#" className="text-neutral-500 hover:text-yellow-400 text-sm transition-colors">Contacto</a>
      </div>

      <p className="text-neutral-600 text-xs">
        © 2026 Premios Huambrillo. Todos los derechos reservados.
      </p>

    </footer>
  );
}