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
  const body = await req.json();
  const { error } = await supabaseAdmin.from("empresas").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, activo } = await req.json();
  const { error } = await supabaseAdmin
    .from("empresas")
    .update({ activo })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}