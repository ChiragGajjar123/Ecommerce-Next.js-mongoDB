import { notFound } from "next/navigation";
import { getCollectionBySlug, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getProducts({ collectionSlug: collection.slug });

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[0.8fr_1fr]">
          <div className="aspect-[16/10] bg-slate-50 lg:aspect-auto">
            <img src={collection.imageUrl || "/logo.svg"} alt={collection.title} className="h-full w-full object-cover" />
          </div>
          <div className="grid content-center gap-3 p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase text-teal-700">Collection</p>
            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{collection.title}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">{collection.description}</p>
          </div>
        </div>
      </section>

      {products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products in this collection"
          message="Check back soon or browse the full catalog."
          href="/products"
          action="Shop all products"
        />
      )}
    </main>
  );
}
