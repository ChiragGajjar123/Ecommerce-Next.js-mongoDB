import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-12">
      <div className="rounded-md border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page may have moved, or the product is no longer available.
        </p>
        <Link
          href="/products"
          className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Shop products
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
