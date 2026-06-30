import Link from "next/link";
import { Trash2 } from "lucide-react";
import { clearCartAction, updateCartItemAction } from "@/app/actions";
import { EmptyState } from "@/components/EmptyState";
import { SubmitButton } from "@/components/SubmitButton";
import { getCartItems } from "@/lib/cart";
import { getProductsByIds } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { calculateCartSummary } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const items = await getCartItems();
  const products = await getProductsByIds(items.map((item) => item.productId));
  const summary = await calculateCartSummary(items, products);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase text-teal-700">Checkout</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Cart</h1>
      </section>

      {summary.lines.length ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {summary.lines.map((line) => (
              <article key={line.product.id} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr]">
                <img
                  src={line.product.images[0] || "/logo.svg"}
                  alt={line.product.name}
                  className="aspect-square w-full rounded-md object-cover"
                />
                <div className="grid gap-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <Link href={`/products/${line.product.slug}`} className="focus-ring rounded-sm font-semibold text-slate-950">
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600">{formatMoney(line.product.priceCents)} each</p>
                      {line.issue ? <p className="mt-2 text-sm font-semibold text-red-700">{line.issue}</p> : null}
                    </div>
                    <p className="font-bold text-slate-950">{formatMoney(line.lineTotalCents)}</p>
                  </div>
                  <form action={updateCartItemAction} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="productId" value={line.product.id} />
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-slate-800">Quantity</span>
                      <input
                        className="focus-ring min-h-10 w-24 rounded-md border border-slate-300 px-3 text-sm"
                        type="number"
                        min="0"
                        max={Math.min(20, line.product.stock)}
                        defaultValue={line.quantity}
                        name="quantity"
                      />
                    </label>
                    <SubmitButton pendingText="Updating" className="min-h-10 px-3">
                      Update
                    </SubmitButton>
                  </form>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Summary</h2>
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
            {summary.issues.length ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {summary.issues[0]}
              </div>
            ) : null}
            <Link
              href="/checkout"
              aria-disabled={!summary.canCheckout}
              className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Checkout
            </Link>
            <form action={clearCartAction} className="mt-3">
              <button
                type="submit"
                className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear cart
              </button>
            </form>
          </aside>
        </section>
      ) : (
        <EmptyState title="Your cart is empty" message="Add products to see server-calculated totals here." href="/products" action="Shop products" />
      )}
    </main>
  );
}
