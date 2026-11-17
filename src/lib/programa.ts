// Solo SERVIDOR. Alumnos del programa Director con Claude: alta, enlace
// personal de entrada, sesión, progreso, su punto de partida y la nota de
// Héctor con su hoja de ruta.
//
// Sin DB_HOST y fuera de producción, guarda en un JSON de la carpeta temporal
// para poder probar el aula en local. En producción siempre va a MySQL.

import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { cookies } from "next/headers";
import { getPool } from "./db";
import { hoyMadrid, type Plan } from "./programa-curriculo";

export type Alumno = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  hotel: string | null;
  plan: Plan;
  fecha_alta: string; // AAAA-MM-DD
  nota: string | null;
  punto_partida: Record<string, string> | null;
  // La auditoría escrita de la Implantación con Héctor.
  auditoria: Record<string, string> | null;
  ultimo_acceso: string | null;
  hechas: number;
};

type Fila = Omit<Alumno, "punto_partida" | "auditoria" | "hechas"> & {
  punto_partida: string | null;
  auditoria?: string | null;
  token_hash: string;
  clave_hash?: string | null;
};

const COOKIE = "dc_alumno";
const SECRETO = process.env.PROGRAMA_SECRET ?? process.env.SESSION_SECRET ?? "dc-programa-secreto-cambiar-en-prod";
const DURACION_S = 60 * 60 * 24 * 365;

const enLocal = !process.env.DB_HOST && process.env.NODE_ENV !== "production";

// ---------- Enlaces y sesión ----------

const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
const firmar = (id: number) => crypto.createHmac("sha256", SECRETO).update(`alumno:${id}`).digest("hex");
const nuevoToken = () => crypto.randomBytes(24).toString("base64url");

// ---------- Contraseña ----------
// Fácil de dictar y de teclear en el móvil: dos palabras sin tildes y cuatro
// cifras, en minúsculas (brisa-faro-4827). Se compara siempre en minúsculas y
// sin espacios, para que la mayúscula automática del móvil no la rompa.
const PALABRAS = [
  "playa", "luna", "brisa", "ronda", "llave", "suite", "terraza", "jardin", "faro", "costa",
  "isla", "palma", "cielo", "norte", "bahia", "duna", "coral", "olivo", "vela", "puerto",
];
const azar = (n: number) => crypto.randomInt(n);
const nuevaClave = () =>
  `${PALABRAS[azar(PALABRAS.length)]}-${PALABRAS[azar(PALABRAS.length)]}-${String(azar(10000)).padStart(4, "0")}`;
const limpiarClave = (clave: string) => clave.trim().toLowerCase().split(/\s+/).join("");

function cifrarClave(clave: string): string {
  const sal = crypto.randomBytes(16);
  const h = crypto.scryptSync(limpiarClave(clave), sal, 32);
  return `s1$${sal.toString("hex")}$${h.toString("hex")}`;
}

function claveCorrecta(clave: string, guardada: string | null | undefined): boolean {
  if (!guardada) return false;
  const [v, salHex, hHex] = guardada.split("$");
  if (v !== "s1" || !salHex || !hHex) return false;
  const esperada = Buffer.from(hHex, "hex");
  const h = crypto.scryptSync(limpiarClave(clave), Buffer.from(salHex, "hex"), esperada.length);
  return crypto.timingSafeEqual(h, esperada);
}

export async function alumnoActual(): Promise<Alumno | null> {
  const valor = (await cookies()).get(COOKIE)?.value;
  if (!valor) return null;
  const [idTexto, firma] = valor.split(".");
  const id = Number(idTexto);
  if (!id || !firma) return null;
  const esperada = firmar(id);
  if (firma.length !== esperada.length || !crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(esperada))) return null;
  return alumnoPorId(id);
}

