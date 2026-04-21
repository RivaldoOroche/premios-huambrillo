import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b-2 border-gold-400">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">

        <a href="/" className="font-bebas text-3xl tracking-[4px] text-gold-400 uppercase drop-shadow-[0_0_12px_rgba(232,184,0,0.5)]">
          Premios <span className="text-red-500">Huambrillo</span>
        </a>

        <div className="flex flex-wrap justify-center gap-2">
          <a href="#" className="nav-link">🎫 Mis Tickets</a>
          <a href="#" className="nav-link">📣 Canal</a>
          <a href="#" className="nav-link">🏆 Ganadores</a>
          <a href="#" className="nav-link nav-link-red">💬 WhatsApp</a>
          <a href="#" className="nav-link">🔵 Facebook</a>
          <Link href="/ganadores" className="nav-link">🏆 Ganadores</Link>
        </div>

      </div>
    </nav>
  );
}