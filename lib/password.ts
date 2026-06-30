import "server-only";

import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function createResetToken() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashResetToken(token)
  };
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
