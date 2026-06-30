"use client";

import { LocateFixed } from "lucide-react";
import { useMemo, useState } from "react";
import type { Address } from "@/lib/types";

const inputClass =
  "focus-ring min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm";

function mapSrc(address: Partial<Address>) {
  const query =
    address.latitude && address.longitude
      ? `${address.latitude},${address.longitude}`
      : [address.line1, address.line2, address.city, address.state, address.postalCode, address.country]
          .filter(Boolean)
          .join(", ");

  if (!query) {
    return "";
  }

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function AddressFields({
  defaults,
  errors,
  includeLabel = false
}: {
  defaults?: Partial<Address>;
  errors?: Record<string, string>;
  includeLabel?: boolean;
}) {
  const [address, setAddress] = useState<Partial<Address>>({
    country: "India",
    ...defaults
  });
  const [locationPending, setLocationPending] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const src = useMemo(() => mapSrc(address), [address]);

  function update(key: keyof Address, value: string) {
    setAddress((current) => ({
      ...current,
      [key]: value
    }));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      return;
    }

    setLocationPending(true);
    setLocationMessage("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAddress((current) => ({
          ...current,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6))
        }));
        setLocationMessage("Location added to this address.");
        setLocationPending(false);
      },
      () => {
        setLocationMessage("Location permission was not granted.");
        setLocationPending(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="grid gap-5">
      {includeLabel ? (
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Address label</span>
          <input
            className={inputClass}
            name="label"
            defaultValue={defaults?.label ?? ""}
            onChange={(event) => update("label", event.target.value)}
            required
          />
          {errors?.label ? <p className="text-sm text-red-700">{errors.label}</p> : null}
        </label>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Recipient name</span>
          <input className={inputClass} name="name" defaultValue={defaults?.name ?? ""} autoComplete="name" required />
          {errors?.name ? <p className="text-sm text-red-700">{errors.name}</p> : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Phone</span>
          <input className={inputClass} name="phone" defaultValue={defaults?.phone ?? ""} autoComplete="tel" required />
          {errors?.phone ? <p className="text-sm text-red-700">{errors.phone}</p> : null}
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Address line 1</span>
        <input
          className={inputClass}
          name="line1"
          defaultValue={defaults?.line1 ?? ""}
          autoComplete="address-line1"
          onChange={(event) => update("line1", event.target.value)}
          required
        />
        {errors?.line1 ? <p className="text-sm text-red-700">{errors.line1}</p> : null}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Address line 2</span>
        <input
          className={inputClass}
          name="line2"
          defaultValue={defaults?.line2 ?? ""}
          autoComplete="address-line2"
          onChange={(event) => update("line2", event.target.value)}
        />
        {errors?.line2 ? <p className="text-sm text-red-700">{errors.line2}</p> : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">City</span>
          <input
            className={inputClass}
            name="city"
            defaultValue={defaults?.city ?? ""}
            autoComplete="address-level2"
            onChange={(event) => update("city", event.target.value)}
            required
          />
          {errors?.city ? <p className="text-sm text-red-700">{errors.city}</p> : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">State</span>
          <input
            className={inputClass}
            name="state"
            defaultValue={defaults?.state ?? ""}
            autoComplete="address-level1"
            onChange={(event) => update("state", event.target.value)}
            required
          />
          {errors?.state ? <p className="text-sm text-red-700">{errors.state}</p> : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Postal code</span>
          <input
            className={inputClass}
            name="postalCode"
            defaultValue={defaults?.postalCode ?? ""}
            autoComplete="postal-code"
            onChange={(event) => update("postalCode", event.target.value)}
            required
          />
          {errors?.postalCode ? <p className="text-sm text-red-700">{errors.postalCode}</p> : null}
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">Country</span>
        <input
          className={inputClass}
          name="country"
          defaultValue={defaults?.country ?? "India"}
          autoComplete="country-name"
          onChange={(event) => update("country", event.target.value)}
          required
        />
        {errors?.country ? <p className="text-sm text-red-700">{errors.country}</p> : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Latitude</span>
          <input
            className={inputClass}
            name="latitude"
            defaultValue={defaults?.latitude ?? ""}
            onChange={(event) => update("latitude", event.target.value)}
            inputMode="decimal"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Longitude</span>
          <input
            className={inputClass}
            name="longitude"
            defaultValue={defaults?.longitude ?? ""}
            onChange={(event) => update("longitude", event.target.value)}
            inputMode="decimal"
          />
        </label>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locationPending}
          className="focus-ring inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          <LocateFixed className="h-4 w-4" aria-hidden="true" />
          {locationPending ? "Locating" : "Use my location"}
        </button>
        {locationMessage ? (
          <p className="text-sm text-slate-600" aria-live="polite">
            {locationMessage}
          </p>
        ) : null}
        {src ? (
          <iframe
            title="Address map"
            src={src}
            className="h-56 w-full rounded-md border border-slate-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="grid h-56 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
            The map preview appears as soon as address details are available.
          </div>
        )}
      </div>
    </div>
  );
}
