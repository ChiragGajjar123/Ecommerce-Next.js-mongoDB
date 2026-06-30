"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({ children, pendingText = "Working", className = "", disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 ${className}`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{pendingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
