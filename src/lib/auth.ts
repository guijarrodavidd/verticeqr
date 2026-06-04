import crypto from "node:crypto";
import { cookies } from "next/headers";
import { findUsuarioById, type Usuario } from "./users";

// Sesión por cookie firmada con HMAC-SHA256.
// Formato cookie: "<userId>.<sigHex>" donde sig = HMAC(userId, secret).
// El secreto puede venir de process.env.SESSION_SECRET; si no, fallback.

const COOKIE_NAME = "vqr_session";
const SECRET =
  process.env.SESSION_SECRET ?? "vqr-default-session-secret-rotate-in-prod";
const MAX_AGE_S = 60 * 60 * 24 * 30;

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export function verifyToken(token: string | undefined): Usuario | null {
  if (!token) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const userId = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = sign(userId);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))
  ) {
    return null;
  }
  return findUsuarioById(userId) ?? null;
}

export async function getSession(): Promise<Usuario | null> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE_NAME)?.value);
}

export async function setSession(userId: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, createToken(userId), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
