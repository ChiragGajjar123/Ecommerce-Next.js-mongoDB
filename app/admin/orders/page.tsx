import { updateOrderStatusAction } from "@/app/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/StatusBadge";
import { SubmitButton } from "@/components/SubmitButton";
import { getAdminOrders } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statuses: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAdminOrders();

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Orders</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Update fulfillment status as orders move through the workflow.</p>
        </section>

        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 pl-5 font-semibold">Order</th>
                  <th className="py-3 font-semibold">Customer</th>
                  <th className="py-3 font-semibold">Items</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Date</th>
                  <th className="py-3 text-right font-semibold">Total</th>
                  <th className="py-3 pr-5 text-right font-semibold">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pl-5 align-top">
                      <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-slate-500">{order.address.city}, {order.address.state}</p>
                    </td>
                    <td className="py-3 align-top text-slate-600">{order.userEmail}</td>
                    <td className="py-3 align-top text-slate-600">{order.items.length}</td>
                    <td className="py-3 align-top"><StatusBadge status={order.status} /></td>
                    <td className="py-3 align-top text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="py-3 align-top text-right font-semibold text-slate-950">{formatMoney(order.totalCents)}</td>
                    <td className="py-3 pr-5 align-top">
                      <form action={updateOrderStatusAction} className="ml-auto flex w-fit items-center justify-end gap-2">
                        <input type="hidden" name="orderId" value={order.id} />
                        <select
                          className="focus-ring min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                          name="status"
                          defaultValue={order.status}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <SubmitButton pendingText="Saving" className="min-h-10 px-3">
                          Save
                        </SubmitButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length ? <p className="p-5 text-sm text-slate-600">No orders yet.</p> : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
