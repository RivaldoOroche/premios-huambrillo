export default function SorteoSkeleton() {
  return (
    <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-14 bg-neutral-800" />
      <div className="p-5 space-y-3">
        <div className="h-8 bg-neutral-800 rounded-lg w-3/4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="h-6 w-8 bg-neutral-800 rounded" />
            <div className="h-4 bg-neutral-800 rounded flex-1" />
          </div>
        ))}
        <div className="h-20 bg-neutral-800 rounded-xl mt-4" />
        <div className="h-12 bg-neutral-800 rounded-xl" />
      </div>
    </div>
  );
}