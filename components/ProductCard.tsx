import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { addToCartAction } from "@/app/actions";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] || "/logo.svg";
  const soldOut = product.stock < 1 || product.status !== "active";

  return (
    <article className="product-surface grid overflow-hidden rounded-md border border-slate-200 shadow-sm">
      <Link href={`/products/${product.slug}`} className="focus-ring block bg-white">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            {product.collectionTitles?.slice(0, 2).map((title) => (
              <span key={title} className="rounded-sm bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">
                {title}
              </span>
            ))}
          </div>
          <Link href={`/products/${product.slug}`} className="focus-ring rounded-sm">
            <h3 className="text-base font-semibold text-slate-950">{product.name}</h3>
          </Link>
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">{product.description}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-950">{formatMoney(product.priceCents)}</p>
            {product.compareAtCents ? (
              <p className="text-sm text-slate-500 line-through">{formatMoney(product.compareAtCents)}</p>
            ) : null}
          </div>
          <form action={addToCartAction}>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <SubmitButton
              pendingText="Adding"
              disabled={soldOut}
              className="min-h-10 px-3"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>{soldOut ? "Sold out" : "Add"}</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </article>
  );
}
