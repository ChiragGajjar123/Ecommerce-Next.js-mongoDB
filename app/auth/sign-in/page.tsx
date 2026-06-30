import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { SignInForm } from "@/components/forms/AuthForms";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  if (session) {
    redirect(params.redirectTo || "/account");
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-md gap-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid justify-items-start gap-4">
          <Logo className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Sign in</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Access orders, checkout, and admin tools.</p>
          </div>
        </div>
        <SignInForm redirectTo={params.redirectTo} />
        <p className="text-sm text-slate-600">
          New here?{" "}
          <Link href="/auth/register" className="focus-ring rounded-sm font-semibold text-teal-800 hover:text-teal-950">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
