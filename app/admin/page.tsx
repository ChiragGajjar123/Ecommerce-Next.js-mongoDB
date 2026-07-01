import Link from "next/link";
import type { Metadata } from "next";
import { Boxes, Package, ShoppingCart, UsersRound, TrendingUp, Clock } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getAdminOrders, getAdminStats } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "CMG admin dashboard — manage products, collections, orders, and users."
};

export default async function AdminPage() {
  await requireAdmin();
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);

  const cards = [
    {
      label: "Revenue",
      value: formatMoney(stats.revenueCents),
      icon: TrendingUp,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100"
    },
    {
      label: "Orders",
      value: String(stats.ordersCount),
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      label: "Active products",
      value: String(stats.productsCount),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
    {
      label: "Customers",
      value: String(stats.usersCount),
      icon: UsersRound,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100"
    }
  ];

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Admin</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950">Dashboard</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage catalog, orders, customers, and collections in one place.
              </p>
            </div>
            {stats.pendingOrders > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-amber-800">{stats.pendingOrders} pending</p>
                  <p className="text-xs text-amber-600">Need attention</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className={`rounded-xl border ${card.border} bg-white p-5 shadow-sm`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <div className={`rounded-lg ${card.bg} p-2`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-950">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Recent orders</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {stats.pendingOrders > 0
                  ? `${stats.pendingOrders} order${stats.pendingOrders > 1 ? "s" : ""} need attention`
                  : "All orders are up to date"}
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="focus-ring rounded-md border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Manage all orders →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="py-3 pl-5 font-semibold">Order</th>
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 pr-5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3.5 pl-5">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-semibold text-slate-950 hover:text-teal-700"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 text-slate-600">{order.userEmail}</td>
                    <td className="py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 text-slate-500">{formatDate(order.createdAt)}</td>
                    <td className="py-3.5 pr-5 text-right font-semibold text-slate-950">
                      {formatMoney(order.totalCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No orders yet. Share your store to start receiving orders.
              </p>
            ) : null}
          </div>
        </section>

        {/* Quick links */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/admin/products", label: "Manage products", icon: Package, desc: "Add, edit, or archive catalog items" },
            { href: "/admin/collections", label: "Manage collections", icon: Boxes, desc: "Group products into collections" },
            { href: "/admin/users", label: "Manage users", icon: UsersRound, desc: "Update roles and disable accounts" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring card-hover flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="rounded-lg bg-slate-100 p-2.5">
                <item.icon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-950">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
