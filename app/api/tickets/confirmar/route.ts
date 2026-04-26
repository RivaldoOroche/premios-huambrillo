import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const sorteo_id = formData.get("sorteo_id") as string;
    const numeros = JSON.parse(formData.get("numeros") as string) as number[];
    const comprobante = formData.get("comprobante") as File;

    if (!sorteo_id || !numeros || !comprobante) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Subir comprobante a Supabase Storage
    const fileName = `${sorteo_id}/${Date.now()}_${comprobante.name}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("comprobantes")
      .upload(fileName, comprobante);

    if (uploadError) {
      return NextResponse.json({ error: "Error subiendo comprobante" }, { status: 500 });
    }

    // Actualizar tickets a estado "pendiente"
    const { error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        estado: "pendiente",
        comprobante: fileName,
        expires_at: null,
      })
      .eq("sorteo_id", sorteo_id)
      .in("numero", numeros);

    if (updateError) {
      return NextResponse.json({ error: "Error actualizando tickets" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}