import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Zap, Star } from "lucide-react";
import { getCollections, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CMG — Premium Essentials",
  description: "Shop curated premium essentials with real-time stock, server-accurate pricing, and fast checkout. Browse collections, track orders, and save delivery addresses."
};

const badges = [
  { icon: Zap, label: "Instant totals" },
  { icon: Truck, label: "Delivery estimate" },
  { icon: ShieldCheck, label: "Secure checkout" }
];

export default async function HomePage() {
  const [featuredProducts, collections] = await Promise.all([
    getProducts({ featuredOnly: true, limit: 8 }),
    getCollections({ featuredOnly: true })
  ]);
  const heroProduct = featuredProducts[0];

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="grid content-center gap-7">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" aria-hidden="true" />
              Curated essentials, real-time stock
            </span>
          </div>
          <div className="grid gap-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Shop refined daily{" "}
              <span className="gold-text">essentials</span>{" "}
              built for you.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Browse collections, save addresses with map preview, track every order, and check out with live server-calculated pricing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
            >
              Shop products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/collections"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              View collections
            </Link>
          </div>
          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {badges.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <item.icon className="h-5 w-5 text-teal-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          {heroProduct ? (
            <Link href={`/products/${heroProduct.slug}`} className="focus-ring block h-full">
              <div className="relative h-full min-h-80">
                <img
                  src={heroProduct.images[0] || "/logo.svg"}
                  alt={heroProduct.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-102"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 text-white">
                  <span className="inline-block rounded-sm bg-amber-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-amber-200">
                    Featured
                  </span>
                  <h2 className="mt-2 text-2xl font-bold">{heroProduct.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-200">{heroProduct.description}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="grid h-full min-h-80 place-items-center p-8 text-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Add products from admin</h2>
                <p className="mt-2 text-sm text-slate-500">Seed the store or create products to fill this space.</p>
                <Link
                  href="/admin"
                  className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Go to admin
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Collections strip */}
      {collections.length > 0 && (
        <section className="border-y border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {collections.slice(0, 4).map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="focus-ring card-hover group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm"
              >
                <div className="aspect-[16/9] overflow-hidden bg-white">
                  <img
                    src={collection.imageUrl || "/logo.svg"}
                    alt={collection.title}
                    className="h-full w-full object-cover transition duration-400 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-slate-950">{collection.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Popular now</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Featured products</h2>
          </div>
          <Link href="/products" className="focus-ring rounded-sm text-sm font-semibold text-teal-700 hover:text-teal-950">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            {[
              {
                title: "Server-accurate pricing",
                desc: "Every total—subtotal, discount, shipping, tax—is calculated on the server before you pay."
              },
              {
                title: "Map-pinned delivery",
                desc: "Save addresses with geolocation and see your delivery area on a live map before checkout."
              },
              {
                title: "Full order visibility",
                desc: "Track status from pending to delivered. Admins update fulfillment stages with one click."
              }
            ].map((item) => (
              <div key={item.title} className="grid gap-3">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
