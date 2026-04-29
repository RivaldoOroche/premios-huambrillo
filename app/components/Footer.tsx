import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-[#e8b800] py-8 px-4 text-center">
      <p className="font-bebas text-2xl tracking-widest uppercase text-[#e8b800] mb-4">
        Premios <span className="text-red-500">Huambrillo</span>
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <Link href="/terminos"    className="text-neutral-500 hover:text-[#e8b800] text-sm transition-colors">Términos y Condiciones</Link>
        <Link href="/privacidad"  className="text-neutral-500 hover:text-[#e8b800] text-sm transition-colors">Política de Privacidad</Link>
        <Link href="/contacto"    className="text-neutral-500 hover:text-[#e8b800] text-sm transition-colors">Contacto</Link>
        <Link href="/como-participar" className="text-neutral-500 hover:text-[#e8b800] text-sm transition-colors">¿Cómo participar?</Link>
        <Link href="/ganadores"   className="text-neutral-500 hover:text-[#e8b800] text-sm transition-colors">Ganadores</Link>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <a href="https://wa.me/51999000000" target="_blank" className="text-green-500 hover:text-green-400 text-sm transition-colors">💬 WhatsApp</a>
        <a href="https://facebook.com/premioshuambrillo" target="_blank" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">🔵 Facebook</a>
        <a href="https://instagram.com/premioshuambrillo" target="_blank" className="text-pink-400 hover:text-pink-300 text-sm transition-colors">📸 Instagram</a>
      </div>

      <p className="text-neutral-600 text-xs">
        © {new Date().getFullYear()} Premios Huambrillo. Todos los derechos reservados.
      </p>
    </footer>
  );
}