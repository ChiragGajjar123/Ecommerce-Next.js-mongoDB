import Link from "next/link";
import { Logo } from "@/components/Logo";

const year = new Date().getFullYear();

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/collections", label: "Collections" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" }
];

const accountLinks = [
  { href: "/auth/sign-in", label: "Sign in" },
  { href: "/auth/register", label: "Create account" },
  { href: "/account", label: "My account" },
  { href: "/orders", label: "Order history" }
];

const promoCodes = [
  { code: "WELCOME10", desc: "10% off your first order" },
  { code: "CMG500", desc: "₹5 flat discount" }
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="grid gap-4">
            <Logo className="h-10 w-auto" />
            <p className="text-sm leading-6 text-slate-500">
              Premium essentials with server-accurate stock, real-time pricing, and a seamless checkout.
            </p>
            <div className="flex gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                X
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                in
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                IG
              </span>
            </div>
          </div>

          {/* Shop */}
          <div className="grid gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Shop</h3>
            <ul className="grid gap-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring rounded-sm text-sm text-slate-500 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="grid gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Account</h3>
            <ul className="grid gap-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring rounded-sm text-sm text-slate-500 hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Promo codes */}
          <div className="grid gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Promo codes</h3>
            <ul className="grid gap-3">
              {promoCodes.map((promo) => (
                <li key={promo.code} className="rounded-md border border-dashed border-amber-200 bg-amber-50 p-3">
                  <p className="gold-text text-sm font-bold">{promo.code}</p>
                  <p className="mt-1 text-xs text-slate-600">{promo.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-8">
          <p className="text-xs text-slate-400">
            &copy; {year} CMG. All rights reserved. Built with Next.js &amp; MongoDB.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-400">Privacy policy</span>
            <span className="text-xs text-slate-400">Terms of service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
