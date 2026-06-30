import { Skeleton } from "@/components/Skeleton";

export default function LoadingProduct() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Skeleton className="aspect-square" />
        <div className="grid gap-5 rounded-md border border-slate-200 bg-white p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </section>
    </main>
  );
}
