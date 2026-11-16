import { NextResponse, type NextRequest } from "next/server";
import { cerrarSesion } from "@/lib/programa";

export async function GET(req: NextRequest) {
  await cerrarSesion();
  return NextResponse.redirect(new URL("/programa/aula", req.url));
}
