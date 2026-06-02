import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const sorteo_id = formData.get("sorteo_id") as string;
    const cantidad = parseInt(formData.get("cantidad") as string);
    const nombre = formData.get("nombre") as string;
    const telefono = formData.get("telefono") as string;
    const email = formData.get("email") as string | null;
    const dni = formData.get("dni") as string | null;
    const comprobante = formData.get("comprobante") as File;

if (!sorteo_id || !cantidad || !nombre || !telefono || !dni || !comprobante) {
  return NextResponse.json(
    {
      error: "Faltan datos obligatorios",
      debug: {
        sorteo_id: !!sorteo_id,
        cantidad,
        nombre: !!nombre,
        telefono: !!telefono,
        dni: !!dni,
        comprobante: !!comprobante,
      },
    },
    { status: 400 }
  );
}

    if (cantidad < 1 || cantidad > 20) {
      return NextResponse.json({ error: "Cantidad debe ser entre 1 y 20" }, { status: 400 });
    }

    // 1. Reservar y asignar números via RPC
    const { data, error: rpcError } = await supabaseAdmin.rpc("reservar_tickets", {
      p_sorteo_id: sorteo_id,
      p_cantidad: cantidad,
      p_nombre: nombre,
      p_telefono: telefono,
      p_email: email || null,
      p_tipo: "aleatorio",
      p_dni: dni || null, // 👈 nuevo
    });

    if (rpcError) {
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    const numeros: number[] = data[0].numeros;

    // 2. Subir comprobante a Supabase Storage
    const fileName = `${sorteo_id}/${Date.now()}_${comprobante.name}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("comprobantes")
      .upload(fileName, comprobante);

    if (uploadError) {
      // Revertir tickets si falla el upload
      await supabaseAdmin
        .from("tickets")
        .delete()
        .eq("sorteo_id", sorteo_id)
        .in("numero", numeros);

      return NextResponse.json({ error: "Error subiendo comprobante" }, { status: 500 });
    }

    // 3. Actualizar tickets con comprobante
    const { error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        comprobante: fileName,
        expires_at: null,
      })
      .eq("sorteo_id", sorteo_id)
      .in("numero", numeros);

    if (updateError) {
      return NextResponse.json({ error: "Error actualizando tickets" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, numeros });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}