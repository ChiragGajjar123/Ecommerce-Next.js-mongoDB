import { Skeleton } from "@/components/Skeleton";

export default function LoadingSignIn() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-md gap-4 rounded-md border border-slate-200 bg-white p-6">
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </section>
    </main>
  );
}
