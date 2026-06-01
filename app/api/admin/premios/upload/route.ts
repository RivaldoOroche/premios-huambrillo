import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function verificarAdmin(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const imagen = formData.get("imagen") as File;

  if (!imagen || imagen.size === 0) {
    return NextResponse.json({ error: "No se recibió imagen" }, { status: 400 });
  }

  const ext = imagen.name.split(".").pop();
  const fileName = `premio-${Date.now()}.${ext}`;

  const arrayBuffer = await imagen.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("premios")
    .upload(fileName, buffer, {
      contentType: imagen.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage
    .from("premios")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: data.publicUrl });
}