import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, email, asunto, mensaje } = body;

  if (!nombre || !email || !asunto || !mensaje) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const { error } = await supabase
    .from("contacto_mensajes")
    .insert({ nombre, email, asunto, mensaje });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}