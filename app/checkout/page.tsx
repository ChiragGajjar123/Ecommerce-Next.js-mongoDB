import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { EmptyState } from "@/components/EmptyState";
import { getCartItems } from "@/lib/cart";
import { getProductsByIds, getUserById } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { calculateCartSummary } from "@/lib/pricing";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in?redirectTo=/checkout");
  }

  const [items, user] = await Promise.all([getCartItems(), getUserById(session.id)]);
  const products = await getProductsByIds(items.map((item) => item.productId));
  const summary = await calculateCartSummary(items, products);

  if (!summary.lines.length) {
    return (
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState title="Cart is empty" message="Add products before starting checkout." href="/products" action="Shop products" />
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase text-teal-700">Secure checkout</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Delivery details</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Every order is checked on the server before stock is reserved.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <CheckoutForm defaultAddress={user?.addresses[0]} />
        </div>
        <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Order summary</h2>
          <div className="mt-4 grid gap-4">
            {summary.lines.map((line) => (
              <div key={line.product.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0">
                <img src={line.product.images[0] || "/logo.svg"} alt={line.product.name} className="h-16 w-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950">{line.product.name}</p>
                  <p className="mt-1 text-xs text-slate-500">Qty {line.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-950">{formatMoney(line.lineTotalCents)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-semibold text-slate-950">{formatMoney(summary.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Discount</dt>
              <dd className="font-semibold text-slate-950">{formatMoney(summary.discountCents)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Shipping</dt>
              <dd className="font-semibold text-slate-950">{formatMoney(summary.shippingCents)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-600">Tax</dt>
              <dd className="font-semibold text-slate-950">{formatMoney(summary.taxCents)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base">
              <dt className="font-bold text-slate-950">Total</dt>
              <dd className="font-bold text-slate-950">{formatMoney(summary.totalCents)}</dd>
            </div>
          </dl>
          {!summary.canCheckout ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {summary.issues[0]}
              <Link href="/cart" className="ml-1 font-semibold underline">
                Review cart
              </Link>
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
