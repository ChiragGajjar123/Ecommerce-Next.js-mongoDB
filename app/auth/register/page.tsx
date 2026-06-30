import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { RegisterForm } from "@/components/forms/AuthForms";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) {
    redirect("/account");
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-xl gap-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid justify-items-start gap-4">
          <Logo className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Create account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Save addresses and track all orders in one place.</p>
          </div>
        </div>
        <RegisterForm />
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="focus-ring rounded-sm font-semibold text-teal-800 hover:text-teal-950">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
