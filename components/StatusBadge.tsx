import type { OrderStatus, ProductStatus } from "@/lib/types";

const statusClasses: Record<string, string> = {
  active: "border-teal-200 bg-teal-50 text-teal-800",
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-sky-200 bg-sky-50 text-sky-800",
  packed: "border-indigo-200 bg-indigo-50 text-indigo-800",
  shipped: "border-purple-200 bg-purple-50 text-purple-800",
  delivered: "border-teal-200 bg-teal-50 text-teal-800",
  cancelled: "border-red-200 bg-red-50 text-red-800"
};

export function StatusBadge({ status }: { status: OrderStatus | ProductStatus }) {
  return (
    <span className={`inline-flex rounded-sm border px-2 py-1 text-xs font-semibold capitalize ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
