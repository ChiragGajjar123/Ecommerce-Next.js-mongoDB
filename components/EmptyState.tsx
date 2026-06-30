import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EmptyState({
  title,
  message,
  href,
  action
}: {
  title: string;
  message: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">{message}</p>
      <Link
        href={href}
        className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        {action}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
