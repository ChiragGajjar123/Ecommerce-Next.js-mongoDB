import { TableSkeleton, Skeleton } from "@/components/Skeleton";

export default function LoadingOrders() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-40" />
      </section>
      <TableSkeleton />
    </main>
  );
}
