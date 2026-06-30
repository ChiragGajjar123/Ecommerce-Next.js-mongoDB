import { updateUserRoleAction } from "@/app/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { SubmitButton } from "@/components/SubmitButton";
import { getAdminUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import type { Role } from "@/lib/types";

export const dynamic = "force-dynamic";

const roles: Role[] = ["customer", "admin"];

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Users</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Manage customer access and admin permissions.</p>
        </section>

        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 pl-5 font-semibold">User</th>
                  <th className="py-3 font-semibold">Role</th>
                  <th className="py-3 font-semibold">Addresses</th>
                  <th className="py-3 font-semibold">Joined</th>
                  <th className="py-3 pr-5 text-right font-semibold">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 pl-5 align-top">
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                      {user.disabled ? <p className="mt-1 text-xs font-semibold text-red-700">Disabled</p> : null}
                    </td>
                    <td className="py-3 align-top capitalize text-slate-600">{user.role}</td>
                    <td className="py-3 align-top text-slate-600">{user.addresses.length}</td>
                    <td className="py-3 align-top text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="py-3 pr-5 align-top">
                      <form action={updateUserRoleAction} className="ml-auto grid w-fit gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <div className="flex justify-end gap-2">
                          <select
                            className="focus-ring min-h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950"
                            name="role"
                            defaultValue={user.role}
                            disabled={user.id === session.id}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          <SubmitButton pendingText="Saving" className="min-h-10 px-3" disabled={user.id === session.id}>
                            Save
                          </SubmitButton>
                        </div>
                        <label className="flex justify-end gap-2 text-xs font-semibold text-slate-600">
                          <input
                            className="h-4 w-4 accent-red-700"
                            type="checkbox"
                            name="disabled"
                            defaultChecked={user.disabled ?? false}
                            disabled={user.id === session.id}
                          />
                          Disable user
                        </label>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length ? <p className="p-5 text-sm text-slate-600">No users yet.</p> : null}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
