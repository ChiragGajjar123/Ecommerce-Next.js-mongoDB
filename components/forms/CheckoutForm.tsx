"use client";

import { useActionState } from "react";
import { placeOrderAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { AddressFields } from "@/components/forms/AddressFields";
import { SubmitButton } from "@/components/SubmitButton";
import { emptyActionState, type Address } from "@/lib/types";

const inputClass =
  "focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm";

export function CheckoutForm({ defaultAddress }: { defaultAddress?: Address }) {
  const [state, action] = useActionState(placeOrderAction, emptyActionState);

  return (
    <form action={action} className="grid gap-6">
      <ActionMessage state={state} />
      <AddressFields defaults={defaultAddress} errors={state.fieldErrors} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Promo code</span>
          <input className={inputClass} name="promoCode" placeholder="WELCOME10" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Payment</span>
          <select className={inputClass} name="paymentMethod" defaultValue="cod">
            <option value="cod">Cash on delivery</option>
            <option value="manual">Manual payment</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Order notes</span>
        <textarea className={`${inputClass} min-h-28 resize-y`} name="notes" />
      </label>
      <SubmitButton pendingText="Placing order" className="w-full">
        Place order
      </SubmitButton>
    </form>
  );
}
