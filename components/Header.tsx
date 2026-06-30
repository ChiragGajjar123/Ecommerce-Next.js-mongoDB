import Link from "next/link";
import { LayoutDashboard, LogOut, PackageSearch, ShoppingBag, UserRound } from "lucide-react";
import { cartItemCount } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { signOutAction } from "@/app/actions";
import { Logo } from "@/components/Logo";

export async function Header() {
  const [session, count] = await Promise.all([getSession(), cartItemCount()]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Home" className="focus-ring rounded-md">
          <Logo className="h-10 w-auto sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/products">
            Shop
          </Link>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/collections">
            Collections
          </Link>
          {session ? (
            <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/orders">
              Orders
            </Link>
          ) : null}
          {session?.role === "admin" ? (
            <Link className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" href="/admin">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            aria-label="Search products"
            title="Search products"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
          >
            <PackageSearch className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href="/cart"
            className="focus-ring relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label={`Cart with ${count} items`}
            title="Cart"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-teal-700 px-1.5 text-center text-xs font-semibold text-white">
                {count}
              </span>
            ) : null}
          </Link>

          {session ? (
            <>
              {session.role === "admin" ? (
                <Link
                  href="/admin"
                  className="focus-ring hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:inline-flex"
                  aria-label="Admin dashboard"
                  title="Admin dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                </Link>
              ) : null}
              <Link
                href="/account"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                aria-label="Account"
                title="Account"
              >
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </Link>
              <form action={signOutAction}>
                <button
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  aria-label="Sign out"
                  title="Sign out"
                  type="submit"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              className="focus-ring inline-flex min-h-10 items-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
      <nav className="flex border-t border-slate-100 px-4 py-2 md:hidden" aria-label="Mobile">
        <Link className="flex-1 rounded-md px-2 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100" href="/products">
          Shop
        </Link>
        <Link className="flex-1 rounded-md px-2 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100" href="/collections">
          Collections
        </Link>
        <Link className="flex-1 rounded-md px-2 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-100" href={session ? "/orders" : "/auth/sign-in"}>
          Orders
        </Link>
      </nav>
    </header>
  );
}
