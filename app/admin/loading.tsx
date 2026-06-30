import { AdminShell } from "@/components/admin/AdminShell";
import { Skeleton, TableSkeleton } from "@/components/Skeleton";

export default function LoadingAdmin() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-md border border-slate-200 bg-white p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-9 w-48" />
          <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </section>
        <TableSkeleton />
      </div>
    </AdminShell>
  );
}
