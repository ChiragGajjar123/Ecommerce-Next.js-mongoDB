import "server-only";

import type { CartCookieItem, CartLine, CartSummary, Product } from "@/lib/types";

const TAX_BASIS_POINTS = 500;

const commerceEngine = {
  lineTotalCents(unitCents: number, quantity: number) {
    return Math.min(Number.MAX_SAFE_INTEGER, unitCents * quantity);
  },
  discountCents(subtotalCents: number, percentBasisPoints: number, fixedCents: number) {
    const percentDiscount = Math.round((subtotalCents * percentBasisPoints) / 10_000);
    return Math.min(subtotalCents, percentDiscount + fixedCents);
  },
  shippingCents(subtotalCents: number, itemCount: number) {
    if (itemCount === 0 || subtotalCents >= 7_500) {
      return 0;
    }
    return 499 + Math.min(8, Math.max(0, itemCount - 1)) * 75;
  },
  taxCents(taxableCents: number, basisPoints: number) {
    return Math.round((taxableCents * basisPoints) / 10_000);
  },
  canCheckout(requestedQuantity: number, stockQuantity: number) {
    return requestedQuantity > 0 && requestedQuantity <= stockQuantity;
  }
};

function promoToDiscount(promoCode?: string) {
  const code = promoCode?.trim().toUpperCase();

  if (code === "WELCOME10") {
    return { code, percentBasisPoints: 1000, fixedCents: 0 };
  }

  if (code === "CMG500") {
    return { code, percentBasisPoints: 0, fixedCents: 500 };
  }

  return { code: undefined, percentBasisPoints: 0, fixedCents: 0 };
}

export async function calculateCartSummary(
  cartItems: CartCookieItem[],
  products: Product[],
  promoCode?: string
): Promise<CartSummary> {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines: CartLine[] = [];
  const issues: string[] = [];

  for (const item of cartItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      issues.push("An item in your cart is no longer available.");
      continue;
    }

    const available =
      product.status === "active" &&
      commerceEngine.canCheckout(item.quantity, Math.max(0, product.stock));
    const lineTotalCents = commerceEngine.lineTotalCents(product.priceCents, item.quantity);

    lines.push({
      product,
      quantity: item.quantity,
      available,
      lineTotalCents,
      issue: available ? undefined : `Only ${product.stock} left in stock.`
    });

    if (!available) {
      issues.push(`${product.name} cannot be checked out at the selected quantity.`);
    }
  }

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotalCents = lines.reduce((total, line) => total + line.lineTotalCents, 0);
  const promo = promoToDiscount(promoCode);
  const discountCents = commerceEngine.discountCents(
    subtotalCents,
    promo.percentBasisPoints,
    promo.fixedCents
  );
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const shippingCents = commerceEngine.shippingCents(taxableCents, itemCount);
  const taxCents = commerceEngine.taxCents(taxableCents, TAX_BASIS_POINTS);
  const totalCents = Math.max(0, taxableCents + shippingCents + taxCents);

  return {
    lines,
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
    itemCount,
    canCheckout: lines.length > 0 && issues.length === 0,
    issues,
    promoCode: promo.code
  };
}
