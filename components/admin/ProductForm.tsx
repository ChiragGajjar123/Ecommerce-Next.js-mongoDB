"use client";

import { useActionState } from "react";
import { upsertProductAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { SubmitButton } from "@/components/SubmitButton";
import { emptyActionState, type Collection, type Product } from "@/lib/types";

const inputClass =
  "focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm";

function rupees(cents?: number) {
  return cents ? (cents / 100).toFixed(2) : "";
}

export function ProductForm({ product, collections }: { product?: Product; collections: Collection[] }) {
  const [state, action] = useActionState(upsertProductAction, emptyActionState);

  return (
    <form action={action} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div>
        <h2 className="text-xl font-bold text-slate-950">{product ? "Edit product" : "Add product"}</h2>
        <p className="mt-1 text-sm text-slate-600">Images can be remote URLs or files inside public assets.</p>
      </div>
      <ActionMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Name</span>
          <input className={inputClass} name="name" defaultValue={product?.name ?? ""} required />
          {state.fieldErrors?.name ? <p className="text-sm text-red-700">{state.fieldErrors.name}</p> : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Slug</span>
          <input className={inputClass} name="slug" defaultValue={product?.slug ?? ""} placeholder="auto-generated when empty" />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Description</span>
        <textarea className={`${inputClass} min-h-32 resize-y`} name="description" defaultValue={product?.description ?? ""} required />
        {state.fieldErrors?.description ? <p className="text-sm text-red-700">{state.fieldErrors.description}</p> : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Price</span>
          <input className={inputClass} name="price" type="number" step="0.01" min="0" defaultValue={rupees(product?.priceCents)} required />
          {state.fieldErrors?.price ? <p className="text-sm text-red-700">{state.fieldErrors.price}</p> : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Compare at</span>
          <input className={inputClass} name="compareAt" type="number" step="0.01" min="0" defaultValue={rupees(product?.compareAtCents)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Stock</span>
          <input className={inputClass} name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} required />
          {state.fieldErrors?.stock ? <p className="text-sm text-red-700">{state.fieldErrors.stock}</p> : null}
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Image URLs</span>
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          name="imageUrls"
          defaultValue={product?.images.join("\n") ?? ""}
          placeholder="/products/example.svg"
        />
      </label>
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-slate-800">Collections</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <label key={collection.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input
                className="h-4 w-4 accent-teal-700"
                type="checkbox"
                name="collectionIds"
                value={collection.id}
                defaultChecked={product?.collectionIds.includes(collection.id)}
              />
              {collection.title}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Tags</span>
          <input className={inputClass} name="tags" defaultValue={product?.tags.join(", ") ?? ""} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Status</span>
          <select className={inputClass} name="status" defaultValue={product?.status ?? "draft"}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input className="h-4 w-4 accent-teal-700" type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
        Featured product
      </label>
      <SubmitButton pendingText="Saving product">{product ? "Save product" : "Create product"}</SubmitButton>
    </form>
  );
}
