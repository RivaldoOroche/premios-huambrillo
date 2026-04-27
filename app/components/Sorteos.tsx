import SorteoCard from "./SorteoCard";
import FadeIn from "./FadeIn";

interface Props {
  sorteos: Record<string, unknown>[];
}

export default function Sorteos({ sorteos }: Props) {
  if (!sorteos?.length) return (
    <section className="max-w-5xl mx-auto px-4 py-12 text-center">
      <p className="text-neutral-500">No hay sorteos activos en este momento.</p>
    </section>
  );

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <FadeIn>
        <h2 className="text-center font-bebas text-4xl tracking-widest uppercase text-[#e8b800] mb-2">
          Sorteos Activos
        </h2>
        <div className="w-20 h-1 bg-red-600 mx-auto rounded mb-10" />
      </FadeIn>

      <div className={`grid gap-6 items-stretch ${
        sorteos.length === 1
          ? "grid-cols-1 max-w-lg mx-auto"
          : "grid-cols-1 md:grid-cols-2"
      }`}>
        {sorteos.map((sorteo, i) => (
          <FadeIn key={sorteo.sorteo_id as string} delay={i * 0.15} className="flex">
            <SorteoCard sorteo={sorteo} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}