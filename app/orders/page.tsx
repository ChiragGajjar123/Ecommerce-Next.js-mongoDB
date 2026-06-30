import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrdersForUser } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in?redirectTo=/orders");
  }

  const orders = await getOrdersForUser(session.id);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase text-teal-700">Account</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Orders</h1>
      </section>

      {orders.length ? (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 divide-y divide-slate-100">
            {orders.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="focus-ring grid gap-3 p-4 hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
                <p className="text-sm text-slate-600">{order.items.length} items</p>
                <p className="font-bold text-slate-950">{formatMoney(order.totalCents)}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState title="No orders yet" message="Your completed orders will appear here." href="/products" action="Shop products" />
      )}
    </main>
  );
}
