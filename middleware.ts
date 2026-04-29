import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger /admin y todas las rutas /api/admin/*
  const esRutaAdmin =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin");

  if (esRutaAdmin) {
    const cookie = req.cookies.get("admin_auth")?.value;

    // Si no tiene cookie válida y no es la ruta de login
    if (cookie !== process.env.ADMIN_SECRET && pathname !== "/api/admin/login") {
      // Si es una petición a la API, devuelve 401
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      // Si es la página /admin, redirige al login (la misma página muestra el login)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};