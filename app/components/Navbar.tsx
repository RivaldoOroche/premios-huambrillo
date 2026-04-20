export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#111] border-b-4 border-yellow-400">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">

        {/* Logo */}
        <a href="/" className="font-black text-2xl tracking-widest text-yellow-400 uppercase">
          Premios <span className="text-red-500">Huambrillo</span>
        </a>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          <a href="#" className="nav-link">🎫 Mis Tickets</a>
          <a href="#" className="nav-link">📣 Canal</a>
          <a href="#" className="nav-link">🏆 Ganadores</a>
          <a href="#" className="nav-link nav-link-red">💬 WhatsApp</a>
          <a href="#" className="nav-link">🔵 Facebook</a>
        </div>

      </div>
    </nav>
  );
}