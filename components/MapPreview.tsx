import type { Address } from "@/lib/types";

function addressQuery(address: Partial<Address>) {
  return [address.line1, address.line2, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");
}

export function MapPreview({ address }: { address: Partial<Address> }) {
  const query = address.latitude && address.longitude
    ? `${address.latitude},${address.longitude}`
    : addressQuery(address);

  if (!query) {
    return (
      <div className="grid min-h-48 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
        Add an address to preview the map.
      </div>
    );
  }

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=68.1%2C6.4%2C97.4%2C35.7&layer=mapnik&marker=${encodeURIComponent(query)}`;

  return (
    <iframe
      title="Address map"
      src={src}
      className="h-56 w-full rounded-md border border-slate-200"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
