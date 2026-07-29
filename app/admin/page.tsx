"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Buscador from "@/app/components/Buscador";

type Tab = "dashboard" | "tickets" | "sorteos" | "mensajes" | "ganadores" | "participantes" | "empresas";
type EstadoTicket = "pendiente" | "confirmado" | "rechazado";

interface Premio {
  cantidad: number;
  nombre: string;
  esMayor: boolean;
  imagen?: string;
}
interface Participante {
  id: string;
  numero: number;
  nombre: string;
  telefono: string;
  dni: string;
  estado: string;
}
interface Mensaje {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

interface GanadorAdmin {
  id: string;
  sorteo_id: string;
  nombre: string;
  premio: string;
  emoji: string;
  fecha: string;
  visible: boolean;
}

interface EmpresaAdmin {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  emoji: string;
  activo: boolean;
  logo_url?: string;
  mision?: string;
  vision?: string;
  whatsapp?: string;
  telefono?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  [key: string]: any;
}

interface Ticket {
  id: string;
  sorteo_id: string;
  numero: number;
  nombre: string;
  telefono: string;
  email?: string;
  cantidad: number;
  estado: string;
  comprobante?: string;
  notas_admin?: string;
  created_at: string;
}

interface Sorteo {
  sorteo_id: string;
  titulo: string;
  fecha: string;
  precio: number;
  total_tickets: number;
  tickets_vendidos: number;
  activo: boolean;
  es_especial: boolean;
  badge: string;
  fecha_sorteo?: string;
  premios?: Premio[];
}

interface SorteoEdit {
  sorteo_id: string;
  badge: string;
  fecha: string;
  fecha_sorteo: string;
  titulo: string;
  precio: number;
  total_tickets: number;
  es_especial: boolean;
  premios: Premio[];
}

interface Stats {
  tickets: { total: number; confirmados: number; pendientes: number; rechazados: number };
  ingresoTotal: number;
  ingresosPorSorteo: {
    sorteo_id: string; titulo: string; precio: number;
    confirmados: number; ingreso: number; total: number; vendidos: number; activo: boolean;
  }[];
  mensajesNoLeidos: number;
  totalGanadores: number;
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sorteos, setSorteos] = useState<Sorteo[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoTicket>("pendiente");
  const [cargando, setCargando] = useState(false);
  const [urlComprobante, setUrlComprobante] = useState("");
  const [mostrarSorteoForm, setMostrarSorteoForm] = useState(false);
  const [nuevoSorteo, setNuevoSorteo] = useState({
    sorteo_id: "", badge: "", fecha: "", fecha_sorteo: "",
    titulo: "", precio: 0, total_tickets: 1000, es_especial: false,
  });
  const [listaPremioss, setListaPremioss] = useState<Premio[]>([]);
  const [premioTemp, setPremioTemp] = useState<Premio>({ cantidad: 1, nombre: "", esMayor: false });
  const [imagenesPremios, setImagenesPremios] = useState<Record<number, File>>({});
  const [imagenesPremiosEdit, setImagenesPremiosEdit] = useState<Record<number, File>>({});
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [ganadores, setGanadores] = useState<GanadorAdmin[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [ganadorSorteo, setGanadorSorteo] = useState<Sorteo | null>(null);
  const [ganadorParticipante, setGanadorParticipante] = useState<Participante | null>(null);
  const [ganadorPremio, setGanadorPremio] = useState<(Premio & { restantes: number }) | null>(null);
  const [participantesSorteo, setParticipantesSorteo] = useState<Participante[]>([]);
  const [cargandoPartSorteo, setCargandoPartSorteo] = useState(false);
  const [emojiGanador, setEmojiGanador] = useState("🏆");
  const [fechaGanador, setFechaGanador] = useState("");
  const [mostrarGanadorForm, setMostrarGanadorForm] = useState(false);
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    id: "", nombre: "", descripcion: "", categoria: "", emoji: "🏢",
    whatsapp: "", telefono: "", instagram: "", facebook: "", tiktok: "",
    mision: "", vision: "",
  });
  const [logoEmpresa, setLogoEmpresa] = useState<File | null>(null);
  const [mostrarEmpresaForm, setMostrarEmpresaForm] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [cargandoStats, setCargandoStats] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<EmpresaAdmin | null>(null);
  const [logoEditar, setLogoEditar] = useState<File | null>(null);
  const [sorteoEditando, setSorteoEditando] = useState<SorteoEdit | null>(null);
  const [premioseditando, setPremioseditando] = useState<Premio[]>([]);
  const [premioTempEdit, setPremioTempEdit] = useState<Premio>({ cantidad: 1, nombre: "", esMayor: false });

  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [cargandoPart, setCargandoPart] = useState(false);

  const cargarParticipantes = useCallback(async () => {
  setCargandoPart(true);
  const res = await fetch("/api/admin/participantes");
  const data = await res.json();
  setParticipantes(Array.isArray(data) ? data : []);
  setCargandoPart(false);
  }, []);
  const cargarTickets = useCallback(async () => {
    setCargando(true);
    const res = await fetch(`/api/admin/tickets?estado=${estadoFiltro}`);
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
    setCargando(false);
  }, [estadoFiltro]);

  const cargarSorteos = useCallback(async () => {
    const res = await fetch("/api/admin/sorteos");
    const data = await res.json();
    setSorteos(Array.isArray(data) ? data : []);
  }, []);

  const cargarMensajes = useCallback(async () => {
    const res = await fetch("/api/admin/mensajes");
    const data = await res.json();
    setMensajes(Array.isArray(data) ? data : []);
  }, []);

  const cargarGanadores = useCallback(async () => {
    const res = await fetch("/api/admin/ganadores");
    const data = await res.json();
    setGanadores(Array.isArray(data) ? data : []);
  }, []);

  const cargarEmpresas = useCallback(async () => {
    const res = await fetch("/api/admin/empresas");
    const data = await res.json();
    setEmpresas(Array.isArray(data) ? data : []);
  }, []);

