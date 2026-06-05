import { supabaseAdmin } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

function verificarAdmin(req: NextRequest) {
  return req.cookies.get("admin_auth")?.value === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!verificarAdmin(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Solo sorteos ACTIVOS
  const { data: sorteosData } = await supabaseAdmin
    .from("sorteo_config")
    .select("sorteo_id, titulo, precio, total_tickets, tickets_vendidos, activo")
    .eq("activo", true); // 👈 solo activos

  // IDs de sorteos activos
  const sorteoIdsActivos = sorteosData?.map(s => s.sorteo_id) ?? [];

  // Tickets solo de sorteos activos
  const { data: ticketStats } = sorteoIdsActivos.length > 0
    ? await supabaseAdmin
        .from("tickets")
        .select("estado, sorteo_id")
        .in("sorteo_id", sorteoIdsActivos) // 👈 solo de sorteos activos
    : { data: [] };

  // Mensajes no leídos
  const { count: mensajesNoLeidos } = await supabaseAdmin
    .from("contacto_mensajes")
    .select("*", { count: "exact", head: true })
    .eq("leido", false);

  // Ganadores registrados
  const { count: totalGanadores } = await supabaseAdmin
    .from("ganadores")
    .select("*", { count: "exact", head: true });

  // Estadísticas de tickets
  const confirmados = ticketStats?.filter(t => t.estado === "confirmado").length ?? 0;
  const pendientes  = ticketStats?.filter(t => t.estado === "pendiente").length ?? 0;
  const rechazados  = ticketStats?.filter(t => t.estado === "rechazado").length ?? 0;
  const total       = ticketStats?.length ?? 0;

  // Ingresos por sorteo (solo confirmados, solo activos)
  const ingresosPorSorteo = sorteosData?.map(s => {
    const ticketsConfirmados = ticketStats?.filter(
      t => t.sorteo_id === s.sorteo_id && t.estado === "confirmado"
    ).length ?? 0;
    return {
      sorteo_id:   s.sorteo_id,
      titulo:      s.titulo,
      precio:      s.precio,
      confirmados: ticketsConfirmados,
      ingreso:     ticketsConfirmados * s.precio,
      total:       s.total_tickets,
      vendidos:    s.tickets_vendidos,
      activo:      s.activo,
    };
  }) ?? [];

  const ingresoTotal = ingresosPorSorteo.reduce((sum, s) => sum + s.ingreso, 0);

  return NextResponse.json({
    tickets: { total, confirmados, pendientes, rechazados },
    ingresoTotal,
    ingresosPorSorteo,
    mensajesNoLeidos: mensajesNoLeidos ?? 0,
    totalGanadores:   totalGanadores ?? 0,
  });
}