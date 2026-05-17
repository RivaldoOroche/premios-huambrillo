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

  // Subir logo si se proporcionó
  if (logo && logo.size > 0) {
    const fileName = `${body.id}-${Date.now()}.${logo.name.split(".").pop()}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("logos")
      .upload(fileName, logo, { upsert: true });

    if (!uploadError) {
      const { data: urlData } = supabaseAdmin.storage
        .from("logos")
        .getPublicUrl(fileName);
      body.logo_url = urlData.publicUrl;
    }
  }

  const { error } = await supabaseAdmin.from("empresas").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, ...body } = await req.json();
  const { error } = await supabaseAdmin
    .from("empresas")
    .update(body)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const logo = formData.get("logo") as File;

  if (!id || !logo) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const fileName = `${id}-${Date.now()}.${logo.name.split(".").pop()}`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("logos")
    .upload(fileName, logo, { upsert: true });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = supabaseAdmin.storage
    .from("logos")
    .getPublicUrl(fileName);

  const { error } = await supabaseAdmin
    .from("empresas")
    .update({ logo_url: urlData.publicUrl })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ url: urlData.publicUrl });
}