import { ProductGridSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          <Skeleton className="h-10 w-3/4 max-w-xl" />
          <Skeleton className="h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-2/3 max-w-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-28" />
          </div>
        </div>
        <Skeleton className="aspect-[5/4] min-h-64" />
      </section>
      <ProductGridSkeleton />
    </main>
  );
}
