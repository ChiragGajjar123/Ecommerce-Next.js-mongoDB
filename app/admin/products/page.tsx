import Link from "next/link";
import { archiveProductAction } from "@/app/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { StatusBadge } from "@/components/StatusBadge";
import { getCollections, getProductById, getProducts } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const [products, collections, editing] = await Promise.all([
    getProducts({ includeDrafts: true }),
    getCollections(),
    params.edit ? getProductById(params.edit, true) : Promise.resolve(null)
  ]);

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Products</h1>
        </section>

        <ProductForm product={editing ?? undefined} collections={collections} />

        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-950">Catalog</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 pl-5 font-semibold">Product</th>
                  <th className="py-3 font-semibold">Price</th>
                  <th className="py-3 font-semibold">Stock</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 pr-5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0] || "/logo.svg"} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                        <div>
                          <p className="font-semibold text-slate-950">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-slate-950">{formatMoney(product.priceCents)}</td>
                    <td className="py-3 text-slate-600">{product.stock}</td>
                    <td className="py-3"><StatusBadge status={product.status} /></td>
                    <td className="py-3 pr-5">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products?edit=${product.id}`} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                          Edit
                        </Link>
                        <form action={archiveProductAction}>
                          <input type="hidden" name="id" value={product.id} />
                          <button className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50" type="submit">
                            Draft
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!products.length ? <p className="p-5 text-sm text-slate-600">No products yet.</p> : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
