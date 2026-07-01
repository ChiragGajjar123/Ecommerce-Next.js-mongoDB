import "server-only";

import { ObjectId, type Filter, type WithId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type {
  Address,
  Collection,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductStatus,
  Role,
  User
} from "@/lib/types";

type UserDoc = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone?: string;
  addresses?: Address[];
  disabled?: boolean;
  resetPassword?: {
    tokenHash: string;
    expiresAt: Date;
    resendAvailableAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

type CollectionDoc = {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ProductDoc = {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  stock: number;
  images: string[];
  collectionIds: ObjectId[];
  tags: string[];
  featured: boolean;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};

type OrderDoc = {
  orderNumber: string;
  userId: ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
};

function asId(value: ObjectId | string) {
  return value.toString();
}

export function toObjectId(value: string) {
  if (!ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
}

function serializeUser(doc: WithId<UserDoc>): User {
  return {
    id: asId(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    phone: doc.phone,
    addresses: doc.addresses ?? [],
    disabled: doc.disabled,
    createdAt: doc.createdAt.toISOString()
  };
}

function serializeCollection(doc: WithId<CollectionDoc>): Collection {
  return {
    id: asId(doc._id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    imageUrl: doc.imageUrl,
    featured: doc.featured,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function serializeProduct(
  doc: WithId<ProductDoc>,
  collectionTitles?: Map<string, string>
): Product {
  const collectionIds = (doc.collectionIds ?? []).map(asId);

  return {
    id: asId(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    priceCents: doc.priceCents,
    compareAtCents: doc.compareAtCents,
    stock: doc.stock,
    images: doc.images ?? [],
    collectionIds,
    collectionTitles: collectionTitles
      ? (collectionIds.map((id) => collectionTitles.get(id)).filter(Boolean) as string[])
      : undefined,
    tags: doc.tags ?? [],
    featured: doc.featured,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

function serializeOrder(doc: WithId<OrderDoc>): Order {
  return {
    id: asId(doc._id),
    orderNumber: doc.orderNumber,
    userId: asId(doc.userId),
    userEmail: doc.userEmail,
    status: doc.status,
    items: doc.items,
    address: doc.address,
    paymentMethod: doc.paymentMethod,
    notes: doc.notes,
    subtotalCents: doc.subtotalCents,
    discountCents: doc.discountCents,
    shippingCents: doc.shippingCents,
    taxCents: doc.taxCents,
    totalCents: doc.totalCents,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}

async function collectionsTitleMap(ids?: ObjectId[]) {
  const db = await getDb();
  const filter = ids?.length ? { _id: { $in: ids } } : {};
  const docs = await db.collection<CollectionDoc>("collections").find(filter).toArray();
  return new Map(docs.map((collection) => [asId(collection._id), collection.title]));
}

export async function getCollections(options: { featuredOnly?: boolean } = {}) {
  const db = await getDb();
  const filter: Filter<CollectionDoc> = options.featuredOnly ? { featured: true } : {};
  const docs = await db.collection<CollectionDoc>("collections").find(filter).sort({ title: 1 }).toArray();
  return docs.map(serializeCollection);
}

export async function getCollectionBySlug(slug: string) {
  const db = await getDb();
  const doc = await db.collection<CollectionDoc>("collections").findOne({ slug });
  return doc ? serializeCollection(doc) : null;
}

export async function getProducts(
  options: {
    query?: string;
    collectionSlug?: string;
    featuredOnly?: boolean;
    includeDrafts?: boolean;
    limit?: number;
  } = {}
) {
  const db = await getDb();
  const filter: Filter<ProductDoc> = options.includeDrafts ? {} : { status: "active" };

  if (options.featuredOnly) {
    filter.featured = true;
  }

  if (options.collectionSlug) {
    const collection = await db.collection<CollectionDoc>("collections").findOne({ slug: options.collectionSlug });
    if (!collection) {
      return [];
    }
    filter.collectionIds = collection._id;
  }

  if (options.query?.trim()) {
    filter.$text = { $search: options.query.trim() };
  }

  const cursor = db
    .collection<ProductDoc>("products")
    .find(filter)
    .sort(options.query?.trim() ? { score: { $meta: "textScore" } } : { featured: -1, createdAt: -1 });

  if (options.limit) {
    cursor.limit(options.limit);
  }

  const docs = await cursor.toArray();
  const titleMap = await collectionsTitleMap(docs.flatMap((doc) => doc.collectionIds ?? []));
  return docs.map((doc) => serializeProduct(doc, titleMap));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  const doc = await db.collection<ProductDoc>("products").findOne({ slug, status: "active" });
  if (!doc) {
    return null;
  }
  const titleMap = await collectionsTitleMap(doc.collectionIds);
  return serializeProduct(doc, titleMap);
}

export async function getProductById(id: string, includeDrafts = false) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return null;
  }

  const db = await getDb();
  const doc = await db
    .collection<ProductDoc>("products")
    .findOne(includeDrafts ? { _id: objectId } : { _id: objectId, status: "active" });
  if (!doc) {
    return null;
  }
  const titleMap = await collectionsTitleMap(doc.collectionIds);
  return serializeProduct(doc, titleMap);
}

export async function getProductsByIds(ids: string[], includeDrafts = false) {
  const objectIds = ids.map(toObjectId).filter((id): id is ObjectId => Boolean(id));
  if (objectIds.length === 0) {
    return [];
  }

  const db = await getDb();
  const filter: Filter<ProductDoc> = { _id: { $in: objectIds } };
  if (!includeDrafts) {
    filter.status = "active";
  }
  const docs = await db.collection<ProductDoc>("products").find(filter).toArray();
  const titleMap = await collectionsTitleMap(docs.flatMap((doc) => doc.collectionIds ?? []));
  return docs.map((doc) => serializeProduct(doc, titleMap));
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.collection<UserDoc>("users").findOne({ email: email.toLowerCase() });
}

export async function getUserById(id: string) {
  const objectId = toObjectId(id);
  if (!objectId) {
    return null;
  }
  const db = await getDb();
  const doc = await db.collection<UserDoc>("users").findOne({ _id: objectId });
  return doc ? serializeUser(doc) : null;
}

export async function getOrdersForUser(userId: string) {
  const objectId = toObjectId(userId);
  if (!objectId) {
    return [];
  }
  const db = await getDb();
  const docs = await db
    .collection<OrderDoc>("orders")
    .find({ userId: objectId })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(serializeOrder);
}

export async function getOrderForUser(orderId: string, userId: string) {
  const objectId = toObjectId(orderId);
  const userObjectId = toObjectId(userId);
  if (!objectId || !userObjectId) {
    return null;
  }
  const db = await getDb();
  const doc = await db.collection<OrderDoc>("orders").findOne({ _id: objectId, userId: userObjectId });
  return doc ? serializeOrder(doc) : null;
}

export async function getAdminOrders() {
  const db = await getDb();
  const docs = await db.collection<OrderDoc>("orders").find({}).sort({ createdAt: -1 }).limit(100).toArray();
  return docs.map(serializeOrder);
}

export async function getAdminUsers() {
  const db = await getDb();
  const docs = await db.collection<UserDoc>("users").find({}).sort({ createdAt: -1 }).limit(100).toArray();
  return docs.map(serializeUser);
}

export async function getAdminStats() {
  const db = await getDb();
  const [ordersCount, usersCount, productsCount, revenueAgg, pendingOrders] = await Promise.all([
    db.collection<OrderDoc>("orders").countDocuments(),
    db.collection<UserDoc>("users").countDocuments(),
    db.collection<ProductDoc>("products").countDocuments({ status: "active" }),
    db
      .collection<OrderDoc>("orders")
      .aggregate<{ total: number }>([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalCents" } } }
      ])
      .toArray(),
    db.collection<OrderDoc>("orders").countDocuments({ status: { $in: ["pending", "confirmed", "packed"] } })
  ]);

  return {
    ordersCount,
    usersCount,
    productsCount,
    pendingOrders,
    revenueCents: revenueAgg[0]?.total ?? 0
  };
}
