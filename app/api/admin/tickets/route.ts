import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function verificarAdmin(req: NextRequest) {
  const cookie = req.cookies.get("admin_auth")?.value;
  return cookie === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado") || "pendiente";
  const sorteo_id = searchParams.get("sorteo_id");

  let query = supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("estado", estado)
    .order("created_at", { ascending: false });

  if (sorteo_id) query = query.eq("sorteo_id", sorteo_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, estado, notas_admin } = await req.json();

  const update: Record<string, unknown> = { estado, notas_admin };
  if (estado === "confirmado") update.confirmed_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("tickets")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}