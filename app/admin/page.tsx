import Link from "next/link";
import { Boxes, Package, ShoppingCart, UsersRound } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getAdminOrders, getAdminStats } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);

  const cards = [
    { label: "Revenue", value: formatMoney(stats.revenueCents), icon: ShoppingCart },
    { label: "Orders", value: String(stats.ordersCount), icon: Boxes },
    { label: "Products", value: String(stats.productsCount), icon: Package },
    { label: "Users", value: String(stats.usersCount), icon: UsersRound }
  ];

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage catalog, orders, customers, and collections without a separate backend service.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                <card.icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Recent orders</h2>
              <p className="mt-1 text-sm text-slate-600">{stats.pendingOrders} need attention.</p>
            </div>
            <Link href="/admin/orders" className="focus-ring rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
              Manage orders
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 font-semibold">Order</th>
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold text-slate-950">{order.orderNumber}</td>
                    <td className="py-3 text-slate-600">{order.userEmail}</td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                    <td className="py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="py-3 text-right font-semibold text-slate-950">{formatMoney(order.totalCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length ? <p className="py-6 text-sm text-slate-600">No orders yet.</p> : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
