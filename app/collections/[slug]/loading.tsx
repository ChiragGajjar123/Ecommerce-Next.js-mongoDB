import { ProductGridSkeleton, Skeleton } from "@/components/Skeleton";

export default function LoadingCollectionDetail() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="grid lg:grid-cols-[0.8fr_1fr]">
          <Skeleton className="aspect-[16/10] rounded-none lg:aspect-auto" />
          <div className="grid gap-4 p-6 sm:p-8">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <Skeleton className="h-5 w-4/5 max-w-xl" />
          </div>
        </div>
      </section>
      <ProductGridSkeleton />
    </main>
  );
}
