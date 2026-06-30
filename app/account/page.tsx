import Link from "next/link";
import { redirect } from "next/navigation";
import { AddressForm } from "@/components/forms/AddressForm";
import { getOrdersForUser, getUserById } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { getSession } from "@/lib/session";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in?redirectTo=/account");
  }

  const [user, orders] = await Promise.all([getUserById(session.id), getOrdersForUser(session.id)]);
  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase text-teal-700">Profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{user.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{user.email}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Address book</h2>
          <div className="mt-5 grid gap-5">
            {user.addresses.map((address) => (
              <div key={address.id} className="rounded-md border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-950">{address.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {address.name}, {address.line1}, {address.city}, {address.state} {address.postalCode}
                </p>
              </div>
            ))}
            <div className="rounded-md border border-dashed border-slate-300 p-4">
              <h3 className="font-semibold text-slate-950">Add or update address</h3>
              <div className="mt-4">
                <AddressForm />
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-950">Recent orders</h2>
            <Link href="/orders" className="focus-ring rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {orders.slice(0, 5).map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id} className="focus-ring rounded-md border border-slate-200 p-3 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-950">{formatMoney(order.totalCents)}</p>
              </Link>
            ))}
            {!orders.length ? <p className="text-sm text-slate-600">No orders yet.</p> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
