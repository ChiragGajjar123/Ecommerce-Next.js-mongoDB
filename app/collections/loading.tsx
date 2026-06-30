import { Skeleton } from "@/components/Skeleton";

export default function LoadingCollections() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-52" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-md border border-slate-200 bg-white">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="grid gap-3 p-5">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