export async function abrirSesion(id: number) {
  (await cookies()).set(COOKIE, `${id}.${firmar(id)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/programa",
    maxAge: DURACION_S,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete({ name: COOKIE, path: "/programa" });
}

// ---------- Datos ----------

const leerJson = (texto: string | null | undefined): Record<string, string> | null => {
  try {
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
};

function aAlumno(f: Fila, hechas = 0): Alumno {
  const punto = leerJson(f.punto_partida);
  return {
    id: Number(f.id),
    nombre: f.nombre,
    email: f.email,
    telefono: f.telefono,
    hotel: f.hotel,
    plan: f.plan === "hotel" ? "hotel" : "director",
    fecha_alta: f.fecha_alta,
    nota: f.nota,
    punto_partida: punto,
    auditoria: leerJson(f.auditoria),
    ultimo_acceso: f.ultimo_acceso,
    hechas,
  };
}

// --- Almacén de prueba (solo en local) ---

type Local = { alumnos: Fila[]; progreso: { alumno_id: number; leccion: string }[] };
const FICHERO = path.join(os.tmpdir(), "programa-dev.json");

async function leerLocal(): Promise<Local> {
  try {
    return JSON.parse(await fs.readFile(FICHERO, "utf8"));
  } catch {
    return { alumnos: [], progreso: [] };
  }
}
const guardarLocal = (d: Local) => fs.writeFile(FICHERO, JSON.stringify(d, null, 2));

// --- MySQL ---

let tablas = false;
async function asegurarTablas() {
  if (tablas) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS programa_alumnos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefono VARCHAR(30),
      hotel VARCHAR(150),
      plan VARCHAR(20) NOT NULL DEFAULT 'director',
      fecha_alta DATE NOT NULL,
      token_hash CHAR(64) NOT NULL,
      nota TEXT,
      punto_partida TEXT,
      auditoria MEDIUMTEXT,
      ultimo_acceso TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_programa_token (token_hash),
      INDEX idx_programa_email (email)
    ) ENGINE=InnoDB
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS programa_progreso (
      alumno_id INT NOT NULL,
      leccion VARCHAR(40) NOT NULL,
      hecho_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (alumno_id, leccion)
    ) ENGINE=InnoDB
  `);
  // Las tablas creadas antes de la auditoría de la implantación no tienen su columna.
  try {
    await pool.query(`ALTER TABLE programa_alumnos ADD COLUMN auditoria MEDIUMTEXT`);
  } catch {
    // Ya existe.
  }
  // Y las de antes del acceso con correo y contraseña, la suya.
  try {
    await pool.query(`ALTER TABLE programa_alumnos ADD COLUMN clave_hash VARCHAR(200) NULL`);
  } catch {
    // Ya existe.
  }
  tablas = true;
}

const COLUMNAS = `id, nombre, email, telefono, hotel, plan, DATE_FORMAT(fecha_alta, '%Y-%m-%d') AS fecha_alta,
  token_hash, nota, punto_partida, auditoria, DATE_FORMAT(ultimo_acceso, '%Y-%m-%d %H:%i') AS ultimo_acceso`;

export async function alumnoPorId(id: number): Promise<Alumno | null> {
  if (enLocal) {
    const f = (await leerLocal()).alumnos.find((a) => a.id === id);
    return f ? aAlumno(f) : null;
  }
  await asegurarTablas();
  const [rows] = await getPool().query(`SELECT ${COLUMNAS} FROM programa_alumnos WHERE id = ?`, [id]);
  const f = (rows as Fila[])[0];
  return f ? aAlumno(f) : null;
}

export async function alumnoPorToken(token: string): Promise<Alumno | null> {
  if (!token || token.length < 20) return null;
  const h = hash(token);
  if (enLocal) {
    const f = (await leerLocal()).alumnos.find((a) => a.token_hash === h);
    return f ? aAlumno(f) : null;
  }
  await asegurarTablas();
  const [rows] = await getPool().query(`SELECT ${COLUMNAS} FROM programa_alumnos WHERE token_hash = ?`, [h]);
  const f = (rows as Fila[])[0];
  return f ? aAlumno(f) : null;
}

