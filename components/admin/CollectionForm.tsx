"use client";

import { useActionState } from "react";
import { upsertCollectionAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { emptyActionState, type Collection } from "@/lib/types";

const inputClass =
  "focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm";

export function CollectionForm({ collection }: { collection?: Collection }) {
  const [state, action] = useActionState(upsertCollectionAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="id" value={collection?.id ?? ""} />
      <div>
        <h2 className="text-xl font-bold text-slate-950">{collection ? "Edit collection" : "Add collection"}</h2>
        <p className="mt-1 text-sm text-slate-600">Use clean slugs for stable storefront routes.</p>
      </div>
      <ActionMessage state={state} />
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Title</span>
        <input className={inputClass} name="title" defaultValue={collection?.title ?? ""} required />
        {state.fieldErrors?.title ? <p className="text-sm text-red-700">{state.fieldErrors.title}</p> : null}
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Slug</span>
        <input className={inputClass} name="slug" defaultValue={collection?.slug ?? ""} placeholder="auto-generated when empty" />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Image URL</span>
        <input className={inputClass} name="imageUrl" defaultValue={collection?.imageUrl ?? ""} />
        {state.fieldErrors?.imageUrl ? <p className="text-sm text-red-700">{state.fieldErrors.imageUrl}</p> : null}
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Description</span>
        <textarea className={`${inputClass} min-h-28 resize-y`} name="description" defaultValue={collection?.description ?? ""} required />
        {state.fieldErrors?.description ? <p className="text-sm text-red-700">{state.fieldErrors.description}</p> : null}
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input className="h-4 w-4 accent-teal-700" type="checkbox" name="featured" defaultChecked={collection?.featured ?? false} />
        Featured collection
      </label>
      <SubmitButton pendingText="Saving collection">{collection ? "Save collection" : "Create collection"}</SubmitButton>
    </form>
  );
}
