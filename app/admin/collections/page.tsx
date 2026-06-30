import Link from "next/link";
import { deleteCollectionAction } from "@/app/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getCollections } from "@/lib/data";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const collections = await getCollections();
  const editing = collections.find((collection) => collection.id === params.edit);

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Collections</h1>
        </section>

        <CollectionForm collection={editing} />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <article key={collection.id} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <img src={collection.imageUrl || "/logo.svg"} alt={collection.title} className="aspect-[16/9] w-full object-cover" />
              <div className="grid gap-3 p-4">
                <div>
                  <h2 className="font-semibold text-slate-950">{collection.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">{collection.slug}</p>
                </div>
                <p className="line-clamp-2 text-sm leading-5 text-slate-600">{collection.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/collections?edit=${collection.id}`} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    Edit
                  </Link>
                  <form action={deleteCollectionAction}>
                    <input type="hidden" name="id" value={collection.id} />
                    <button className="focus-ring rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
