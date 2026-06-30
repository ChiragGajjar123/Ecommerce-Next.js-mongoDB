export type Role = "customer" | "admin";
export type ProductStatus = "active" | "draft";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  addresses: Address[];
  disabled?: boolean;
  createdAt: string;
};

export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  stock: number;
  images: string[];
  collectionIds: string[];
  collectionTitles?: string[];
  tags: string[];
  featured: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type CartCookieItem = {
  productId: string;
  quantity: number;
};

export type CartLine = {
  product: Product;
  quantity: number;
  available: boolean;
  lineTotalCents: number;
  issue?: string;
};

export type CartSummary = {
  lines: CartLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  itemCount: number;
  canCheckout: boolean;
  issues: string[];
  promoCode?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  address: Address;
  paymentMethod: "cod" | "manual";
  notes?: string;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

export const emptyActionState: ActionState = {
  ok: false,
  message: ""
};
