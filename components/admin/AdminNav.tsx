import Link from "next/link";
import { Boxes, LayoutDashboard, Package, ShoppingCart, UsersRound } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: UsersRound }
];

export function AdminNav() {
  return (
    <nav className="grid gap-2 rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:h-fit">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="focus-ring inline-flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <link.icon className="h-4 w-4 text-teal-700" aria-hidden="true" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
