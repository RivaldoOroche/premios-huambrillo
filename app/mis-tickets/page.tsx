import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConsultarTickets from "../components/ConsultarTickets";

export default function MisTickets() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />
      <section className="relative bg-[#0d0d0d] text-center py-12 px-4 border-b-2 border-[#e8b800] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,184,0,0.07)_0%,_transparent_70%)] pointer-events-none" />
        <span className="text-5xl block mb-3">🎫</span>
        <h1 className="font-bebas text-5xl sm:text-7xl tracking-[5px] uppercase text-[#e8b800] mb-2">
          Mis Tickets
        </h1>
        <p className="text-neutral-400 text-sm uppercase tracking-widest">
          Consulta el estado de tus tickets por número de teléfono
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8b800]" />
          <span className="text-[#e8b800] text-xs tracking-[6px]">★ ★ ★</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8b800]" />
        </div>
      </section>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ConsultarTickets />
      </div>
      <Footer />
    </main>
  );
}