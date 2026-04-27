import { supabase, supabaseAdmin } from "./supabase";

// ── SORTEOS ──────────────────────────────────────
export async function getSorteos() {
  const { data, error } = await supabase
    .from("sorteo_config")
    .select("*")
    .eq("activo", true)
    .order("fecha_sorteo", { ascending: true });

  console.log("SORTEOS DATA:", data);
  console.log("SORTEOS ERROR:", error);

  if (error) throw error;
  return data ?? [];
}

export async function getSorteo(id: string) {
  const { data, error } = await supabase
    .from("sorteo_config")
    .select("*")
    .eq("sorteo_id", id)
    .eq("activo", true)
    .single();
  if (error) throw error;
  return data;
}

// ── GANADORES ────────────────────────────────────
export async function getGanadores() {
  const { data, error } = await supabase
    .from("ganadores")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// ── EMPRESAS ─────────────────────────────────────
export async function getEmpresas() {
  const { data, error } = await supabase
    .from("empresas")
    .select("*, empresa_sorteo(sorteo_id), productos(*)")
    .eq("activo", true);
  if (error) throw error;
  return data;
}

export async function getEmpresa(id: string) {
  const { data, error } = await supabase
    .from("empresas")
    .select("*, empresa_sorteo(sorteo_id), productos(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// ── MENSAJES DE CONTACTO ─────────────────────────
export async function guardarMensaje(mensaje: {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}) {
  const { error } = await supabase
    .from("contacto_mensajes")
    .insert(mensaje);
  if (error) throw error;
}