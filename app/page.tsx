import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { getCollections, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, collections] = await Promise.all([
    getProducts({ featuredOnly: true, limit: 8 }),
    getCollections({ featuredOnly: true })
  ]);
  const heroProduct = featuredProducts[0];

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-14">
        <div className="grid content-center gap-6">
          <p className="w-fit rounded-sm bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
            Curated essentials, built for quick checkout
          </p>
          <div className="grid gap-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Shop refined daily essentials with real stock visibility.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse collections, save addresses with map context, track orders, and manage the entire catalog from one admin panel.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Shop products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/collections"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              View collections
            </Link>
          </div>
          <div className="grid gap-3 pt-4 sm:grid-cols-3">
            {[
              { icon: Zap, label: "Fast server totals" },
              { icon: Truck, label: "Shipping estimates" },
              { icon: ShieldCheck, label: "Server-side checkout" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-3">
                <item.icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-80 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          {heroProduct ? (
            <Link href={`/products/${heroProduct.slug}`} className="focus-ring block h-full">
              <div className="relative h-full min-h-80">
                <img
                  src={heroProduct.images[0] || "/logo.svg"}
                  alt={heroProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-6 text-white">
                  <p className="text-sm font-semibold text-amber-100">Featured</p>
                  <h2 className="mt-2 text-2xl font-bold">{heroProduct.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-100">{heroProduct.description}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="grid h-full min-h-80 place-items-center p-8 text-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Add products from admin</h2>
                <p className="mt-2 text-sm text-slate-600">Seed the store or create products to fill this space.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {collections.slice(0, 4).map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="focus-ring group overflow-hidden rounded-md border border-slate-200 bg-slate-50"
            >
              <div className="aspect-[16/9] overflow-hidden bg-white">
                <img
                  src={collection.imageUrl || "/logo.svg"}
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-slate-950">{collection.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Popular now</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Featured products</h2>
          </div>
          <Link href="/products" className="focus-ring rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
            View all products
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
