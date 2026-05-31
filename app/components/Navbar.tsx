import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#1a3a2a] border-b-2 border-[#c9a84c]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">

        <Link href="/" className="flex items-center">
          <img
            src="/logo_premios_huambrillo.svg"
            alt="Premios Huambrillo"
            className="h-16 w-auto"
          />
        </Link>

        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/ganadores" className="nav-link">🏆 Ganadores</Link>
          <Link href="/empresas" className="nav-link">🏢 Empresas</Link>
          <Link href="/como-participar" className="nav-link">❓ ¿Cómo participan?</Link>
          <Link href="/contacto" className="nav-link">📬 Contacto</Link>
          <Link href="/mis-tickets" className="nav-link">🎟️ Mis Tickets</Link>
        </div>

      </div>
    </nav>
  );
}