import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sorteo_id, cantidad, nombre, telefono, email, tipo } = await req.json();

    if (!sorteo_id || !cantidad || !nombre || !telefono) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    if (cantidad < 1 || cantidad > 20) {
      return NextResponse.json({ error: "Cantidad debe ser entre 1 y 20" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc("reservar_tickets", {
      p_sorteo_id: sorteo_id,
      p_cantidad: cantidad,
      p_nombre: nombre,
      p_telefono: telefono,
      p_email: email || null,
      p_tipo: tipo || "aleatorio",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ numeros: data[0].numeros });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}