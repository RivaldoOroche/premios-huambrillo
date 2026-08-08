import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function verificarAdmin(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const fd = await req.formData();
  const file = fd.get("foto") as File | null;
  if (!file) return NextResponse.json({ error: "Sin archivo" }, { status: 400 });

  if (!file.type.startsWith("image/"))
    return NextResponse.json({ error: "Debe ser una imagen" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json({ error: "Máximo 5MB" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const nombre = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("ganadores")
    .upload(nombre, file, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from("ganadores").getPublicUrl(nombre);
  return NextResponse.json({ url: data.publicUrl });
}