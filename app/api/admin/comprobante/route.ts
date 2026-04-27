import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin_auth")?.value;
  if (cookie !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Falta path" }, { status: 400 });

  const { data } = await supabaseAdmin.storage
    .from("comprobantes")
    .createSignedUrl(path, 60);

  return NextResponse.json({ url: data?.signedUrl });
}