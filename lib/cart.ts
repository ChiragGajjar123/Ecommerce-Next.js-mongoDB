import "server-only";

import { cookies } from "next/headers";
import type { CartCookieItem } from "@/lib/types";

const CART_COOKIE = "cmg_cart";
const MAX_QUANTITY = 20;

function normalizeItems(items: CartCookieItem[]) {
  const merged = new Map<string, number>();

  for (const item of items) {
    if (!item.productId) {
      continue;
    }
    const quantity = Math.max(0, Math.min(MAX_QUANTITY, Math.floor(Number(item.quantity) || 0)));
    if (quantity === 0) {
      continue;
    }
    merged.set(item.productId, Math.min(MAX_QUANTITY, (merged.get(item.productId) ?? 0) + quantity));
  }

  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}

export async function getCartItems(): Promise<CartCookieItem[]> {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(CART_COOKIE)?.value;

  if (!encoded) {
    return [];
  }

  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return normalizeItems(parsed);
  } catch {
    return [];
  }
}

export async function setCartItems(items: CartCookieItem[]) {
  const cookieStore = await cookies();
  const normalized = normalizeItems(items);

  if (normalized.length === 0) {
    cookieStore.delete(CART_COOKIE);
    return;
  }

  cookieStore.set(CART_COOKIE, Buffer.from(JSON.stringify(normalized)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function cartItemCount() {
  const items = await getCartItems();
  return items.reduce((total, item) => total + item.quantity, 0);
}
