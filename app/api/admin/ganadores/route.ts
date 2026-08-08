import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

function verificarAdmin(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("ganadores")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();

  const { error } = await supabaseAdmin.from("ganadores").insert({
    sorteo_id: body.sorteo_id,
    ticket_id: body.ticket_id ?? null,
    nombre:    body.nombre,
    premio:    body.premio,
    emoji:     body.emoji || "🏆",
    fecha:     body.fecha,
    foto_url:  body.foto_url ?? null,
    sorteo:    body.sorteo ?? null,
    visible:   body.visible ?? true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/ganadores");
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, visible } = await req.json();
  const { error } = await supabaseAdmin
    .from("ganadores")
    .update({ visible })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/ganadores");
  return NextResponse.json({ ok: true });
}