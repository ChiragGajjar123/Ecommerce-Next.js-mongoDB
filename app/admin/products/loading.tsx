import { AdminShell } from "@/components/admin/AdminShell";
import { Skeleton, TableSkeleton } from "@/components/Skeleton";

export default function LoadingAdminProducts() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-[680px]" />
        <TableSkeleton />
      </div>
    </AdminShell>
  );
}
