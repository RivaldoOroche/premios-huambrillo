import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function verificarAdmin(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("empresas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

async function subirLogo(logo: File, id: string): Promise<string | null> {
  const ext = logo.name.split(".").pop();
  const fileName = `${id}-${Date.now()}.${ext}`;

  // Convertir File a ArrayBuffer para evitar problemas con Next.js
  const arrayBuffer = await logo.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from("logos")
    .upload(fileName, buffer, {
      contentType: logo.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("❌ Error subiendo logo:", uploadError.message);
    return null;
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("logos")
    .getPublicUrl(fileName);

  console.log("✅ Logo subido:", urlData.publicUrl);
  return urlData.publicUrl;
}

export async function POST(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const logo = formData.get("logo") as File | null;

  const campos = [
    "id", "nombre", "descripcion", "categoria", "emoji",
    "whatsapp", "telefono", "instagram", "facebook", "tiktok",
    "mision", "vision",
  ];

  const body: Record<string, string> = {};
  campos.forEach(campo => {
    const val = formData.get(campo) as string;
    if (val) body[campo] = val;
  });

  if (!body.id) {
    return NextResponse.json({ error: "El ID es obligatorio" }, { status: 400 });
  }

  // Subir logo
  if (logo && logo.size > 0) {
    const url = await subirLogo(logo, body.id);
    if (url) body.logo_url = url;
    else return NextResponse.json({ error: "Error subiendo el logo al storage" }, { status: 500 });
  }

  const { error } = await supabaseAdmin.from("empresas").insert(body);
  if (error) {
    console.error("❌ Error insertando empresa:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const logo = formData.get("logo") as File | null;

    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const campos = [
      "nombre", "descripcion", "categoria", "emoji",
      "whatsapp", "telefono", "instagram", "facebook", "tiktok",
      "mision", "vision",
    ];

    const body: Record<string, string> = {};
    campos.forEach(campo => {
      const val = formData.get(campo) as string;
      if (val !== null && val !== undefined) body[campo] = val;
    });

    // Subir logo si se proporcionó
    if (logo && logo.size > 0) {
      const url = await subirLogo(logo, id);
      if (url) body.logo_url = url;
      else return NextResponse.json({ error: "Error subiendo el logo al storage" }, { status: 500 });
    }

    const { error } = await supabaseAdmin.from("empresas").update(body).eq("id", id);
    if (error) {
      console.error("❌ Error actualizando empresa:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // JSON normal (toggle activo)
  const { id, ...rest } = await req.json();
  const { error } = await supabaseAdmin.from("empresas").update(rest).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}