  const cargarStats = useCallback(async () => {
    setCargandoStats(true);
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
    setCargandoStats(false);
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    if (tab === "dashboard") cargarStats();
    if (tab === "tickets")   cargarTickets();
    if (tab === "participantes") cargarParticipantes();
    if (tab === "sorteos")   cargarSorteos();
    if (tab === "mensajes")  cargarMensajes();
    if (tab === "ganadores") { cargarGanadores(); cargarSorteos(); }   // ← cambia
    if (tab === "empresas")  cargarEmpresas();
  }, [autenticado, tab, estadoFiltro, cargarStats, cargarTickets, cargarParticipantes, cargarSorteos, cargarMensajes, cargarGanadores, cargarEmpresas]);
  // Al cambiar de sorteo: recarga participantes y resetea los selectores de abajo
useEffect(() => {
  setGanadorParticipante(null);
  setGanadorPremio(null);
  if (!ganadorSorteo) { setParticipantesSorteo([]); return; }

  setCargandoPartSorteo(true);
  fetch(`/api/admin/participantes?sorteo_id=${encodeURIComponent(ganadorSorteo.sorteo_id)}`)
    .then((r) => r.json())
    .then((d) => setParticipantesSorteo(Array.isArray(d) ? d : []))
    .finally(() => setCargandoPartSorteo(false));
}, [ganadorSorteo]);

const sorteosActivos = useMemo(() => sorteos.filter((s) => s.activo), [sorteos]);

const premiosDisponibles = useMemo(() => {
  if (!ganadorSorteo) return [];
  return (ganadorSorteo.premios ?? [])
    .map((p) => {
      const usados = ganadores.filter(
        (g) => g.sorteo_id === ganadorSorteo.sorteo_id && g.premio === p.nombre
      ).length;
      return { ...p, restantes: p.cantidad - usados };
    })
    .filter((p) => p.restantes > 0);
}, [ganadorSorteo, ganadores]);

  const handleLogin = async () => {
    setErrorLogin("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setAutenticado(true);
    else setErrorLogin("Contraseña incorrecta");
  };

  const accionTicket = async (id: string, estado: string, notas?: string) => {
    await fetch("/api/admin/tickets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado, notas_admin: notas }),
    });
    cargarTickets();
  };

  const verComprobante = async (path: string) => {
    const res = await fetch(`/api/admin/comprobante?path=${encodeURIComponent(path)}`);
    const data = await res.json();
    setUrlComprobante(data.url);
  };

