import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const telefono = req.nextUrl.searchParams.get("telefono");
  if (!telefono) return NextResponse.json({ error: "Falta teléfono" }, { status: 400 });

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("telefono", telefono)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}