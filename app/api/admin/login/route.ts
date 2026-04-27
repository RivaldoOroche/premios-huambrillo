import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_auth", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  });
  return response;
}