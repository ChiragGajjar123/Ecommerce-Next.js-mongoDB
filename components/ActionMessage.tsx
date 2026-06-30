import type { ActionState } from "@/lib/types";

export function ActionMessage({ state }: { state: ActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`rounded-md border px-3 py-2 text-sm ${
        state.ok
          ? "border-teal-200 bg-teal-50 text-teal-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
      role="status"
      aria-live="polite"
    >
      {state.message}
    </p>
  );
}
