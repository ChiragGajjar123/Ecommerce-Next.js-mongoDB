import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { addToCartAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { getProductBySlug, getProducts } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = (await getProducts({ limit: 4 })).filter((item) => item.id !== product.id).slice(0, 4);
  const image = product.images[0] || "/logo.svg";
  const soldOut = product.stock < 1;

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <img src={image} alt={product.name} className="aspect-square h-full w-full object-cover" />
        </div>
        <div className="grid content-start gap-6 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap gap-2">
            {product.collectionTitles?.map((title) => (
              <span key={title} className="rounded-sm bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">
                {title}
              </span>
            ))}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-2xl font-bold text-slate-950">{formatMoney(product.priceCents)}</p>
              {product.compareAtCents ? (
                <p className="text-base text-slate-500 line-through">{formatMoney(product.compareAtCents)}</p>
              ) : null}
            </div>
          </div>
          <p className="text-base leading-7 text-slate-600">{product.description}</p>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {soldOut ? "Currently sold out." : `${product.stock} items available for immediate checkout.`}
          </div>
          <form action={addToCartAction} className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <input type="hidden" name="productId" value={product.id} />
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-800">Quantity</span>
              <input
                className="focus-ring min-h-11 rounded-md border border-slate-300 px-3 text-sm"
                name="quantity"
                type="number"
                min="1"
                max={Math.min(20, product.stock)}
                defaultValue="1"
                disabled={soldOut}
              />
            </label>
            <div className="grid content-end">
              <SubmitButton pendingText="Adding to cart" disabled={soldOut} className="w-full">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {soldOut ? "Sold out" : "Add to cart"}
              </SubmitButton>
            </div>
          </form>
          <Link href="/products" className="focus-ring w-fit rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
            Back to products
          </Link>
        </div>
      </section>

      {related.length ? (
        <section>
          <h2 className="mb-5 text-2xl font-bold text-slate-950">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
