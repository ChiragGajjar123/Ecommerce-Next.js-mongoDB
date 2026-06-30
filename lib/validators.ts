import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/[A-Z]/, "Add at least one uppercase letter.")
  .regex(/[a-z]/, "Add at least one lowercase letter.")
  .regex(/[0-9]/, "Add at least one number.");

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password."),
  redirectTo: z.string().optional()
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name.").max(80, "Name is too long.").trim(),
    email: z.string().email("Enter a valid email address.").trim().toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address.").trim().toLowerCase()
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    token: z.string().min(20),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

export const addressSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(2, "Name this address.").max(40, "Label is too long.").trim(),
  name: z.string().min(2, "Enter recipient name.").max(80).trim(),
  phone: z.string().min(7, "Enter a reachable phone number.").max(20).trim(),
  line1: z.string().min(5, "Enter the street address.").max(140).trim(),
  line2: z.string().max(140).trim().optional(),
  city: z.string().min(2, "Enter city.").max(80).trim(),
  state: z.string().min(2, "Enter state.").max(80).trim(),
  postalCode: z.string().min(3, "Enter postal code.").max(16).trim(),
  country: z.string().min(2, "Enter country.").max(80).trim(),
  latitude: z.coerce.number().min(-90).max(90).optional().or(z.literal("").transform(() => undefined)),
  longitude: z.coerce.number().min(-180).max(180).optional().or(z.literal("").transform(() => undefined))
});

export const cartQuantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(20)
});

export const checkoutSchema = addressSchema.extend({
  promoCode: z.string().max(40).trim().optional(),
  notes: z.string().max(500).trim().optional(),
  paymentMethod: z.enum(["cod", "manual"]).default("cod")
});

export const collectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Enter a collection title.").max(80).trim(),
  slug: z.string().max(100).trim().optional(),
  description: z.string().min(10, "Add a short description.").max(600).trim(),
  imageUrl: z.string().url("Enter a valid image URL.").optional().or(z.literal("")),
  featured: z.boolean().default(false)
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Enter a product name.").max(100).trim(),
  slug: z.string().max(120).trim().optional(),
  description: z.string().min(20, "Add a useful product description.").max(2000).trim(),
  price: z.coerce.number().positive("Price must be greater than zero."),
  compareAt: z.coerce.number().nonnegative().optional().or(z.literal("").transform(() => undefined)),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  imageUrls: z.string().max(3000).trim(),
  collectionIds: z.array(z.string()).default([]),
  tags: z.string().max(500).trim().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["active", "draft"])
});

export const orderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"])
});

export const userRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["customer", "admin"]),
  disabled: z.boolean().default(false)
});

export function zodToFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
}
