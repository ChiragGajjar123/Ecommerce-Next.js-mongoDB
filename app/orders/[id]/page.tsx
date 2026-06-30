import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { getOrderForUser } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in?redirectTo=/orders");
  }

  const { id } = await params;
  const order = await getOrderForUser(id, session.id);

  if (!order) {
    notFound();
  }

  const mapQuery = [order.address.line1, order.address.city, order.address.state, order.address.postalCode, order.address.country]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Order</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">{order.orderNumber}</h1>
            <p className="mt-2 text-sm text-slate-600">{formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Items</h2>
          <div className="mt-4 grid gap-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-3 border-b border-slate-100 pb-4 last:border-0">
                <img src={item.image || "/logo.svg"} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${item.slug}`} className="focus-ring rounded-sm font-semibold text-slate-950">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatMoney(item.unitPriceCents)} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-slate-950">{formatMoney(item.lineTotalCents)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid h-fit gap-6">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Totals</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Subtotal</dt>
                <dd className="font-semibold text-slate-950">{formatMoney(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Discount</dt>
                <dd className="font-semibold text-slate-950">{formatMoney(order.discountCents)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Shipping</dt>
                <dd className="font-semibold text-slate-950">{formatMoney(order.shippingCents)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Tax</dt>
                <dd className="font-semibold text-slate-950">{formatMoney(order.taxCents)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base">
                <dt className="font-bold text-slate-950">Total</dt>
                <dd className="font-bold text-slate-950">{formatMoney(order.totalCents)}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Delivery</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {order.address.name}, {order.address.line1}, {order.address.city}, {order.address.state} {order.address.postalCode}
            </p>
            <iframe
              title="Delivery address map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              className="mt-4 h-52 w-full rounded-md border border-slate-200"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </section>
    </main>
  );
}
