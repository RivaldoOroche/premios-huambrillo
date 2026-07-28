import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // 1) sorteo activo
  const { data: config, error: errConfig } = await supabase
    .from("sorteo_config")
    .select("sorteo_id")
    .eq("activo", true)
    .limit(1)
    .maybeSingle();

  if (errConfig) return NextResponse.json({ error: errConfig.message }, { status: 500 });
  if (!config) return NextResponse.json([]); // no hay sorteo activo

  // 2) tickets confirmados de ese sorteo
  const { data, error } = await supabase
    .from("tickets")
    .select("numero, telefono, dni, estado")
    .eq("sorteo_id", config.sorteo_id)
    .ilike("estado", "%confirmado%")
    .order("numero", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // equivalente al LOWER(TRIM(...)) = 'confirmado' de tu SQL
  const limpios = (data ?? []).filter(
    (t) => String(t.estado).trim().toLowerCase() === "confirmado"
  );

  return NextResponse.json(limpios);
}