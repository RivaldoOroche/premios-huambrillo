import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const telefono = searchParams.get("telefono");
  const dni = searchParams.get("dni");

  if (!telefono || !dni) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("telefono", telefono)
    .eq("dni", dni)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}