export async function listarAlumnos(): Promise<Alumno[]> {
  if (enLocal) {
    const d = await leerLocal();
    return d.alumnos
      .map((f) => aAlumno(f, d.progreso.filter((p) => p.alumno_id === f.id && p.leccion.startsWith("dia-")).length))
      .sort((a, b) => b.fecha_alta.localeCompare(a.fecha_alta));
  }
  await asegurarTablas();
  const [rows] = await getPool().query(
    `SELECT ${COLUMNAS},
       (SELECT COUNT(*) FROM programa_progreso p WHERE p.alumno_id = a.id AND p.leccion LIKE 'dia-%') AS hechas
     FROM programa_alumnos a ORDER BY fecha_alta DESC, id DESC`,
  );
  return (rows as (Fila & { hechas: number })[]).map((f) => aAlumno(f, Number(f.hechas)));
}

export async function crearAlumno(a: {
  nombre: string;
  email: string;
  telefono: string | null;
  hotel: string | null;
  plan: Plan;
  fecha_alta: string;
}): Promise<{ id: number; token: string; clave: string }> {
  const token = nuevoToken();
  const clave = nuevaClave();
  const fila = {
    nombre: a.nombre.trim().slice(0, 150),
    email: a.email.trim().toLowerCase().slice(0, 150),
    telefono: a.telefono?.trim().slice(0, 30) || null,
    hotel: a.hotel?.trim().slice(0, 150) || null,
    plan: a.plan,
    fecha_alta: a.fecha_alta,
    token_hash: hash(token),
    clave_hash: cifrarClave(clave),
  };
  if (enLocal) {
    const d = await leerLocal();
    const id = Math.max(0, ...d.alumnos.map((x) => x.id)) + 1;
    d.alumnos.push({ id, ...fila, nota: null, punto_partida: null, auditoria: null, ultimo_acceso: null });
    await guardarLocal(d);
    return { id, token, clave };
  }
  await asegurarTablas();
  const [res] = await getPool().query(
    `INSERT INTO programa_alumnos (nombre, email, telefono, hotel, plan, fecha_alta, token_hash, clave_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [fila.nombre, fila.email, fila.telefono, fila.hotel, fila.plan, fila.fecha_alta, fila.token_hash, fila.clave_hash],
  );
  return { id: (res as { insertId: number }).insertId, token, clave };
}

// Una contraseña nueva deja sin valor la anterior.
export async function ponerClaveNueva(id: number): Promise<string> {
  const clave = nuevaClave();
  const h = cifrarClave(clave);
  if (enLocal) {
    const d = await leerLocal();
    const f = d.alumnos.find((x) => x.id === id);
    if (f) f.clave_hash = h;
    await guardarLocal(d);
    return clave;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET clave_hash = ? WHERE id = ?`, [h, id]);
  return clave;
}

// Entrada con correo y contraseña. Si hay dos fichas con el mismo correo,
// vale la que tenga esa contraseña.
export async function alumnoPorCorreoYClave(email: string, clave: string): Promise<Alumno | null> {
  const e = email.trim().toLowerCase();
  if (!e || !clave.trim()) return null;
  let filas: Fila[];
  if (enLocal) {
    filas = (await leerLocal()).alumnos.filter((a) => a.email === e);
  } else {
    await asegurarTablas();
    const [rows] = await getPool().query(
      `SELECT ${COLUMNAS}, clave_hash FROM programa_alumnos WHERE email = ? ORDER BY id DESC`,
      [e],
    );
    filas = rows as Fila[];
  }
  const f = filas.find((x) => claveCorrecta(clave, x.clave_hash));
  return f ? aAlumno(f) : null;
}

// Un enlace nuevo deja sin valor el anterior.
export async function nuevoEnlace(id: number): Promise<string> {
  const token = nuevoToken();
  if (enLocal) {
    const d = await leerLocal();
    const f = d.alumnos.find((x) => x.id === id);
    if (f) f.token_hash = hash(token);
    await guardarLocal(d);
    return token;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET token_hash = ? WHERE id = ?`, [hash(token), id]);
  return token;
}

export async function guardarNota(id: number, nota: string) {
  const valor = nota.trim().slice(0, 4000) || null;
  if (enLocal) {
    const d = await leerLocal();
    const f = d.alumnos.find((x) => x.id === id);
    if (f) f.nota = valor;
    await guardarLocal(d);
    return;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET nota = ? WHERE id = ?`, [valor, id]);
}

