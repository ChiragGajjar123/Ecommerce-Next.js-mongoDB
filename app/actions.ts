"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes, randomUUID } from "node:crypto";
import { getCartItems, setCartItems } from "@/lib/cart";
import { getUserByEmail, getProductById, getProductsByIds, toObjectId } from "@/lib/data";
import { env } from "@/lib/env";
import { getDb } from "@/lib/mongodb";
import { createResetToken, hashPassword, hashResetToken, verifyPassword } from "@/lib/password";
import { calculateCartSummary } from "@/lib/pricing";
import { createSession, destroySession, requireAdmin, requireUser } from "@/lib/session";
import { slugify } from "@/lib/slug";
import type { ActionState, Address, OrderItem, OrderStatus, ProductStatus, Role } from "@/lib/types";
import {
  addressSchema,
  cartQuantitySchema,
  checkoutSchema,
  collectionSchema,
  forgotPasswordSchema,
  orderStatusSchema,
  productSchema,
  registerSchema,
  resetPasswordSchema,
  signInSchema,
  userRoleSchema,
  zodToFieldErrors
} from "@/lib/validators";
import { sendPasswordResetEmail } from "@/lib/mail";

const genericResetMessage =
  "If an account exists for that email, a reset link will be sent shortly.";

function fail(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { ok: false, message, fieldErrors };
}

function success(message: string): ActionState {
  return { ok: true, message };
}

function safeRedirect(value?: string | null) {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function centsFromRupees(value: number | undefined) {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }
  return Math.round(value * 100);
}