  const toggleSorteo = async (sorteo_id: string, activo: boolean) => {
    await fetch("/api/admin/sorteos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sorteo_id, activo: !activo }),
    });
    cargarSorteos();
  };

  const subirImagenPremio = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("imagen", file);
    const res = await fetch("/api/admin/premios/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url ?? null;
  };

  const agregarPremio = () => {
    if (!premioTemp.nombre.trim()) return;
    setListaPremioss([...listaPremioss, { ...premioTemp }]);
    setPremioTemp({ cantidad: 1, nombre: "", esMayor: false });
  };

  const crearSorteo = async () => {
    if (listaPremioss.length === 0) { alert("Agrega al menos un premio"); return; }

    const premiosConImagenes = await Promise.all(
      listaPremioss.map(async (p, i) => {
        if (imagenesPremios[i]) {
          const url = await subirImagenPremio(imagenesPremios[i]);
          if (url) return { ...p, imagen: url };
        }
        return p;
      })
    );

    const body = { ...nuevoSorteo, premios: premiosConImagenes };
    await fetch("/api/admin/sorteos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMostrarSorteoForm(false);
    setListaPremioss([]);
    setImagenesPremios({});
    setNuevoSorteo({ sorteo_id: "", badge: "", fecha: "", fecha_sorteo: "", titulo: "", precio: 0, total_tickets: 1000, es_especial: false });
    cargarSorteos();
  };

  const guardarSorteoEditado = async () => {
    if (!sorteoEditando) return;

    const premiosConImagenes = await Promise.all(
      premioseditando.map(async (p, i) => {
        if (imagenesPremiosEdit[i]) {
          const url = await subirImagenPremio(imagenesPremiosEdit[i]);
          if (url) return { ...p, imagen: url };
        }
        return p;
      })
    );

    await fetch("/api/admin/sorteos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sorteo_id: sorteoEditando.sorteo_id,
        titulo: sorteoEditando.titulo,
        badge: sorteoEditando.badge,
        fecha: sorteoEditando.fecha,
        fecha_sorteo: sorteoEditando.fecha_sorteo,
        precio: sorteoEditando.precio,
        total_tickets: sorteoEditando.total_tickets,
        es_especial: sorteoEditando.es_especial,
        premios: premiosConImagenes,
      }),
    });
    setSorteoEditando(null);
    setImagenesPremiosEdit({});
    cargarSorteos();
  };

  const guardarEmpresaEditada = async () => {
    if (!empresaEditando) return;
    const fd = new FormData();
    fd.append("id", empresaEditando.id);
    const campos = ["nombre", "descripcion", "categoria", "emoji", "whatsapp", "telefono", "instagram", "facebook", "tiktok", "mision", "vision"];
    campos.forEach(c => {
      const val = (empresaEditando as Record<string, string>)[c];
      if (val !== undefined) fd.append(c, val ?? "");
    });
    if (logoEditar) fd.append("logo", logoEditar);
    await fetch("/api/admin/empresas", { method: "PATCH", body: fd });
    setEmpresaEditando(null);
    setLogoEditar(null);
    cargarEmpresas();
  };

  const inputClass = "w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#e8b800]";

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-8 w-full max-w-sm">
          <p className="font-bebas text-3xl text-[#e8b800] tracking-widest text-center mb-6">🔐 Panel Admin</p>
          <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Contraseña</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="••••••••" className={inputClass + " mb-3"} />
          {errorLogin && <p className="text-red-500 text-xs mb-3">⚠️ {errorLogin}</p>}
          <button onClick={handleLogin} className="w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black uppercase tracking-widest py-3 rounded-xl hover:brightness-110 transition-all">
            Entrar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <div className="bg-[#111] border-b-2 border-[#e8b800] px-4 py-3 flex items-center justify-between">
        <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">⚙️ Admin — Premios Huambrillo</p>
        <a href="/" className="text-xs text-neutral-500 hover:text-[#e8b800] transition-colors">← Ver sitio</a>
      </div>

      <div className="flex border-b border-neutral-800 px-4 overflow-x-auto">
        {([
          ["dashboard", "📊 Dashboard"],
          ["tickets",   "🎫 Tickets"],
          ["participantes", "📋 Participantes"],
          ["sorteos",   "🎰 Sorteos"],
          ["mensajes",  "📬 Mensajes"],
          ["ganadores", "🏆 Ganadores"],
          ["empresas",  "🏢 Empresas"],
        ] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 font-black text-sm uppercase tracking-widest whitespace-nowrap transition-colors relative ${
              tab === t ? "text-[#e8b800] border-b-2 border-[#e8b800]" : "text-neutral-500 hover:text-white"
            }`}>
            {label}
            {t === "mensajes" && stats && stats.mensajesNoLeidos > 0 && (
              <span className="absolute top-2 right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-black">
                {stats.mensajesNoLeidos}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB DASHBOARD */}
      {tab === "dashboard" && (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Resumen General</p>
          {cargandoStats ? (
            <p className="text-neutral-500 text-center py-12">Cargando estadísticas...</p>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Ingreso Total", valor: `S/ ${stats.ingresoTotal.toLocaleString()}`, color: "text-[#e8b800]", bg: "border-[#e8b800]/30 bg-[#e8b800]/5" },
                  { label: "Confirmados",   valor: stats.tickets.confirmados, color: "text-green-400",  bg: "border-green-600/30 bg-green-600/5" },
                  { label: "Pendientes",    valor: stats.tickets.pendientes,  color: "text-yellow-400", bg: "border-yellow-500/30 bg-yellow-500/5" },
                  { label: "Msgs sin leer", valor: stats.mensajesNoLeidos,    color: "text-red-400",    bg: "border-red-600/30 bg-red-600/5" },
                ].map((kpi, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`bg-[#111] border-2 rounded-2xl p-5 text-center ${kpi.bg}`}>
                    <p className={`font-bebas text-3xl sm:text-4xl tracking-widest ${kpi.color}`}>{kpi.valor}</p>
                    <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">{kpi.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5">
                <p className="font-bebas text-xl text-[#e8b800] tracking-widest mb-4">Estado de Tickets</p>
                <div className="space-y-3">
                  {[
                    { label: "Confirmados", valor: stats.tickets.confirmados, total: stats.tickets.total, color: "bg-green-500" },
                    { label: "Pendientes",  valor: stats.tickets.pendientes,  total: stats.tickets.total, color: "bg-yellow-500" },
                    { label: "Rechazados",  valor: stats.tickets.rechazados,  total: stats.tickets.total, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>{item.label}</span>
                        <span className="font-black">{item.valor} / {item.total}</span>
                      </div>
                      <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }}
                          animate={{ width: item.total > 0 ? `${(item.valor / item.total) * 100}%` : "0%" }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5">
                <p className="font-bebas text-xl text-[#e8b800] tracking-widest mb-4">Ingresos por Sorteo</p>
                <div className="space-y-4">
                 {stats.ingresosPorSorteo.map((s, i) => {
                  const confirmados = s.confirmados ?? 0;
                  const total = s.total ?? 0;
                  const porcentaje = total > 0 ? Math.min((s.vendidos / total) * 100, 100) : 0;

                  return (
                    <motion.div
                      key={s.sorteo_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        s.activo
                          ? "border-green-600/20 bg-green-600/5"
                          : "border-neutral-800"
                      }`}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                          <p className="font-bebas text-lg text-white tracking-wide">
                            {s.titulo}
                          </p>
                          <p className="text-neutral-500 text-xs">
                            S/ {s.precio} por ticket
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bebas text-2xl text-[#e8b800]">
                            S/ {s.ingreso.toLocaleString()}
                          </p>
                          <p className="text-neutral-500 text-xs">
                            {confirmados} tickets confirmados
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Progreso de ventas</span>
                        <span>
                          {confirmados} / {total}
                        </span>
                      </div>

                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${porcentaje}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-red-600 to-[#e8b800] rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Ver pendientes", accion: () => { setTab("tickets"); setEstadoFiltro("pendiente"); }, color: "border-yellow-500/30 hover:border-yellow-500 text-yellow-400", emoji: "⏳" },
                  { label: "Ver mensajes",   accion: () => setTab("mensajes"), color: "border-blue-500/30 hover:border-blue-500 text-blue-400", emoji: "📬" },
                  { label: "Nuevo sorteo",   accion: () => { setTab("sorteos"); setMostrarSorteoForm(true); }, color: "border-[#e8b800]/30 hover:border-[#e8b800] text-[#e8b800]", emoji: "🎰" },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.accion} className={`bg-[#111] border-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 ${btn.color}`}>
                    <span className="text-3xl block mb-1">{btn.emoji}</span>
                    <span className="font-black text-xs uppercase tracking-widest">{btn.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* TAB TICKETS */}
        {tab === "tickets" && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {(["pendiente", "confirmado", "rechazado"] as EstadoTicket[]).map((e) => (
                <button key={e} onClick={() => setEstadoFiltro(e)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    estadoFiltro === e
                      ? e === "pendiente" ? "bg-yellow-500 text-black" : e === "confirmado" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      : "bg-[#111] border border-neutral-700 text-neutral-400 hover:border-neutral-500"
                  }`}>
                  {e === "pendiente" ? "⏳" : e === "confirmado" ? "✅" : "❌"} {e}
                </button>
              ))}
            </div>
            {cargando ? (
              <p className="text-neutral-500 text-center py-12">Cargando...</p>
            ) : tickets.length === 0 ? (
              <p className="text-neutral-500 text-center py-12">No hay tickets {estadoFiltro}s</p>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-[#e8b800] text-black font-black text-sm px-3 py-0.5 rounded-lg">#{String(ticket.numero).padStart(4, "0")}</span>
                          <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase">{ticket.sorteo_id}</span>
                        </div>
                        <p className="font-black text-white">{ticket.nombre}</p>
                        <p className="text-neutral-400 text-sm">📞 {ticket.telefono}</p>
                        {ticket.email && <p className="text-neutral-400 text-sm">✉️ {ticket.email}</p>}
                        <p className="text-neutral-500 text-xs">{new Date(ticket.created_at).toLocaleString("es-PE")}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {ticket.comprobante && (
                          <button onClick={() => verComprobante(ticket.comprobante!)}
                            className="text-xs bg-blue-600/20 border border-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-600/30 transition-all">
                            📸 Ver comprobante
                          </button>
                        )}
                        {estadoFiltro === "pendiente" && (
                          <div className="flex gap-2">
                            <button onClick={() => accionTicket(ticket.id, "confirmado")}
                              className="text-xs bg-green-600 text-white font-black px-4 py-1.5 rounded-lg hover:bg-green-500 transition-all">✅ Aprobar</button>
                            <button onClick={() => accionTicket(ticket.id, "rechazado", "Comprobante inválido")}
                              className="text-xs bg-red-600 text-white font-black px-4 py-1.5 rounded-lg hover:bg-red-500 transition-all">❌ Rechazar</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "participantes" && (
          <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Participantes del sorteo activo</p>
                <p className="text-neutral-500 text-xs">Solo tickets confirmados · {participantes.length} en total</p>
              </div>
              <button
                onClick={() => {
                  const escapar = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
                  const filas = [
                    ["numero", "nombre", "telefono", "dni", "estado"],
                    ...participantes.map((p) => [p.numero, p.nombre, p.telefono, p.dni, p.estado]),
                  ];
                  const csv = filas.map((f) => f.map(escapar).join(",")).join("\n");
                  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "participantes.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={participantes.length === 0}
                className="bg-[#e8b800] text-black font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl hover:brightness-110 transition-all disabled:opacity-40"
              >
                ⬇️ Descargar CSV
              </button>
            </div>

            {cargandoPart ? (
              <p className="text-neutral-500 text-center py-12">Cargando...</p>
            ) : participantes.length === 0 ? (
              <p className="text-neutral-500 text-center py-12">
                No hay tickets confirmados en el sorteo activo
              </p>
            ) : (
              <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1a1a1a]">
                      <tr className="text-neutral-500 text-xs uppercase tracking-widest">
                        <th className="text-left px-4 py-3">N°</th>
                        <th className="text-left px-4 py-3">Nombre</th>
                        <th className="text-left px-4 py-3">Teléfono</th>
                        <th className="text-left px-4 py-3">DNI</th>
                        <th className="text-left px-4 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participantes.map((p) => (
                        <tr key={p.numero} className="border-t border-neutral-800 hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-4 py-3">
                            <span className="bg-[#e8b800] text-black font-black px-2.5 py-0.5 rounded-lg">
                              #{String(p.numero).padStart(4, "0")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white font-bold">{p.nombre}</td>
                          <td className="px-4 py-3 text-neutral-300">{p.telefono}</td>
                          <td className="px-4 py-3 text-neutral-300">{p.dni?.trim() || "—"}</td>                              
                          <td className="px-4 py-3">
                            <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full font-black uppercase">
                              {p.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {/* TAB SORTEOS */}
        {tab === "sorteos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Sorteos</p>
              <button onClick={() => setMostrarSorteoForm(!mostrarSorteoForm)}
                className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl hover:brightness-110 transition-all">
                + Nuevo sorteo
              </button>
            </div>

            <AnimatePresence>
              {mostrarSorteoForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-5 mb-6 space-y-4">
                  <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Crear nuevo sorteo</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="text-xs text-neutral-500 mb-1 block">ID único (ej: junio)</label>
                      <input className={inputClass} placeholder="junio" value={nuevoSorteo.sorteo_id} onChange={e => setNuevoSorteo({ ...nuevoSorteo, sorteo_id: e.target.value })} /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Título</label>
                      <input className={inputClass} placeholder="Gran Sorteo Junio" value={nuevoSorteo.titulo} onChange={e => setNuevoSorteo({ ...nuevoSorteo, titulo: e.target.value })} /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Badge</label>
                      <input className={inputClass} placeholder="⭐ Especial" value={nuevoSorteo.badge} onChange={e => setNuevoSorteo({ ...nuevoSorteo, badge: e.target.value })} /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Fecha (texto)</label>
                      <input className={inputClass} placeholder="Sorteo 30 de Junio" value={nuevoSorteo.fecha} onChange={e => setNuevoSorteo({ ...nuevoSorteo, fecha: e.target.value })} /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Fecha y hora del sorteo</label>
                      <input className={inputClass} type="datetime-local" value={nuevoSorteo.fecha_sorteo} onChange={e => setNuevoSorteo({ ...nuevoSorteo, fecha_sorteo: e.target.value })} /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Precio ticket (S/)</label>
                      <input className={inputClass} type="number" value={nuevoSorteo.precio} onChange={e => setNuevoSorteo({ ...nuevoSorteo, precio: parseInt(e.target.value) })} /></div>
                    <div><label className="text-xs text-neutral-500 mb-1 block">Total tickets disponibles</label>
                      <input className={inputClass} type="number" value={nuevoSorteo.total_tickets} onChange={e => setNuevoSorteo({ ...nuevoSorteo, total_tickets: parseInt(e.target.value) })} /></div>
                    <div className="flex items-center gap-2 pt-4">
                      <input type="checkbox" id="especial" checked={nuevoSorteo.es_especial} onChange={e => setNuevoSorteo({ ...nuevoSorteo, es_especial: e.target.checked })} />
                      <label htmlFor="especial" className="text-sm text-neutral-400">⭐ Es sorteo especial (dorado)</label>
                    </div>
                  </div>

                  {/* Premios - CREAR */}
                  <div className="space-y-3">
                    <label className="text-xs text-neutral-500 uppercase tracking-widest block">🎁 Premios</label>
                    {listaPremioss.length > 0 && (
                      <div className="space-y-2">
                        {listaPremioss.map((p, i) => (
                          <div key={i} className={`flex items-center gap-2 p-3 rounded-xl border ${p.esMayor ? "border-[#e8b800]/40 bg-[#e8b800]/5" : "border-neutral-700 bg-[#1a1a1a]"}`}>
                            {/* Preview imagen */}
                            {imagenesPremios[i] ? (
                              <img src={URL.createObjectURL(imagenesPremios[i])} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                            ) : p.imagen ? (
                              <img src={p.imagen} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-neutral-800 shrink-0" />
                            )}
                            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded min-w-[28px] text-center">{p.cantidad}</span>
                            <span className={`text-sm flex-1 ${p.esMayor ? "text-[#e8b800] font-black" : "text-white"}`}>{p.nombre} {p.esMayor && "⭐"}</span>
                            {/* Botón imagen */}
                            <label className="text-xs bg-neutral-700 hover:bg-neutral-600 text-neutral-300 px-2 py-1 rounded-lg cursor-pointer transition-all shrink-0">
                              {imagenesPremios[i] ? "✅" : "📷"}
                              <input type="file" accept="image/*" className="hidden"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) setImagenesPremios(prev => ({ ...prev, [i]: file }));
                                }} />
                            </label>
                            <button onClick={() => {
                              setListaPremioss(listaPremioss.filter((_, j) => j !== i));
                              setImagenesPremios(prev => { const n = { ...prev }; delete n[i]; return n; });
                            }} className="text-red-500 hover:text-red-400 text-xl font-black leading-none shrink-0">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="bg-[#1a1a1a] border border-neutral-700 rounded-xl p-4 space-y-3">
                      <p className="text-xs text-neutral-500 uppercase tracking-widest">Agregar premio</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div><label className="text-xs text-neutral-600 mb-1 block">Cantidad</label>
                          <input type="number" min={1} className={inputClass} value={premioTemp.cantidad}
                            onChange={e => setPremioTemp({ ...premioTemp, cantidad: parseInt(e.target.value) || 1 })} /></div>
                        <div className="col-span-2"><label className="text-xs text-neutral-600 mb-1 block">Nombre del premio</label>
                          <input className={inputClass} placeholder="🚗 Toyota Yaris" value={premioTemp.nombre}
                            onChange={e => setPremioTemp({ ...premioTemp, nombre: e.target.value })}
                            onKeyDown={e => { if (e.key === "Enter") agregarPremio(); }} /></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={premioTemp.esMayor} onChange={e => setPremioTemp({ ...premioTemp, esMayor: e.target.checked })} />
                          <span className="text-xs text-neutral-400">⭐ Es el premio mayor</span>
                        </label>
                        <button onClick={agregarPremio} className="text-xs bg-[#e8b800] text-black font-black px-4 py-1.5 rounded-lg hover:brightness-110 transition-all">+ Agregar</button>
                      </div>
                    </div>
                    {listaPremioss.length === 0 && <p className="text-xs text-neutral-600 text-center">Agrega al menos un premio para continuar</p>}
                  </div>

                  <button onClick={crearSorteo} disabled={listaPremioss.length === 0}
                    className="bg-green-600 text-white font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-green-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    ✅ Crear sorteo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {sorteos.map((sorteo) => (
                <div key={sorteo.sorteo_id} className={`bg-[#111] border-2 rounded-2xl p-5 ${sorteo.activo ? "border-green-600/30" : "border-neutral-800"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${sorteo.activo ? "bg-green-600/20 text-green-400" : "bg-neutral-700 text-neutral-500"}`}>
                          {sorteo.activo ? "● Activo" : "● Inactivo"}
                        </span>
                        <span className="text-xs text-neutral-600">{sorteo.badge}</span>
                      </div>
                      <p className="font-bebas text-xl text-[#e8b800] tracking-widest">{sorteo.titulo}</p>
                      <p className="text-neutral-400 text-sm">{sorteo.fecha} · S/ {sorteo.precio} por ticket</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
                          <span>Tickets vendidos</span>
                          <span>{sorteo.tickets_vendidos} / {sorteo.total_tickets}</span>
                        </div>
                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-600 to-[#e8b800] rounded-full transition-all"
                            style={{ width: `${(sorteo.tickets_vendidos / sorteo.total_tickets) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setSorteoEditando({
                          sorteo_id: sorteo.sorteo_id, badge: sorteo.badge, fecha: sorteo.fecha,
                          fecha_sorteo: sorteo.fecha_sorteo ?? "", titulo: sorteo.titulo,
                          precio: sorteo.precio, total_tickets: sorteo.total_tickets,
                          es_especial: sorteo.es_especial, premios: sorteo.premios ?? [],
                        });
                        setPremioseditando(sorteo.premios ?? []);
                        setImagenesPremiosEdit({});
                      }} className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all bg-blue-600/20 border border-blue-600/40 text-blue-400 hover:bg-blue-600/30">
                        ✏️ Editar
                      </button>
                      <button onClick={() => toggleSorteo(sorteo.sorteo_id, sorteo.activo)}
                        className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                          sorteo.activo ? "bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30" : "bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30"
                        }`}>
                        {sorteo.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB MENSAJES */}
        {tab === "mensajes" && (
          <div className="space-y-4">
            <p className="font-bebas text-2xl text-[#e8b800] tracking-widest mb-6">Mensajes de contacto</p>
            {mensajes.length === 0 ? (
              <p className="text-neutral-500 text-center py-12">No hay mensajes</p>
            ) : mensajes.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-[#111] border-2 rounded-2xl p-5 ${msg.leido ? "border-neutral-800" : "border-[#e8b800]/40"}`}>
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <div>
                    <p className="font-black text-white">{msg.nombre}</p>
                    <p className="text-neutral-400 text-sm">✉️ {msg.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full">{msg.asunto}</span>
                    <p className="text-neutral-600 text-xs mt-1">{new Date(msg.created_at).toLocaleString("es-PE")}</p>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm bg-[#1a1a1a] rounded-xl p-3 mb-3">{msg.mensaje}</p>
                {!msg.leido && (
                  <button onClick={async () => {
                    await fetch("/api/admin/mensajes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: msg.id }) });
                    cargarMensajes();
                  }} className="text-xs text-[#e8b800] hover:underline font-bold">
                    ✓ Marcar como leído
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* TAB GANADORES */}
        {tab === "ganadores" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Ganadores</p>
              <button onClick={() => setMostrarGanadorForm(!mostrarGanadorForm)}
                className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl hover:brightness-110 transition-all">
                + Nuevo ganador
              </button>
            </div>
            <AnimatePresence>
              {mostrarGanadorForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-5 mb-6 space-y-4 overflow-visible">
                  <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Registrar ganador</p>

                  {/* 1 — SORTEO */}
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-widest mb-1.5 block">1️⃣ Sorteo activo</label>
                    <Buscador
                      items={sorteosActivos}
                      valor={ganadorSorteo}
                      onSelect={setGanadorSorteo}
                      getKey={(s) => s.sorteo_id}
                      getLabel={(s) => s.titulo}
                      getSub={(s) => `${s.sorteo_id} · ${s.fecha}`}
                      placeholder="Buscar sorteo activo..."
                      mensajeVacio="No hay sorteos activos"
                    />
                  </div>

                  {/* 2 — PARTICIPANTE */}
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-widest mb-1.5 block">
                      2️⃣ Participante {ganadorSorteo && `(${participantesSorteo.length} confirmados)`}
                    </label>
                    <Buscador
                      items={participantesSorteo}
                      valor={ganadorParticipante}
                      onSelect={setGanadorParticipante}
                      getKey={(p) => p.id}
                      getLabel={(p) => `#${String(p.numero).padStart(4, "0")} — ${p.nombre}`}
                      getSub={(p) => `${p.telefono}${p.dni?.trim() ? ` · DNI ${p.dni}` : ""}`}
                      placeholder={
                        !ganadorSorteo ? "Primero elige un sorteo"
                        : cargandoPartSorteo ? "Cargando participantes..."
                        : "Buscar por número, nombre, teléfono o DNI..."
                      }
                      disabled={!ganadorSorteo || cargandoPartSorteo}
                      mensajeVacio="Sin tickets confirmados en este sorteo"
                    />
                  </div>

                  {/* 3 — PREMIO */}
                  <div>
                    <label className="text-xs text-neutral-500 uppercase tracking-widest mb-1.5 block">3️⃣ Premio disponible</label>
                    <Buscador
                      items={premiosDisponibles}
                      valor={ganadorPremio}
                      onSelect={setGanadorPremio}
                      getKey={(p) => p.nombre}
                      getLabel={(p) => `${p.nombre}${p.esMayor ? " ⭐" : ""}`}
                      getSub={(p) => `${p.restantes} de ${p.cantidad} disponibles`}
                      placeholder={ganadorSorteo ? "Buscar premio..." : "Primero elige un sorteo"}
                      disabled={!ganadorSorteo}
                      mensajeVacio="Todos los premios de este sorteo ya fueron entregados"
                    />
                  </div>

                  {/* Complementos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Emoji</label>
                      <input className={inputClass} placeholder="🏆" value={emojiGanador}
                        onChange={(e) => setEmojiGanador(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-500 mb-1 block">Fecha (texto visible)</label>
                      <input className={inputClass} placeholder="Junio 2026" value={fechaGanador}
                        onChange={(e) => setFechaGanador(e.target.value)} />
                    </div>
                  </div>

                  {/* Resumen */}
                  {ganadorSorteo && ganadorParticipante && ganadorPremio && (
                    <div className="bg-[#1a1a1a] border border-[#e8b800]/30 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-3xl">{emojiGanador}</span>
                      <div className="min-w-0">
                        <p className="font-black text-white truncate">{ganadorParticipante.nombre}</p>
                        <p className="text-[#e8b800] text-sm truncate">{ganadorPremio.nombre}</p>
                        <p className="text-neutral-500 text-xs truncate">
                          Ticket #{String(ganadorParticipante.numero).padStart(4, "0")} · {ganadorSorteo.titulo}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={!ganadorSorteo || !ganadorParticipante || !ganadorPremio}
                    onClick={async () => {
                      await fetch("/api/admin/ganadores", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          sorteo_id: ganadorSorteo!.sorteo_id,
                          nombre: ganadorParticipante!.nombre,
                          premio: ganadorPremio!.nombre,
                          emoji: emojiGanador || "🏆",
                          fecha: fechaGanador,
                          visible: true,
                        }),
                      });
                      setMostrarGanadorForm(false);
                      setGanadorSorteo(null);
                      setGanadorParticipante(null);
                      setGanadorPremio(null);
                      setFechaGanador("");
                      setEmojiGanador("🏆");
                      cargarGanadores();
                    }}
                    className="bg-green-600 text-white font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-green-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ✅ Registrar ganador
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-3">
              {ganadores.length === 0 ? (
                <p className="text-neutral-500 text-center py-12">No hay ganadores registrados</p>
              ) : ganadores.map((g) => (
                <div key={g.id} className={`bg-[#111] border-2 rounded-2xl p-4 flex items-center justify-between gap-4 ${g.visible ? "border-neutral-800" : "border-neutral-700 opacity-50"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{g.emoji}</span>
                    <div>
                      <p className="font-black text-white">{g.nombre}</p>
                      <p className="text-[#e8b800] text-sm">{g.premio}</p>
                      <p className="text-neutral-500 text-xs">{g.sorteo_id} · {g.fecha}</p>
                    </div>
                  </div>
                  <button onClick={async () => {
                    await fetch("/api/admin/ganadores", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: g.id, visible: !g.visible }) });
                    cargarGanadores();
                  }} className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-all ${g.visible ? "bg-red-600/20 border-red-600/40 text-red-400 hover:bg-red-600/30" : "bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30"}`}>
                    {g.visible ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB EMPRESAS */}
        {tab === "empresas" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Empresas donantes</p>
              <button onClick={() => setMostrarEmpresaForm(!mostrarEmpresaForm)}
                className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl hover:brightness-110 transition-all">
                + Nueva empresa
              </button>
            </div>
            <AnimatePresence>
              {mostrarEmpresaForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-5 mb-6 space-y-3">
                  <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Agregar empresa</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {([
                      ["id", "ID único (ej: mi-empresa)", "mi-empresa"],
                      ["nombre", "Nombre", "Mi Empresa S.A.C."],
                      ["descripcion", "Descripción", "Descripción breve"],
                      ["categoria", "Categoría", "Tecnología"],
                      ["emoji", "Emoji (si no hay logo)", "🏢"],
                      ["whatsapp", "WhatsApp (sin +)", "51999000000"],
                      ["telefono", "Teléfono", "+51 999 000 000"],
                      ["instagram", "Instagram (sin @)", "miempresa"],
                      ["facebook", "Facebook", "miempresa"],
                      ["tiktok", "TikTok (sin @)", "miempresa"],
                    ] as [string, string, string][]).map(([field, label, placeholder]) => (
                      <div key={field}>
                        <label className="text-xs text-neutral-500 mb-1 block">{label}</label>
                        <input className={inputClass} placeholder={placeholder}
                          value={(nuevaEmpresa as Record<string, string>)[field]}
                          onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, [field]: e.target.value })} />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="text-xs text-neutral-500 mb-1 block">🎯 Misión</label>
                      <textarea className={inputClass + " resize-none h-20"} placeholder="Nuestra misión es..."
                        value={nuevaEmpresa.mision} onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, mision: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-neutral-500 mb-1 block">🔭 Visión</label>
                      <textarea className={inputClass + " resize-none h-20"} placeholder="Nuestra visión es..."
                        value={nuevaEmpresa.vision} onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, vision: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-neutral-500 mb-2 block">🖼️ Logo (opcional)</label>
                      <label className="flex items-center gap-3 border-2 border-dashed border-neutral-600 rounded-xl p-4 cursor-pointer hover:border-[#e8b800] transition-colors">
                        <span className="text-2xl">{logoEmpresa ? "✅" : "📷"}</span>
                        <div>
                          <p className="text-sm text-white font-bold">{logoEmpresa ? logoEmpresa.name : "Subir logo de la empresa"}</p>
                          <p className="text-xs text-neutral-500">PNG, JPG o WEBP — Opcional</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={e => setLogoEmpresa(e.target.files?.[0] || null)} />
                      </label>
                      {logoEmpresa && <button onClick={() => setLogoEmpresa(null)} className="mt-1 text-xs text-red-400 hover:underline">× Quitar logo</button>}
                    </div>
                  </div>
                  <button onClick={async () => {
                    const fd = new FormData();
                    Object.entries(nuevaEmpresa).forEach(([key, val]) => { if (val) fd.append(key, val); });
                    if (logoEmpresa) fd.append("logo", logoEmpresa);
                    await fetch("/api/admin/empresas", { method: "POST", body: fd });
                    setMostrarEmpresaForm(false);
                    setLogoEmpresa(null);
                    setNuevaEmpresa({ id: "", nombre: "", descripcion: "", categoria: "", emoji: "🏢", whatsapp: "", telefono: "", instagram: "", facebook: "", tiktok: "", mision: "", vision: "" });
                    cargarEmpresas();
                  }} className="bg-green-600 text-white font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-green-500 transition-all">
                    ✅ Crear empresa
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-3">
              {empresas.length === 0 ? (
                <p className="text-neutral-500 text-center py-12">No hay empresas registradas</p>
              ) : empresas.map((emp) => (
                <div key={emp.id} className={`bg-[#111] border-2 rounded-2xl p-4 flex items-center justify-between gap-4 ${emp.activo ? "border-green-600/30" : "border-neutral-800 opacity-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1a1a1a] flex items-center justify-center shrink-0">
                      {emp.logo_url ? (
                        <img src={emp.logo_url} alt={emp.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">{emp.emoji}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-white">{emp.nombre}</p>
                      <p className="text-neutral-500 text-xs uppercase tracking-wide">{emp.categoria}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button onClick={() => { setEmpresaEditando(emp); setLogoEditar(null); }}
                      className="text-xs bg-blue-600/20 border border-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-600/30 transition-all font-black">
                      ✏️ Editar
                    </button>
                    <button onClick={async () => {
                      await fetch("/api/admin/empresas", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: emp.id, activo: !emp.activo }) });
                      cargarEmpresas();
                    }} className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-all ${emp.activo ? "bg-red-600/20 border-red-600/40 text-red-400 hover:bg-red-600/30" : "bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30"}`}>
                      {emp.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal editar empresa */}
      <AnimatePresence>
        {empresaEditando && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEmpresaEditando(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-6 w-full max-w-2xl my-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Editar Empresa</p>
                <button onClick={() => setEmpresaEditando(null)} className="text-neutral-500 hover:text-white text-2xl">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {([
                  ["nombre", "Nombre", "Mi Empresa"],
                  ["descripcion", "Descripción", "Descripción"],
                  ["categoria", "Categoría", "Tecnología"],
                  ["emoji", "Emoji", "🏢"],
                  ["whatsapp", "WhatsApp (sin +)", "51999000000"],
                  ["telefono", "Teléfono", "+51 999 000 000"],
                  ["instagram", "Instagram (sin @)", "miempresa"],
                  ["facebook", "Facebook", "miempresa"],
                  ["tiktok", "TikTok (sin @)", "miempresa"],
                ] as [string, string, string][]).map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="text-xs text-neutral-500 mb-1 block">{label}</label>
                    <input className={inputClass} placeholder={placeholder}
                      value={(empresaEditando as Record<string, string>)[field] ?? ""}
                      onChange={e => setEmpresaEditando({ ...empresaEditando, [field]: e.target.value })} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs text-neutral-500 mb-1 block">🎯 Misión</label>
                  <textarea className={inputClass + " resize-none h-20"} placeholder="Nuestra misión es..."
                    value={empresaEditando.mision ?? ""}
                    onChange={e => setEmpresaEditando({ ...empresaEditando, mision: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-neutral-500 mb-1 block">🔭 Visión</label>
                  <textarea className={inputClass + " resize-none h-20"} placeholder="Nuestra visión es..."
                    value={empresaEditando.vision ?? ""}
                    onChange={e => setEmpresaEditando({ ...empresaEditando, vision: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-neutral-500 mb-2 block">🖼️ Logo</label>
                  {empresaEditando.logo_url && !logoEditar && (
                    <img src={empresaEditando.logo_url} alt="Logo actual" className="w-16 h-16 object-contain rounded-xl mb-2 bg-white p-1" />
                  )}
                  <label className="flex items-center gap-3 border-2 border-dashed border-neutral-600 rounded-xl p-3 cursor-pointer hover:border-[#e8b800] transition-colors">
                    <span className="text-xl">{logoEditar ? "✅" : "📷"}</span>
                    <div>
                      <p className="text-sm text-white font-bold">{logoEditar ? logoEditar.name : "Cambiar logo"}</p>
                      <p className="text-xs text-neutral-500">PNG, JPG o WEBP</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setLogoEditar(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={guardarEmpresaEditada}
                  className="flex-1 bg-green-600 text-white font-black text-sm uppercase tracking-widest py-3 rounded-xl hover:bg-green-500 transition-all">
                  ✅ Guardar cambios
                </button>
                <button onClick={() => { setEmpresaEditando(null); setLogoEditar(null); }}
                  className="px-6 bg-neutral-800 text-neutral-400 font-black text-sm uppercase rounded-xl hover:bg-neutral-700 transition-all">
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal editar sorteo */}
      <AnimatePresence>
        {sorteoEditando && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSorteoEditando(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-6 w-full max-w-2xl my-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Editar Sorteo</p>
                <button onClick={() => setSorteoEditando(null)} className="text-neutral-500 hover:text-white text-2xl">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[35vh] overflow-y-auto pr-1">
                <div><label className="text-xs text-neutral-500 mb-1 block">Título</label>
                  <input className={inputClass} value={sorteoEditando.titulo} onChange={e => setSorteoEditando({ ...sorteoEditando, titulo: e.target.value })} /></div>
                <div><label className="text-xs text-neutral-500 mb-1 block">Badge</label>
                  <input className={inputClass} value={sorteoEditando.badge} onChange={e => setSorteoEditando({ ...sorteoEditando, badge: e.target.value })} /></div>
                <div><label className="text-xs text-neutral-500 mb-1 block">Fecha (texto)</label>
                  <input className={inputClass} value={sorteoEditando.fecha} onChange={e => setSorteoEditando({ ...sorteoEditando, fecha: e.target.value })} /></div>
                <div><label className="text-xs text-neutral-500 mb-1 block">Fecha y hora</label>
                  <input className={inputClass} type="datetime-local" value={sorteoEditando.fecha_sorteo?.replace(" ", "T").slice(0, 16)}
                    onChange={e => setSorteoEditando({ ...sorteoEditando, fecha_sorteo: e.target.value })} /></div>
                <div><label className="text-xs text-neutral-500 mb-1 block">Precio (S/)</label>
                  <input className={inputClass} type="number" value={sorteoEditando.precio} onChange={e => setSorteoEditando({ ...sorteoEditando, precio: parseInt(e.target.value) })} /></div>
                <div><label className="text-xs text-neutral-500 mb-1 block">Total tickets</label>
                  <input className={inputClass} type="number" value={sorteoEditando.total_tickets} onChange={e => setSorteoEditando({ ...sorteoEditando, total_tickets: parseInt(e.target.value) })} /></div>
                <div className="flex items-center gap-2 pt-3">
                  <input type="checkbox" checked={sorteoEditando.es_especial} onChange={e => setSorteoEditando({ ...sorteoEditando, es_especial: e.target.checked })} />
                  <label className="text-sm text-neutral-400">⭐ Es sorteo especial</label>
                </div>
              </div>

              {/* Premios - EDITAR */}
              <div className="space-y-3">
                <label className="text-xs text-neutral-500 uppercase tracking-widest block">🎁 Premios</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {premioseditando.map((p, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl border ${p.esMayor ? "border-[#e8b800]/40 bg-[#e8b800]/5" : "border-neutral-700 bg-[#1a1a1a]"}`}>
                      {/* Preview imagen */}
                      {imagenesPremiosEdit[i] ? (
                        <img src={URL.createObjectURL(imagenesPremiosEdit[i])} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                      ) : p.imagen ? (
                        <img src={p.imagen} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 shrink-0" />
                      )}
                      <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded min-w-[24px] text-center">{p.cantidad}</span>
                      <span className={`text-sm flex-1 ${p.esMayor ? "text-[#e8b800] font-black" : "text-white"}`}>{p.nombre} {p.esMayor && "⭐"}</span>
                      {/* Botón imagen */}
                      <label className="text-xs bg-neutral-700 hover:bg-neutral-600 text-neutral-300 px-2 py-1 rounded-lg cursor-pointer transition-all shrink-0">
                        {imagenesPremiosEdit[i] ? "✅" : p.imagen ? "🔄" : "📷"}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) setImagenesPremiosEdit(prev => ({ ...prev, [i]: file }));
                          }} />
                      </label>
                      <button onClick={() => {
                        setPremioseditando(premioseditando.filter((_, j) => j !== i));
                        setImagenesPremiosEdit(prev => { const n = { ...prev }; delete n[i]; return n; });
                      }} className="text-red-500 hover:text-red-400 text-lg font-black leading-none shrink-0">×</button>
                    </div>
                  ))}
                </div>
                <div className="bg-[#1a1a1a] border border-neutral-700 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="text-xs text-neutral-600 mb-1 block">Cantidad</label>
                      <input type="number" min={1} className={inputClass} value={premioTempEdit.cantidad}
                        onChange={e => setPremioTempEdit({ ...premioTempEdit, cantidad: parseInt(e.target.value) || 1 })} /></div>
                    <div className="col-span-2"><label className="text-xs text-neutral-600 mb-1 block">Premio</label>
                      <input className={inputClass} placeholder="🚗 Toyota Yaris" value={premioTempEdit.nombre}
                        onChange={e => setPremioTempEdit({ ...premioTempEdit, nombre: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === "Enter" && premioTempEdit.nombre.trim()) {
                            setPremioseditando([...premioseditando, { ...premioTempEdit }]);
                            setPremioTempEdit({ cantidad: 1, nombre: "", esMayor: false });
                          }
                        }} /></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={premioTempEdit.esMayor} onChange={e => setPremioTempEdit({ ...premioTempEdit, esMayor: e.target.checked })} />
                      <span className="text-xs text-neutral-400">⭐ Es el premio mayor</span>
                    </label>
                    <button onClick={() => {
                      if (!premioTempEdit.nombre.trim()) return;
                      setPremioseditando([...premioseditando, { ...premioTempEdit }]);
                      setPremioTempEdit({ cantidad: 1, nombre: "", esMayor: false });
                    }} className="text-xs bg-[#e8b800] text-black font-black px-4 py-1.5 rounded-lg hover:brightness-110 transition-all">
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={guardarSorteoEditado}
                  className="flex-1 bg-green-600 text-white font-black text-sm uppercase tracking-widest py-3 rounded-xl hover:bg-green-500 transition-all">
                  ✅ Guardar cambios
                </button>
                <button onClick={() => { setSorteoEditando(null); setImagenesPremiosEdit({}); }}
                  className="px-6 bg-neutral-800 text-neutral-400 font-black text-sm uppercase rounded-xl hover:bg-neutral-700 transition-all">
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal comprobante */}
      <AnimatePresence>
        {urlComprobante && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setUrlComprobante("")}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border-2 border-neutral-700 rounded-2xl p-4 max-w-lg w-full">
              <div className="flex justify-between items-center mb-3">
                <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Comprobante de pago</p>
                <button onClick={() => setUrlComprobante("")} className="text-neutral-500 hover:text-white text-xl">✕</button>
              </div>
              <img src={urlComprobante} alt="Comprobante" className="w-full rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}