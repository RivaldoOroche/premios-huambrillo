import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function verificarAdmin(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("sorteo_config")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("sorteo_config")
    .insert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { sorteo_id, ...body } = await req.json();
  const { error } = await supabaseAdmin
    .from("sorteo_config")
    .update(body)
    .eq("sorteo_id", sorteo_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}