function imageList(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function tagList(value?: string) {
  return (value ?? "")
    .split(/[\n,]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

async function requestOrigin() {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = forwardedHost ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  return env.appUrl;
}

export async function registerAction(_prevState: ActionState, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword")
  });

  if (!parsed.success) {
    return fail("Check the highlighted fields.", zodToFieldErrors(parsed.error));
  }

  let redirectTo = "/";

  try {
    const db = await getDb();
    const existing = await getUserByEmail(parsed.data.email);
    if (existing) {
      return fail("An account with this email already exists.", { email: "Email is already registered." });
    }

    const now = new Date();
    const result = await db.collection("users").insertOne({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      role: "customer" satisfies Role,
      addresses: [],
      createdAt: now,
      updatedAt: now
    });

    await createSession({
      id: result.insertedId.toString(),
      name: parsed.data.name,
      email: parsed.data.email,
      role: "customer"
    });
  } catch {
    return fail("We could not create the account right now. Please try again.");
  }

  redirect(redirectTo);
}

export async function signInAction(_prevState: ActionState, formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    redirectTo: getString(formData, "redirectTo")
  });

  if (!parsed.success) {
    return fail("Check the highlighted fields.", zodToFieldErrors(parsed.error));
  }

  let redirectTo = safeRedirect(parsed.data.redirectTo);

  try {
    const user = await getUserByEmail(parsed.data.email);
    if (!user || user.disabled) {
      return fail("Email or password is incorrect.");
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return fail("Email or password is incorrect.");
    }

    await createSession({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch {
    return fail("Sign in is unavailable right now. Please try again.");
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  await destroySession();
  redirect("/");
}

export async function forgotPasswordAction(_prevState: ActionState, formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: getString(formData, "email")
  });

  if (!parsed.success) {
    return fail("Enter the email on your account.", zodToFieldErrors(parsed.error));
  }

  try {
    const user = await getUserByEmail(parsed.data.email);
    if (!user || user.disabled) {
      return success(genericResetMessage);
    }

    const now = new Date();
    const resendAvailableAt = user.resetPassword?.resendAvailableAt;
    if (resendAvailableAt && resendAvailableAt > now) {
      const waitSeconds = Math.ceil((resendAvailableAt.getTime() - now.getTime()) / 1000);
      return success(`A reset link was already requested. Please wait ${waitSeconds} seconds before resending.`);
    }

    const { token, tokenHash } = createResetToken();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);
    const nextResendAt = new Date(now.getTime() + 2 * 60 * 1000);

    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          resetPassword: {
            tokenHash,
            expiresAt,
            resendAvailableAt: nextResendAt
          },
          updatedAt: now
        }
      }
    );

    const origin = await requestOrigin();
    const resetUrl = `${origin}/auth/reset-password?email=${encodeURIComponent(user.email)}&token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch {
    return fail("We could not send the reset email right now. Please try again.");
  }

  return success(genericResetMessage);
}

export async function resetPasswordAction(_prevState: ActionState, formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    email: getString(formData, "email"),
    token: getString(formData, "token"),
    password: getString(formData, "password"),
    confirmPassword: getString(formData, "confirmPassword")
  });

  if (!parsed.success) {
    return fail("Check the highlighted fields.", zodToFieldErrors(parsed.error));
  }

  let redirectTo = "/account";

  try {
    const user = await getUserByEmail(parsed.data.email);
    const reset = user?.resetPassword;
    const now = new Date();

    if (!user || !reset || reset.expiresAt < now || reset.tokenHash !== hashResetToken(parsed.data.token)) {
      return fail("This reset link is invalid or expired. Request a new one.");
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const db = await getDb();
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { passwordHash, updatedAt: now },
        $unset: { resetPassword: "" }
      }
    );

    await createSession({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch {
    return fail("We could not reset your password right now. Please try again.");
  }

  redirect(redirectTo);
}

export async function addToCartAction(formData: FormData) {
  const parsed = cartQuantitySchema.safeParse({
    productId: getString(formData, "productId"),
    quantity: getString(formData, "quantity") || "1"
  });

  if (!parsed.success) {
    redirect("/cart");
  }

  const product = await getProductById(parsed.data.productId);
  if (!product || product.stock < 1) {
    redirect("/cart");
  }

  const current = await getCartItems();
  const existing = current.find((item) => item.productId === parsed.data.productId);
  const quantity = Math.min(product.stock, (existing?.quantity ?? 0) + parsed.data.quantity);
  const next = current.filter((item) => item.productId !== parsed.data.productId);
  next.push({ productId: parsed.data.productId, quantity });

  await setCartItems(next);
  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const parsed = cartQuantitySchema.safeParse({
    productId: getString(formData, "productId"),
    quantity: getString(formData, "quantity")
  });

  if (!parsed.success) {
    redirect("/cart");
  }

  const current = await getCartItems();
  const next =
    parsed.data.quantity === 0
      ? current.filter((item) => item.productId !== parsed.data.productId)
      : current.map((item) =>
          item.productId === parsed.data.productId ? { ...item, quantity: parsed.data.quantity } : item
        );

  await setCartItems(next);
  revalidatePath("/cart");
  redirect("/cart");
}

export async function clearCartAction() {
  await setCartItems([]);
  revalidatePath("/cart");
  redirect("/cart");
}

export async function saveAddressAction(_prevState: ActionState, formData: FormData) {
  const session = await requireUser();
  const parsed = addressSchema.safeParse({
    id: getString(formData, "id"),
    label: getString(formData, "label"),
    name: getString(formData, "name"),
    phone: getString(formData, "phone"),
    line1: getString(formData, "line1"),
    line2: getString(formData, "line2"),
    city: getString(formData, "city"),
    state: getString(formData, "state"),
    postalCode: getString(formData, "postalCode"),
    country: getString(formData, "country") || "India",
    latitude: getString(formData, "latitude"),
    longitude: getString(formData, "longitude")
  });

  if (!parsed.success) {
    return fail("Check the highlighted address fields.", zodToFieldErrors(parsed.error));
  }

  const userId = toObjectId(session.id);
  if (!userId) {
    return fail("Your session is invalid. Please sign in again.");
  }

  const address: Address = {
    ...parsed.data,
    id: parsed.data.id || randomUUID()
  };

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne<{ addresses?: Address[] }>({ _id: userId });
    const addresses = user?.addresses ?? [];
    const nextAddresses = addresses.some((item) => item.id === address.id)
      ? addresses.map((item) => (item.id === address.id ? address : item))
      : [...addresses, address];

    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          addresses: nextAddresses,
          updatedAt: new Date()
        }
      }
    );
  } catch {
    return fail("We could not save the address right now.");
  }

  revalidatePath("/account");
  return success("Address saved.");
}

export async function placeOrderAction(_prevState: ActionState, formData: FormData) {
  const session = await requireUser();
  const parsed = checkoutSchema.safeParse({
    label: "Checkout",
    name: getString(formData, "name"),
    phone: getString(formData, "phone"),
    line1: getString(formData, "line1"),
    line2: getString(formData, "line2"),
    city: getString(formData, "city"),
    state: getString(formData, "state"),
    postalCode: getString(formData, "postalCode"),
    country: getString(formData, "country") || "India",
    latitude: getString(formData, "latitude"),
    longitude: getString(formData, "longitude"),
    promoCode: getString(formData, "promoCode"),
    notes: getString(formData, "notes"),
    paymentMethod: getString(formData, "paymentMethod") || "cod"
  });

  if (!parsed.success) {
    return fail("Check the highlighted checkout fields.", zodToFieldErrors(parsed.error));
  }

  const cartItems = await getCartItems();
  const products = await getProductsByIds(cartItems.map((item) => item.productId));
  const summary = await calculateCartSummary(cartItems, products, parsed.data.promoCode);

  if (!summary.canCheckout) {
    return fail(summary.issues[0] ?? "Review your cart before checkout.");
  }

  const userId = toObjectId(session.id);
  if (!userId) {
    return fail("Your session is invalid. Please sign in again.");
  }

  const address: Address = {
    id: randomUUID(),
    label: "Checkout",
    name: parsed.data.name,
    phone: parsed.data.phone,
    line1: parsed.data.line1,
    line2: parsed.data.line2,
    city: parsed.data.city,
    state: parsed.data.state,
    postalCode: parsed.data.postalCode,
    country: parsed.data.country,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude
  };

  const orderItems: OrderItem[] = summary.lines.map((line) => ({
    productId: line.product.id,
    name: line.product.name,
    slug: line.product.slug,
    image: line.product.images[0],
    unitPriceCents: line.product.priceCents,
    quantity: line.quantity,
    lineTotalCents: line.lineTotalCents
  }));

  let orderId = "";

  try {
    const db = await getDb();
    const now = new Date();
    const appliedStock: { id: ObjectId; quantity: number }[] = [];

    for (const line of summary.lines) {
      const productId = toObjectId(line.product.id);
      if (!productId) {
        throw new Error("Invalid product id");
      }

      const update = await db.collection("products").updateOne(
        { _id: productId, status: "active" satisfies ProductStatus, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity }, $set: { updatedAt: now } }
      );

      if (update.modifiedCount !== 1) {
        for (const rollback of appliedStock) {
          await db
            .collection("products")
            .updateOne({ _id: rollback.id }, { $inc: { stock: rollback.quantity }, $set: { updatedAt: now } });
        }
        return fail(`${line.product.name} just changed stock. Please review your cart.`);
      }

      appliedStock.push({ id: productId, quantity: line.quantity });
    }

    try {
      const result = await db.collection("orders").insertOne({
        orderNumber: `CMG-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`,
        userId,
        userEmail: session.email,
        status: "pending" satisfies OrderStatus,
        items: orderItems,
        address,
        paymentMethod: parsed.data.paymentMethod,
        notes: parsed.data.notes,
        subtotalCents: summary.subtotalCents,
        discountCents: summary.discountCents,
        shippingCents: summary.shippingCents,
        taxCents: summary.taxCents,
        totalCents: summary.totalCents,
        createdAt: now,
        updatedAt: now
      });
      orderId = result.insertedId.toString();
    } catch (error) {
      for (const rollback of appliedStock) {
        await db
          .collection("products")
          .updateOne({ _id: rollback.id }, { $inc: { stock: rollback.quantity }, $set: { updatedAt: now } });
      }
      throw error;
    }
  } catch {
    return fail("We could not place the order right now. Please try again.");
  }

  await setCartItems([]);
  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect(`/orders/${orderId}`);
}

export async function upsertCollectionAction(_prevState: ActionState, formData: FormData) {
  await requireAdmin();
  const parsed = collectionSchema.safeParse({
    id: getString(formData, "id"),
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    description: getString(formData, "description"),
    imageUrl: getString(formData, "imageUrl"),
    featured: formData.get("featured") === "on"
  });

  if (!parsed.success) {
    return fail("Check the highlighted collection fields.", zodToFieldErrors(parsed.error));
  }

  let redirectTo = "/admin/collections";

  try {
    const db = await getDb();
    const now = new Date();
    const slug = slugify(parsed.data.slug || parsed.data.title);
    const payload = {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl || undefined,
      featured: parsed.data.featured,
      updatedAt: now
    };

    const id = parsed.data.id ? toObjectId(parsed.data.id) : null;
    if (id) {
      await db.collection("collections").updateOne({ _id: id }, { $set: payload });
    } else {
      await db.collection("collections").insertOne({ ...payload, createdAt: now });
    }
  } catch {
    return fail("Collection could not be saved. Check for duplicate slugs.");
  }

  revalidatePath("/");
  revalidatePath("/collections");
  redirect(redirectTo);
}

export async function deleteCollectionAction(formData: FormData) {
  await requireAdmin();
  const id = toObjectId(getString(formData, "id"));
  if (id) {
    const db = await getDb();
    await db.collection("collections").deleteOne({ _id: id });
    await db.collection("products").updateMany({}, { $pull: { collectionIds: id } as any });
  }
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}

export async function upsertProductAction(_prevState: ActionState, formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    id: getString(formData, "id"),
    name: getString(formData, "name"),
    slug: getString(formData, "slug"),
    description: getString(formData, "description"),
    price: getString(formData, "price"),
    compareAt: getString(formData, "compareAt"),
    stock: getString(formData, "stock"),
    imageUrls: getString(formData, "imageUrls"),
    collectionIds: formData.getAll("collectionIds").map(String),
    tags: getString(formData, "tags"),
    featured: formData.get("featured") === "on",
    status: getString(formData, "status") || "draft"
  });

  if (!parsed.success) {
    return fail("Check the highlighted product fields.", zodToFieldErrors(parsed.error));
  }

  let redirectTo = "/admin/products";

  try {
    const db = await getDb();
    const now = new Date();
    const slug = slugify(parsed.data.slug || parsed.data.name);
    const collectionIds = parsed.data.collectionIds
      .map(toObjectId)
      .filter((id): id is ObjectId => Boolean(id));
    const payload = {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      priceCents: centsFromRupees(parsed.data.price) ?? 0,
      compareAtCents: centsFromRupees(parsed.data.compareAt),
      stock: parsed.data.stock,
      images: imageList(parsed.data.imageUrls),
      collectionIds,
      tags: tagList(parsed.data.tags),
      featured: parsed.data.featured,
      status: parsed.data.status,
      updatedAt: now
    };

    const id = parsed.data.id ? toObjectId(parsed.data.id) : null;
    if (id) {
      await db.collection("products").updateOne({ _id: id }, { $set: payload });
    } else {
      await db.collection("products").insertOne({ ...payload, createdAt: now });
    }
  } catch {
    return fail("Product could not be saved. Check for duplicate slugs or invalid fields.");
  }

  revalidatePath("/");
  revalidatePath("/products");
  redirect(redirectTo);
}

export async function archiveProductAction(formData: FormData) {
  await requireAdmin();
  const id = toObjectId(getString(formData, "id"));
  if (id) {
    const db = await getDb();
    await db.collection("products").updateOne(
      { _id: id },
      {
        $set: {
          status: "draft" satisfies ProductStatus,
          updatedAt: new Date()
        }
      }
    );
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse({
    orderId: getString(formData, "orderId"),
    status: getString(formData, "status")
  });

  if (parsed.success) {
    const orderId = toObjectId(parsed.data.orderId);
    if (orderId) {
      const db = await getDb();
      await db.collection("orders").updateOne(
        { _id: orderId },
        {
          $set: {
            status: parsed.data.status,
            updatedAt: new Date()
          }
        }
      );
    }
  }

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function updateUserRoleAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = userRoleSchema.safeParse({
    userId: getString(formData, "userId"),
    role: getString(formData, "role"),
    disabled: formData.get("disabled") === "on"
  });

  if (parsed.success && parsed.data.userId !== session.id) {
    const userId = toObjectId(parsed.data.userId);
    if (userId) {
      const db = await getDb();
      await db.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            role: parsed.data.role,
            disabled: parsed.data.disabled,
            updatedAt: new Date()
          }
        }
      );
    }
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
