import { AdminShell } from "@/components/admin/AdminShell";
import { Skeleton } from "@/components/Skeleton";

export default function LoadingAdminCollections() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-[520px]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