// Las respuestas de «Tu punto de partida» se guardan en el alumno con ese email.
export async function guardarRespuestasDelAlumno(email: string, respuestas: Record<string, string>) {
  const e = email.trim().toLowerCase();
  const valor = JSON.stringify(respuestas).slice(0, 6000);
  if (enLocal) {
    const d = await leerLocal();
    for (const f of d.alumnos) if (f.email === e) f.punto_partida = valor;
    await guardarLocal(d);
    return;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET punto_partida = ? WHERE email = ?`, [valor, e]);
}

// La auditoría escrita de la implantación, en el alumno con ese email. Es larga,
// por eso va en su propia columna y sin el recorte de la del programa de 21 días.
export async function guardarAuditoriaDelAlumno(email: string, respuestas: Record<string, string>) {
  const e = email.trim().toLowerCase();
  const valor = JSON.stringify(respuestas);
  if (enLocal) {
    const d = await leerLocal();
    for (const f of d.alumnos) if (f.email === e) f.auditoria = valor;
    await guardarLocal(d);
    return;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET auditoria = ? WHERE email = ?`, [valor, e]);
}

// El programa cuenta desde que el alumno entra por primera vez con su enlace:
// ese día pasa a ser su día 0 y desde ahí se le abren las semanas.
export async function empezarSiEsLaPrimeraVez(alumno: Alumno) {
  if (alumno.ultimo_acceso) return;
  const hoy = hoyMadrid();
  if (enLocal) {
    const d = await leerLocal();
    const f = d.alumnos.find((x) => x.id === alumno.id);
    if (f) f.fecha_alta = hoy;
    await guardarLocal(d);
    return;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET fecha_alta = ? WHERE id = ? AND ultimo_acceso IS NULL`, [hoy, alumno.id]);
}

export async function apuntarAcceso(id: number) {
  if (enLocal) {
    const d = await leerLocal();
    const f = d.alumnos.find((x) => x.id === id);
    if (f) f.ultimo_acceso = new Date().toISOString().slice(0, 16).replace("T", " ");
    await guardarLocal(d);
    return;
  }
  await asegurarTablas();
  await getPool().query(`UPDATE programa_alumnos SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
}

// ---------- Progreso ----------

export async function leccionesHechas(id: number): Promise<Set<string>> {
  if (enLocal) {
    const d = await leerLocal();
    return new Set(d.progreso.filter((p) => p.alumno_id === id).map((p) => p.leccion));
  }
  await asegurarTablas();
  const [rows] = await getPool().query(`SELECT leccion FROM programa_progreso WHERE alumno_id = ?`, [id]);
  return new Set((rows as { leccion: string }[]).map((r) => r.leccion));
}

// Lo hecho por el alumno. La auditoría cuenta como hecha en cuanto envía su punto de partida.
export async function progresoDe(alumno: Alumno): Promise<Set<string>> {
  const hechas = await leccionesHechas(alumno.id);
  if (alumno.auditoria) hechas.add("auditoria");
  return hechas;
}

export async function marcarLeccion(id: number, leccion: string, hecha: boolean) {
  if (enLocal) {
    const d = await leerLocal();
    d.progreso = d.progreso.filter((p) => !(p.alumno_id === id && p.leccion === leccion));
    if (hecha) d.progreso.push({ alumno_id: id, leccion });
    await guardarLocal(d);
    return;
  }
  await asegurarTablas();
  if (hecha) {
    await getPool().query(`INSERT IGNORE INTO programa_progreso (alumno_id, leccion) VALUES (?, ?)`, [id, leccion]);
  } else {
    await getPool().query(`DELETE FROM programa_progreso WHERE alumno_id = ? AND leccion = ?`, [id, leccion]);
  }
}
