import { Skeleton } from "@/components/Skeleton";

export default function LoadingCheckout() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 rounded-md border border-slate-200 bg-white p-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-full" />
          ))}
          <Skeleton className="h-56 w-full" />
        </div>
        <Skeleton className="h-96" />
      </section>
    </main>
  );
}
