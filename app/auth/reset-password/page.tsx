import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ResetPasswordForm } from "@/components/forms/AuthForms";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";
  const token = params.token ?? "";

  return (
    <main className="mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-md gap-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid justify-items-start gap-4">
          <Logo className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Choose a new password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Verify the password before updating your account.</p>
          </div>
        </div>
        {email && token ? (
          <ResetPasswordForm email={email} token={token} />
        ) : (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            This reset link is missing required details.
          </div>
        )}
        <Link href="/auth/forgot-password" className="focus-ring w-fit rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
          Request a new link
        </Link>
      </section>
    </main>
  );
}
