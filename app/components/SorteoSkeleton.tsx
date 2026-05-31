export default function SorteoSkeleton() {
  return (
    <div className="bg-white border-2 border-[#c9a84c]/20 rounded-2xl overflow-hidden animate-pulse shadow-sm">
      <div className="h-14 bg-[#c9a84c]/20" />
      <div className="p-5 space-y-3">
        <div className="h-8 bg-[#1a3a2a]/10 rounded-lg w-3/4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="h-6 w-8 bg-[#1a3a2a]/10 rounded" />
            <div className="h-4 bg-[#1a3a2a]/10 rounded flex-1" />
          </div>
        ))}
        <div className="h-20 bg-[#c9a84c]/10 rounded-xl mt-4" />
        <div className="h-12 bg-[#c9a84c]/20 rounded-xl" />
      </div>
    </div>
  );
}