import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import type { SessionUser } from "@/lib/types";

const SESSION_COOKIE = "cmg_session";
const encoder = new TextEncoder();

function getSecret() {
  return encoder.encode(env.sessionSecret);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSecret());
    const payload = verified.payload as Partial<SessionUser>;

    if (!payload.id || !payload.email || !payload.name || !payload.role) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.role !== "admin") {
    redirect("/");
  }
  return session;
}
