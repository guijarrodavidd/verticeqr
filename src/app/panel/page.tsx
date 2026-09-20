import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AnaliticaDashboard from "./AnaliticaDashboard";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const user = await getSession();
  if (!user) redirect("/login?redirect=/panel");
  return <AnaliticaDashboard />;
}
