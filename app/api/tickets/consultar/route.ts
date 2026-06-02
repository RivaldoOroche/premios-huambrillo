import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get("busqueda")?.trim();

    if (!busqueda) {
      return NextResponse.json(
        { error: "Debes ingresar DNI o teléfono" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .or(`telefono.eq.${busqueda},dni.eq.${busqueda}`)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("ERROR CONSULTAR TICKETS:", error);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}