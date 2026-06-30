import { Skeleton } from "@/components/Skeleton";

export default function LoadingAccount() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-48" />
        <Skeleton className="mt-3 h-5 w-64" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Skeleton className="h-[720px]" />
        <Skeleton className="h-96" />
      </section>
    </main>
  );
}
