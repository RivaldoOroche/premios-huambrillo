import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let sorteoId = searchParams.get("sorteo_id");

  // sin parámetro → usa el sorteo activo (comportamiento del tab Participantes)
  if (!sorteoId) {
    const { data: config, error: errConfig } = await supabase
      .from("sorteo_config")
      .select("sorteo_id")
      .eq("activo", true)
      .limit(1)
      .maybeSingle();

    if (errConfig) return NextResponse.json({ error: errConfig.message }, { status: 500 });
    if (!config) return NextResponse.json([]); // no hay sorteo activo
    sorteoId = config.sorteo_id;
  }

  // tickets confirmados de ese sorteo
  const { data, error } = await supabase
    .from("tickets")
    .select("id, numero, nombre, telefono, dni, estado")
    .eq("sorteo_id", sorteoId)
    .ilike("estado", "%confirmado%")
    .order("numero", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // equivalente al LOWER(TRIM(...)) = 'confirmado' de tu SQL
  const limpios = (data ?? []).filter(
    (t) => String(t.estado).trim().toLowerCase() === "confirmado"
  );

  return NextResponse.json(limpios);
}