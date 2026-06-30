import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ForgotPasswordForm } from "@/components/forms/AuthForms";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-90px)] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid w-full max-w-md gap-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid justify-items-start gap-4">
          <Logo className="h-12 w-auto" />
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Reset password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              We will send a secure reset link if the email exists.
            </p>
          </div>
        </div>
        <ForgotPasswordForm />
        <Link href="/auth/sign-in" className="focus-ring w-fit rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
