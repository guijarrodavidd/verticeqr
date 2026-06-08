# Romanssera · Backend (Fase 0 — Supabase)

Guía para pasar de la **demo local** a **datos reales** (persistentes, con login y multi-local).
Tiempo estimado: ~15 minutos. No hace falta saber programar.

---

## Qué vamos a montar
- Una base de datos real en la nube (PostgreSQL gestionado por Supabase).
- **Login del dueño** (cada local entra a su panel y solo ve sus datos).
- La **carta** guardará las ventas en la base de datos (ya no en el navegador).
- El **panel de contabilidad** leerá esos datos desde cualquier dispositivo.

> **Coste:** el plan gratuito de Supabase sobra para empezar (1 local).

---

## Paso 1 · Crear el proyecto Supabase
1. Entra en **https://supabase.com** → *Start your project* → regístrate (con GitHub o email).
2. *New project*:
   - **Name:** `romanssera`
   - **Database Password:** genera una y **guárdala** (la pide alguna vez).
   - **Region:** elige *West EU (Ireland)* o *Frankfurt* (más cerca = más rápido).
3. Espera ~2 min a que el proyecto se cree.

## Paso 2 · Crear las tablas
1. En el proyecto, menú izquierdo → **SQL Editor** → *New query*.
2. Abre el fichero [`schema.sql`](./schema.sql), **copia todo** y pégalo.
3. Pulsa **Run** (abajo a la derecha). Debe salir *Success*.

## Paso 3 · Crear tu usuario (login del dueño)
1. Menú izquierdo → **Authentication** → **Users** → *Add user* → *Create new user*.
2. Pon el **email** y una **contraseña** del dueño. Marca *Auto Confirm User*.
3. Copia el **User UID** que aparece (lo necesitas en el paso 4).

## Paso 4 · Vincular el local contigo
1. Vuelve a **SQL Editor** → *New query* y ejecuta (uno a uno):
   ```sql
   insert into public.locales (nombre, slug)
   values ('Romanssera Tapasseria','romanssera') returning id;
   ```
   Copia el **id** que devuelve.
2. Ejecuta (sustituye los dos valores):
   ```sql
   insert into public.local_members (local_id, user_id, rol)
   values ('<LOCAL_ID_DEL_PASO_1>', '<USER_UID_DEL_PASO_3>', 'owner');
   ```

## Paso 5 · Darme las dos claves públicas
1. Menú izquierdo → **Project Settings** (rueda dentada) → **API**.
2. Cópiame estos dos valores:
   - **Project URL** → algo como `https://xxxxxxxx.supabase.co`
   - **anon public** (la clave `anon` / *publishable*)
3. Pásamelos por el chat.

> ✅ **La clave `anon` es pública y segura** para usar en la web (está protegida por las reglas de seguridad RLS del Paso 2).
> ⛔ **NUNCA** me pases la clave **`service_role`** ni la contraseña de la base de datos: esas son secretas.

---

## Qué haré yo con esas dos claves
1. Verificaré que la base de datos y la seguridad (RLS) funcionan.
2. Conectaré el **panel de contabilidad** para que lea ventas/gastos reales.
3. Conectaré la **carta** para que cada pedido se guarde en la base de datos.
4. Montaré la **pantalla de login** del dueño.

A partir de ahí, los datos serán reales, persistentes y accesibles desde el móvil del dueño, su tablet o el ordenador del local.
