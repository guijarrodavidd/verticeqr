import crypto from "node:crypto";

// 3 usuarios internos del panel. Contraseña compartida (entorno cerrado).
// El hash es SHA-256(password + pepper) — pepper como constante por
// simplicidad; para producción de verdad mover a process.env.AUTH_PEPPER.

const PEPPER = "vqr-2026-pepper";

export type Usuario = {
  id: string;
  email: string;
  nombre: string;
};

export const USUARIOS: Usuario[] = [
  { id: "david", email: "david@vertice.com", nombre: "David" },
  { id: "cavani", email: "cavani@vertice.com", nombre: "Cavani" },
  { id: "west", email: "west@vertice.com", nombre: "West" },
];

// SHA-256("@Adminlocal1" + PEPPER) precomputado.
const PASSWORD_HASH =
  "d4ad9be7ea6eed2c98b9f5b86cf5845cf5edf90080d571e36322fef2d5336ee6";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + PEPPER).digest("hex");
}

export function findUsuarioByEmail(email: string): Usuario | undefined {
  const e = email.trim().toLowerCase();
  return USUARIOS.find((u) => u.email.toLowerCase() === e);
}

export function findUsuarioById(id: string): Usuario | undefined {
  return USUARIOS.find((u) => u.id === id);
}

export function verifyCredentials(email: string, password: string): Usuario | null {
  const u = findUsuarioByEmail(email);
  if (!u) return null;
  // Comparación en tiempo constante para evitar timing attacks triviales.
  const expected = Buffer.from(PASSWORD_HASH, "hex");
  const got = Buffer.from(hashPassword(password), "hex");
  if (expected.length !== got.length) return null;
  return crypto.timingSafeEqual(expected, got) ? u : null;
}
