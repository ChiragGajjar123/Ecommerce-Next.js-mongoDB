"use client";

import { RotateCcw } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-12">
      <div className="rounded-md border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Something did not load</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The request failed before the page could finish. You can retry without losing your place.
        </p>
        <button
          type="button"
          onClick={reset}
          className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    </main>
  );
}
