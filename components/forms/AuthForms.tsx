"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction, registerAction, resetPasswordAction, signInAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { emptyActionState } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="text-sm text-red-700">{message}</p>;
}

const inputClass =
  "focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm";

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState(signInAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
      <ActionMessage state={state} />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Email</span>
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Password</span>
        <input className={inputClass} name="password" type="password" autoComplete="current-password" required />
        <FieldError message={state.fieldErrors?.password} />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/auth/forgot-password" className="focus-ring rounded-sm text-sm font-semibold text-teal-800 hover:text-teal-950">
          Forgot password?
        </Link>
        <SubmitButton pendingText="Signing in">Sign in</SubmitButton>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Full name</span>
        <input className={inputClass} name="name" type="text" autoComplete="name" required />
        <FieldError message={state.fieldErrors?.name} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Email</span>
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Password</span>
          <input className={inputClass} name="password" type="password" autoComplete="new-password" required />
          <FieldError message={state.fieldErrors?.password} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Verify password</span>
          <input className={inputClass} name="confirmPassword" type="password" autoComplete="new-password" required />
          <FieldError message={state.fieldErrors?.confirmPassword} />
        </label>
      </div>
      <SubmitButton pendingText="Creating account">Create account</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4">
      <ActionMessage state={state} />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Email</span>
        <input className={inputClass} name="email" type="email" autoComplete="email" required />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      <SubmitButton pendingText="Sending reset link">Send reset link</SubmitButton>
      <p className="text-sm leading-6 text-slate-600">
        For security, reset emails can only be resent every two minutes.
      </p>
    </form>
  );
}

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const [state, action] = useActionState(resetPasswordAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="token" value={token} />
      <ActionMessage state={state} />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">New password</span>
        <input className={inputClass} name="password" type="password" autoComplete="new-password" required />
        <FieldError message={state.fieldErrors?.password} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Verify password</span>
        <input className={inputClass} name="confirmPassword" type="password" autoComplete="new-password" required />
        <FieldError message={state.fieldErrors?.confirmPassword} />
      </label>
      <SubmitButton pendingText="Updating password">Update password</SubmitButton>
    </form>
  );
}
