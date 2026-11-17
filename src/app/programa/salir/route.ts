import { redirect } from "next/navigation";
import { cerrarSesion } from "@/lib/programa";

export async function GET() {
  await cerrarSesion();
  redirect("/programa/aula");
}
