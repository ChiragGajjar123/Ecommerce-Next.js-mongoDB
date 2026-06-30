export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="grid gap-3 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="grid gap-3 p-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="grid gap-3 border-b border-slate-100 pb-3 last:border-0 sm:grid-cols-5">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
