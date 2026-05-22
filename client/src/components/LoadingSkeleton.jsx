function SkeletonCard() {
  return (
    <div className="bg-surface-card rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-surface-elevated" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-surface-elevated rounded w-4/5" />
        <div className="h-3 bg-surface-elevated rounded w-1/3" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="h-[70vh] min-h-[480px] max-h-[700px] bg-surface-elevated animate-pulse" />
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6 pt-20">
      <div className="h-[50vh] bg-surface-elevated" />
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="h-8 bg-surface-elevated rounded w-1/3" />
        <div className="h-4 bg-surface-elevated rounded w-full" />
        <div className="h-4 bg-surface-elevated rounded w-3/4" />
      </div>
    </div>
  );
}
