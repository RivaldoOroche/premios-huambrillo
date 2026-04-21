import { sorteos } from "../data/sorteos";
import SorteoCard from "./SorteoCard";
import FadeIn from "./FadeIn";

export default function Sorteos() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <FadeIn>
        <h2 className="text-center font-bebas text-4xl tracking-widest uppercase text-[#e8b800] mb-2">
          Sorteos Activos
        </h2>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded mb-10" />
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorteos.map((sorteo, i) => (
          <FadeIn key={sorteo.id} delay={i * 0.15}>
            <SorteoCard sorteo={sorteo} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}