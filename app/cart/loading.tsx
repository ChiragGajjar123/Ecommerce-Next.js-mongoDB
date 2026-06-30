import { Skeleton } from "@/components/Skeleton";

export default function LoadingCart() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-32" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr]">
              <Skeleton className="aspect-square" />
              <div className="grid gap-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-44" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80" />
      </section>
    </main>
  );
}
