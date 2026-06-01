import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a3a2a] border-t-4 border-[#c9a84c] py-8 px-4 text-center">
      <p className="font-bebas text-2xl tracking-widest uppercase text-[#c9a84c] mb-4">
        Premios <span className="text-white">Huambrillo</span>
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <Link href="/terminos"    className="text-neutral-400 hover:text-[#c9a84c] text-sm transition-colors">Términos y Condiciones</Link>
        <Link href="/privacidad"  className="text-neutral-400 hover:text-[#c9a84c] text-sm transition-colors">Política de Privacidad</Link>
        <Link href="/contacto"    className="text-neutral-400 hover:text-[#c9a84c] text-sm transition-colors">Contacto</Link>
        <Link href="/como-participar" className="text-neutral-400 hover:text-[#c9a84c] text-sm transition-colors">¿Cómo participar?</Link>
        <Link href="/ganadores"   className="text-neutral-400 hover:text-[#c9a84c] text-sm transition-colors">Ganadores</Link>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <a href="https://wa.me/51958748545" target="_blank" className="text-green-400 hover:text-green-300 text-sm transition-colors">💬 WhatsApp</a>
        <a href="https://www.facebook.com/profile.php?id=61590388717742" target="_blank" className="text-blue-300 hover:text-blue-200 text-sm transition-colors">🔵 Facebook</a>
        <a href="https://instagram.com/premioshuambrillo" target="_blank" className="text-pink-300 hover:text-pink-200 text-sm transition-colors">📸 Instagram</a>
      </div>

      <p className="text-neutral-500 text-xs">
        © {new Date().getFullYear()} Premios Huambrillo. Todos los derechos reservados.
      </p>
    </footer>
  );
}