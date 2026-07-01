"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Package, ShoppingCart, UsersRound } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: UsersRound }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:h-fit">
      <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Admin</p>
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`focus-ring inline-flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
              active
                ? "bg-slate-950 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <link.icon className={`h-4 w-4 ${active ? "text-teal-400" : "text-teal-600"}`} aria-hidden="true" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
