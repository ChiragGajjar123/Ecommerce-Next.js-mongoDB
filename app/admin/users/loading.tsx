import { AdminShell } from "@/components/admin/AdminShell";
import { Skeleton, TableSkeleton } from "@/components/Skeleton";

export default function LoadingAdminUsers() {
  return (
    <AdminShell>
      <div className="grid gap-6">
        <Skeleton className="h-28" />
        <TableSkeleton />
      </div>
    </AdminShell>
  );
}
