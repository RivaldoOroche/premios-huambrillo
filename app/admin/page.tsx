"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "dashboard" | "tickets" | "sorteos" | "mensajes" | "ganadores" | "empresas";
type EstadoTicket = "pendiente" | "confirmado" | "rechazado";

interface Premio {
    cantidad: number;
    nombre: string;
    esMayor: boolean;
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
    categoria: string;
    emoji: string;
    activo: boolean;
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
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [ganadores, setGanadores] = useState<GanadorAdmin[]>([]);
    const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
    const [nuevoGanador, setNuevoGanador] = useState({
        sorteo_id: "", nombre: "", premio: "", emoji: "🏆", fecha: "", visible: true,
    });
    const [mostrarGanadorForm, setMostrarGanadorForm] = useState(false);
    const [nuevaEmpresa, setNuevaEmpresa] = useState({
        id: "", nombre: "", descripcion: "", categoria: "", emoji: "🏢",
        whatsapp: "", telefono: "", instagram: "", facebook: "", tiktok: "",
    });
    const [mostrarEmpresaForm, setMostrarEmpresaForm] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [cargandoStats, setCargandoStats] = useState(false);

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
        if (tab === "tickets") cargarTickets();
        if (tab === "sorteos") cargarSorteos();
        if (tab === "mensajes") cargarMensajes();
        if (tab === "ganadores") cargarGanadores();
        if (tab === "empresas") cargarEmpresas();
    }, [autenticado, tab, estadoFiltro, cargarStats, cargarTickets, cargarSorteos, cargarMensajes, cargarGanadores, cargarEmpresas]);

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

    const agregarPremio = () => {
        if (!premioTemp.nombre.trim()) return;
        setListaPremioss([...listaPremioss, { ...premioTemp }]);
        setPremioTemp({ cantidad: 1, nombre: "", esMayor: false });
    };

    const crearSorteo = async () => {
        if (listaPremioss.length === 0) {
            alert("Agrega al menos un premio");
            return;
        }
        const body = { ...nuevoSorteo, premios: listaPremioss };
        await fetch("/api/admin/sorteos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        setMostrarSorteoForm(false);
        setListaPremioss([]);
        setNuevoSorteo({
            sorteo_id: "", badge: "", fecha: "", fecha_sorteo: "",
            titulo: "", precio: 0, total_tickets: 1000, es_especial: false,
        });
        cargarSorteos();
    };

    const inputClass = "w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#e8b800]";

    // LOGIN
    if (!autenticado) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-8 w-full max-w-sm"
                >
                    <p className="font-bebas text-3xl text-[#e8b800] tracking-widest text-center mb-6">
                        🔐 Panel Admin
                    </p>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Contraseña</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        placeholder="••••••••"
                        className={inputClass + " mb-3"}
                    />
                    {errorLogin && <p className="text-red-500 text-xs mb-3">⚠️ {errorLogin}</p>}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black uppercase tracking-widest py-3 rounded-xl hover:brightness-110 transition-all"
                    >
                        Entrar
                    </button>
                </motion.div>
            </div>
        );
    }

    // PANEL
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* Header */}
            <div className="bg-[#111] border-b-2 border-[#e8b800] px-4 py-3 flex items-center justify-between">
                <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">⚙️ Admin — Premios Huambrillo</p>
                <a href="/" className="text-xs text-neutral-500 hover:text-[#e8b800] transition-colors">← Ver sitio</a>
            </div>

            <div className="flex border-b border-neutral-800 px-4 overflow-x-auto">
            {([
                ["dashboard", "📊 Dashboard"],
                ["tickets",   "🎫 Tickets"],
                ["sorteos",   "🎰 Sorteos"],
                ["mensajes",  "📬 Mensajes"],
                ["ganadores", "🏆 Ganadores"],
                ["empresas",  "🏢 Empresas"],
            ] as [Tab, string][]).map(([t, label]) => (
                <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 font-black text-sm uppercase tracking-widest whitespace-nowrap transition-colors relative ${
                    tab === t ? "text-[#e8b800] border-b-2 border-[#e8b800]" : "text-neutral-500 hover:text-white"
                }`}
                >
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
            <div className="space-y-8">
                <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Resumen General</p>

                {cargandoStats ? (
                <p className="text-neutral-500 text-center py-12">Cargando estadísticas...</p>
                ) : stats ? (
                <>
                    {/* Tarjetas KPI */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Ingreso Total",   valor: `S/ ${stats.ingresoTotal.toLocaleString()}`, color: "text-[#e8b800]", bg: "border-[#e8b800]/30 bg-[#e8b800]/5" },
                        { label: "Confirmados",     valor: stats.tickets.confirmados, color: "text-green-400", bg: "border-green-600/30 bg-green-600/5" },
                        { label: "Pendientes",      valor: stats.tickets.pendientes,  color: "text-yellow-400", bg: "border-yellow-500/30 bg-yellow-500/5" },
                        { label: "Msgs sin leer",   valor: stats.mensajesNoLeidos,    color: "text-red-400",    bg: "border-red-600/30 bg-red-600/5" },
                    ].map((kpi, i) => (
                        <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-[#111] border-2 rounded-2xl p-5 text-center ${kpi.bg}`}
                        >
                        <p className={`font-bebas text-3xl sm:text-4xl tracking-widest ${kpi.color}`}>{kpi.valor}</p>
                        <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">{kpi.label}</p>
                        </motion.div>
                    ))}
                    </div>

                    {/* Estado de tickets */}
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
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: item.total > 0 ? `${(item.valor / item.total) * 100}%` : "0%" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`h-full rounded-full ${item.color}`}
                            />
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Ingresos por sorteo */}
                    <div className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5">
                    <p className="font-bebas text-xl text-[#e8b800] tracking-widest mb-4">Ingresos por Sorteo</p>
                    <div className="space-y-4">
                        {stats.ingresosPorSorteo.map((s, i) => (
                        <motion.div
                            key={s.sorteo_id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-4 rounded-xl border-2 ${s.activo ? "border-green-600/20 bg-green-600/5" : "border-neutral-800"}`}
                        >
                            <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                            <div>
                                <p className="font-bebas text-lg text-white tracking-wide">{s.titulo}</p>
                                <p className="text-neutral-500 text-xs">S/ {s.precio} por ticket</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bebas text-2xl text-[#e8b800]">S/ {s.ingreso.toLocaleString()}</p>
                                <p className="text-neutral-500 text-xs">{s.confirmados} tickets confirmados</p>
                            </div>
                            </div>
                            <div>
                            <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                <span>Progreso de ventas</span>
                                <span>{s.vendidos} / {s.total}</span>
                            </div>
                            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(s.vendidos / s.total) * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-red-600 to-[#e8b800] rounded-full"
                                />
                            </div>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { label: "Ver pendientes", accion: () => { setTab("tickets"); setEstadoFiltro("pendiente"); }, color: "border-yellow-500/30 hover:border-yellow-500 text-yellow-400", emoji: "⏳" },
                        { label: "Ver mensajes",   accion: () => setTab("mensajes"),  color: "border-blue-500/30 hover:border-blue-500 text-blue-400",   emoji: "📬" },
                        { label: "Nuevo sorteo",   accion: () => { setTab("sorteos"); setMostrarSorteoForm(true); }, color: "border-[#e8b800]/30 hover:border-[#e8b800] text-[#e8b800]", emoji: "🎰" },
                    ].map((btn, i) => (
                        <button
                        key={i}
                        onClick={btn.accion}
                        className={`bg-[#111] border-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 ${btn.color}`}
                        >
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
                                <button
                                    key={e}
                                    onClick={() => setEstadoFiltro(e)}
                                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${estadoFiltro === e
                                            ? e === "pendiente" ? "bg-yellow-500 text-black"
                                                : e === "confirmado" ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"
                                            : "bg-[#111] border border-neutral-700 text-neutral-400 hover:border-neutral-500"
                                        }`}
                                >
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
                                    <motion.div
                                        key={ticket.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-[#111] border-2 border-neutral-800 rounded-2xl p-5"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="bg-[#e8b800] text-black font-black text-sm px-3 py-0.5 rounded-lg">
                                                        #{String(ticket.numero).padStart(4, "0")}
                                                    </span>
                                                    <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase">
                                                        {ticket.sorteo_id}
                                                    </span>
                                                </div>
                                                <p className="font-black text-white">{ticket.nombre}</p>
                                                <p className="text-neutral-400 text-sm">📞 {ticket.telefono}</p>
                                                {ticket.email && <p className="text-neutral-400 text-sm">✉️ {ticket.email}</p>}
                                                <p className="text-neutral-500 text-xs">
                                                    {new Date(ticket.created_at).toLocaleString("es-PE")}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2 items-end">
                                                {ticket.comprobante && (
                                                    <button
                                                        onClick={() => verComprobante(ticket.comprobante!)}
                                                        className="text-xs bg-blue-600/20 border border-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-600/30 transition-all"
                                                    >
                                                        📸 Ver comprobante
                                                    </button>
                                                )}
                                                {estadoFiltro === "pendiente" && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => accionTicket(ticket.id, "confirmado")}
                                                            className="text-xs bg-green-600 text-white font-black px-4 py-1.5 rounded-lg hover:bg-green-500 transition-all"
                                                        >
                                                            ✅ Aprobar
                                                        </button>
                                                        <button
                                                            onClick={() => accionTicket(ticket.id, "rechazado", "Comprobante inválido")}
                                                            className="text-xs bg-red-600 text-white font-black px-4 py-1.5 rounded-lg hover:bg-red-500 transition-all"
                                                        >
                                                            ❌ Rechazar
                                                        </button>
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

                {/* TAB SORTEOS */}
                {tab === "sorteos" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <p className="font-bebas text-2xl text-[#e8b800] tracking-widest">Sorteos activos</p>
                            <button
                                onClick={() => setMostrarSorteoForm(!mostrarSorteoForm)}
                                className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl hover:brightness-110 transition-all"
                            >
                                + Nuevo sorteo
                            </button>
                        </div>

                        <AnimatePresence>
                            {mostrarSorteoForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-5 mb-6 space-y-4"
                                >
                                    <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Crear nuevo sorteo</p>

                                    {/* Datos generales */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">ID único (ej: junio)</label>
                                            <input className={inputClass} placeholder="junio" value={nuevoSorteo.sorteo_id} onChange={e => setNuevoSorteo({ ...nuevoSorteo, sorteo_id: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Título</label>
                                            <input className={inputClass} placeholder="Gran Sorteo Junio" value={nuevoSorteo.titulo} onChange={e => setNuevoSorteo({ ...nuevoSorteo, titulo: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Badge</label>
                                            <input className={inputClass} placeholder="⭐ Especial" value={nuevoSorteo.badge} onChange={e => setNuevoSorteo({ ...nuevoSorteo, badge: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Fecha (texto)</label>
                                            <input className={inputClass} placeholder="Sorteo 30 de Junio" value={nuevoSorteo.fecha} onChange={e => setNuevoSorteo({ ...nuevoSorteo, fecha: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Fecha y hora del sorteo</label>
                                            <input className={inputClass} type="datetime-local" value={nuevoSorteo.fecha_sorteo} onChange={e => setNuevoSorteo({ ...nuevoSorteo, fecha_sorteo: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Precio ticket (S/)</label>
                                            <input className={inputClass} type="number" value={nuevoSorteo.precio} onChange={e => setNuevoSorteo({ ...nuevoSorteo, precio: parseInt(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Total tickets disponibles</label>
                                            <input className={inputClass} type="number" value={nuevoSorteo.total_tickets} onChange={e => setNuevoSorteo({ ...nuevoSorteo, total_tickets: parseInt(e.target.value) })} />
                                        </div>
                                        <div className="flex items-center gap-2 pt-4">
                                            <input type="checkbox" id="especial" checked={nuevoSorteo.es_especial} onChange={e => setNuevoSorteo({ ...nuevoSorteo, es_especial: e.target.checked })} />
                                            <label htmlFor="especial" className="text-sm text-neutral-400">⭐ Es sorteo especial (dorado)</label>
                                        </div>
                                    </div>

                                    {/* Premios visual */}
                                    <div className="space-y-3">
                                        <label className="text-xs text-neutral-500 uppercase tracking-widest block">🎁 Premios</label>

                                        {/* Lista de premios agregados */}
                                        {listaPremioss.length > 0 && (
                                            <div className="space-y-2">
                                                {listaPremioss.map((p, i) => (
                                                    <div key={i} className={`flex items-center justify-between gap-2 p-3 rounded-xl border ${p.esMayor ? "border-[#e8b800]/40 bg-[#e8b800]/5" : "border-neutral-700 bg-[#1a1a1a]"
                                                        }`}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded min-w-[28px] text-center">
                                                                {p.cantidad}
                                                            </span>
                                                            <span className={`text-sm ${p.esMayor ? "text-[#e8b800] font-black" : "text-white"}`}>
                                                                {p.nombre} {p.esMayor && "⭐"}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => setListaPremioss(listaPremioss.filter((_, j) => j !== i))}
                                                            className="text-red-500 hover:text-red-400 text-xl font-black leading-none"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Formulario agregar premio */}
                                        <div className="bg-[#1a1a1a] border border-neutral-700 rounded-xl p-4 space-y-3">
                                            <p className="text-xs text-neutral-500 uppercase tracking-widest">Agregar premio</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="text-xs text-neutral-600 mb-1 block">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className={inputClass}
                                                        value={premioTemp.cantidad}
                                                        onChange={e => setPremioTemp({ ...premioTemp, cantidad: parseInt(e.target.value) || 1 })}
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-xs text-neutral-600 mb-1 block">Nombre del premio</label>
                                                    <input
                                                        className={inputClass}
                                                        placeholder="🚗 Toyota Yaris"
                                                        value={premioTemp.nombre}
                                                        onChange={e => setPremioTemp({ ...premioTemp, nombre: e.target.value })}
                                                        onKeyDown={e => { if (e.key === "Enter") agregarPremio(); }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={premioTemp.esMayor}
                                                        onChange={e => setPremioTemp({ ...premioTemp, esMayor: e.target.checked })}
                                                    />
                                                    <span className="text-xs text-neutral-400">⭐ Es el premio mayor</span>
                                                </label>
                                                <button
                                                    onClick={agregarPremio}
                                                    className="text-xs bg-[#e8b800] text-black font-black px-4 py-1.5 rounded-lg hover:brightness-110 transition-all"
                                                >
                                                    + Agregar
                                                </button>
                                            </div>
                                        </div>

                                        {listaPremioss.length === 0 && (
                                            <p className="text-xs text-neutral-600 text-center">Agrega al menos un premio para continuar</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={crearSorteo}
                                        disabled={listaPremioss.length === 0}
                                        className="bg-green-600 text-white font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-green-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        ✅ Crear sorteo
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            {sorteos.map((sorteo) => (
                                <div key={sorteo.sorteo_id} className={`bg-[#111] border-2 rounded-2xl p-5 ${sorteo.activo ? "border-green-600/30" : "border-neutral-800"}`}>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
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
                                                    <div
                                                        className="h-full bg-gradient-to-r from-red-600 to-[#e8b800] rounded-full transition-all"
                                                        style={{ width: `${(sorteo.tickets_vendidos / sorteo.total_tickets) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleSorteo(sorteo.sorteo_id, sorteo.activo)}
                                            className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${sorteo.activo
                                                    ? "bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30"
                                                    : "bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30"
                                                }`}
                                        >
                                            {sorteo.activo ? "Desactivar" : "Activar"}
                                        </button>
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
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`bg-[#111] border-2 rounded-2xl p-5 ${msg.leido ? "border-neutral-800" : "border-[#e8b800]/40"}`}
                            >
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
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/admin/mensajes", {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ id: msg.id }),
                                            });
                                            cargarMensajes();
                                        }}
                                        className="text-xs text-[#e8b800] hover:underline font-bold"
                                    >
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
                            <button
                                onClick={() => setMostrarGanadorForm(!mostrarGanadorForm)}
                                className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl hover:brightness-110 transition-all"
                            >
                                + Nuevo ganador
                            </button>
                        </div>

                        <AnimatePresence>
                            {mostrarGanadorForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-5 mb-6 space-y-3"
                                >
                                    <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Agregar ganador</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Sorteo ID</label>
                                            <input className={inputClass} placeholder="abril" value={nuevoGanador.sorteo_id} onChange={e => setNuevoGanador({ ...nuevoGanador, sorteo_id: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Nombre</label>
                                            <input className={inputClass} placeholder="Juan P." value={nuevoGanador.nombre} onChange={e => setNuevoGanador({ ...nuevoGanador, nombre: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Premio</label>
                                            <input className={inputClass} placeholder="🚗 Ford Ranger" value={nuevoGanador.premio} onChange={e => setNuevoGanador({ ...nuevoGanador, premio: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Emoji</label>
                                            <input className={inputClass} placeholder="🏆" value={nuevoGanador.emoji} onChange={e => setNuevoGanador({ ...nuevoGanador, emoji: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-500 mb-1 block">Fecha</label>
                                            <input className={inputClass} placeholder="Abril 2026" value={nuevoGanador.fecha} onChange={e => setNuevoGanador({ ...nuevoGanador, fecha: e.target.value })} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/admin/ganadores", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify(nuevoGanador),
                                            });
                                            setMostrarGanadorForm(false);
                                            cargarGanadores();
                                        }}
                                        className="bg-green-600 text-white font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-green-500 transition-all"
                                    >
                                        ✅ Agregar ganador
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3">
                            {ganadores.length === 0 ? (
                                <p className="text-neutral-500 text-center py-12">No hay ganadores registrados</p>
                            ) : ganadores.map((g) => (
                                <div
                                    key={g.id}
                                    className={`bg-[#111] border-2 rounded-2xl p-4 flex items-center justify-between gap-4 ${g.visible ? "border-neutral-800" : "border-neutral-700 opacity-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{g.emoji}</span>
                                        <div>
                                            <p className="font-black text-white">{g.nombre}</p>
                                            <p className="text-[#e8b800] text-sm">{g.premio}</p>
                                            <p className="text-neutral-500 text-xs">{g.sorteo_id} · {g.fecha}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/admin/ganadores", {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ id: g.id, visible: !g.visible }),
                                            });
                                            cargarGanadores();
                                        }}
                                        className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-all ${g.visible
                                                ? "bg-red-600/20 border-red-600/40 text-red-400 hover:bg-red-600/30"
                                                : "bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30"
                                            }`}
                                    >
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
                            <button
                                onClick={() => setMostrarEmpresaForm(!mostrarEmpresaForm)}
                                className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 text-white font-black text-sm uppercase tracking-widest px-5 py-2.5 rounded-xl hover:brightness-110 transition-all"
                            >
                                + Nueva empresa
                            </button>
                        </div>

                        <AnimatePresence>
                            {mostrarEmpresaForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-[#111] border-2 border-[#e8b800]/30 rounded-2xl p-5 mb-6 space-y-3"
                                >
                                    <p className="font-bebas text-xl text-[#e8b800] tracking-widest">Agregar empresa</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {([
                                            ["id", "ID único (ej: mi-empresa)", "mi-empresa"],
                                            ["nombre", "Nombre", "Mi Empresa S.A.C."],
                                            ["descripcion", "Descripción", "Descripción breve"],
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
                                                <input
                                                    className={inputClass}
                                                    placeholder={placeholder}
                                                    value={(nuevaEmpresa as Record<string, string>)[field]}
                                                    onChange={e => setNuevaEmpresa({ ...nuevaEmpresa, [field]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/admin/empresas", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify(nuevaEmpresa),
                                            });
                                            setMostrarEmpresaForm(false);
                                            cargarEmpresas();
                                        }}
                                        className="bg-green-600 text-white font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-green-500 transition-all"
                                    >
                                        ✅ Crear empresa
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3">
                            {empresas.length === 0 ? (
                                <p className="text-neutral-500 text-center py-12">No hay empresas registradas</p>
                            ) : empresas.map((emp) => (
                                <div
                                    key={emp.id}
                                    className={`bg-[#111] border-2 rounded-2xl p-4 flex items-center justify-between gap-4 ${emp.activo ? "border-green-600/30" : "border-neutral-800 opacity-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{emp.emoji}</span>
                                        <div>
                                            <p className="font-black text-white">{emp.nombre}</p>
                                            <p className="text-neutral-500 text-xs uppercase tracking-wide">{emp.categoria}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await fetch("/api/admin/empresas", {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ id: emp.id, activo: !emp.activo }),
                                            });
                                            cargarEmpresas();
                                        }}
                                        className={`text-xs font-black px-3 py-1.5 rounded-lg border transition-all ${emp.activo
                                                ? "bg-red-600/20 border-red-600/40 text-red-400 hover:bg-red-600/30"
                                                : "bg-green-600/20 border-green-600/40 text-green-400 hover:bg-green-600/30"
                                            }`}
                                    >
                                        {emp.activo ? "Desactivar" : "Activar"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Modal comprobante */}
            <AnimatePresence>
                {urlComprobante && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setUrlComprobante("")}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#111] border-2 border-neutral-700 rounded-2xl p-4 max-w-lg w-full"
                        >
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