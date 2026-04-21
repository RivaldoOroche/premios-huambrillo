import { sorteos } from "../data/sorteos";
import SorteoCard from "./SorteoCard";

export default function Sorteos() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-center text-4xl font-black tracking-widest uppercase text-yellow-400 mb-2">
        Sorteos Activos
      </h2>
      <div className="w-20 h-1 bg-red-600 mx-auto rounded mb-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorteos.map((sorteo) => (
          <SorteoCard key={sorteo.id} sorteo={sorteo} />
        ))}
      </div>
    </section>
  );
}