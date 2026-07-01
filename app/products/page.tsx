import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Browse our full catalog of premium essentials — bags, apparel, accessories, and home goods with real-time stock and fast checkout."
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const products = await getProducts({ query });

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase text-teal-700">Shop</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Products</h1>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row" action="/products">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              className="focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white px-10 py-2 text-sm"
              name="q"
              defaultValue={query}
              placeholder="Search products, materials, tags"
            />
          </label>
          <button className="focus-ring min-h-11 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800" type="submit">
            Search
          </button>
        </form>
      </section>

      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          message="Try a different search or browse all collections."
          href="/collections"
          action="Browse collections"
        />
      )}
    </main>
  );
}
