"use client";

import { useActionState } from "react";
import { saveAddressAction } from "@/app/actions";
import { ActionMessage } from "@/components/ActionMessage";
import { AddressFields } from "@/components/forms/AddressFields";
import { SubmitButton } from "@/components/SubmitButton";
import { emptyActionState, type Address } from "@/lib/types";

export function AddressForm({ address }: { address?: Address }) {
  const [state, action] = useActionState(saveAddressAction, emptyActionState);

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="id" value={address?.id ?? ""} />
      <ActionMessage state={state} />
      <AddressFields defaults={address} errors={state.fieldErrors} includeLabel />
      <SubmitButton pendingText="Saving address">Save address</SubmitButton>
    </form>
  );
}
