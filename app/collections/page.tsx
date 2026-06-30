import Link from "next/link";
import { getCollections } from "@/lib/data";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase text-teal-700">Browse</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Collections</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Shop grouped products without losing stock or pricing accuracy.
        </p>
      </section>

      {collections.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              href={`/collections/${collection.slug}`}
              key={collection.id}
              className="focus-ring group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-50">
                <img
                  src={collection.imageUrl || "/logo.svg"}
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-slate-950">{collection.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No collections yet"
          message="Create collections from the admin panel to organize the storefront."
          href="/admin/collections"
          action="Manage collections"
        />
      )}
    </main>
  );
}
