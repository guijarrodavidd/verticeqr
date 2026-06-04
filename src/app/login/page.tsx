import { redirect } from "next/navigation";
import { getSession, setSession } from "@/lib/auth";
import { verifyCredentials } from "@/lib/users";
import "./login.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acceso — VerticeQR",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  if (await getSession()) redirect("/app");
  const { error, redirect: redirectTo } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const dest = String(formData.get("redirect") ?? "/app");
    const user = verifyCredentials(email, password);
    if (!user) {
      redirect(`/login?error=invalid${dest !== "/app" ? `&redirect=${encodeURIComponent(dest)}` : ""}`);
    }
    await setSession(user.id);
    redirect(dest.startsWith("/") ? dest : "/app");
  }

  return (
    <div className="vqr-login-wrap">
      <div className="vqr-login-card">
        <div className="vqr-login-brand">
          <span style={{ color: "#a78bfa" }}>▲</span> VerticeQR
        </div>
        <h1 className="vqr-login-title">Acceso interno</h1>
        <p className="vqr-login-sub">
          Solo personas autorizadas. Si no tienes acceso, contacta con David.
        </p>

        {error === "invalid" && (
          <div className="vqr-login-error">
            Email o contraseña incorrectos.
          </div>
        )}

        <form action={login} className="vqr-login-form">
          <input type="hidden" name="redirect" value={redirectTo ?? "/app"} />
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              autoFocus
              placeholder="tu@vertice.com"
            />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="vqr-login-btn">
            Entrar →
          </button>
        </form>

        <a href="/" className="vqr-login-back">← Volver a la web</a>
      </div>
    </div>
  );
}
