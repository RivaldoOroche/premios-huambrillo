"use client";

import { useState } from "react";

interface BuscadorProps<T> {
  items: T[];
  valor: T | null;
  onSelect: (item: T | null) => void;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  getSub?: (item: T) => string;
  placeholder?: string;
  disabled?: boolean;
  mensajeVacio?: string;
}

export default function Buscador<T>({
  items, valor, onSelect, getKey, getLabel, getSub,
  placeholder = "Buscar...", disabled = false, mensajeVacio = "Sin resultados",
}: BuscadorProps<T>) {
  const [query, setQuery] = useState("");
  const [abierto, setAbierto] = useState(false);

  const q = query.trim().toLowerCase();
  const filtrados = q
    ? items.filter((i) => `${getLabel(i)} ${getSub?.(i) ?? ""}`.toLowerCase().includes(q))
    : items;

  // Ya hay selección: muestra el chip
  if (valor) {
    return (
      <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#e8b800]/50 rounded-lg px-3 py-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-bold truncate">{getLabel(valor)}</p>
          {getSub && <p className="text-xs text-neutral-500 truncate">{getSub(valor)}</p>}
        </div>
        <button
          onClick={() => { onSelect(null); setQuery(""); }}
          className="text-neutral-500 hover:text-red-400 text-lg font-black leading-none shrink-0"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => { setQuery(e.target.value); setAbierto(true); }}
        onFocus={() => setAbierto(true)}
        onBlur={() => setTimeout(() => setAbierto(false), 150)}
        className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#e8b800] disabled:opacity-40 disabled:cursor-not-allowed"
      />
      {abierto && !disabled && (
        <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-[#111] border border-neutral-700 rounded-lg shadow-2xl">
          {filtrados.length === 0 ? (
            <p className="text-neutral-600 text-xs text-center py-4">{mensajeVacio}</p>
          ) : (
            filtrados.map((item) => (
            <button
                key={getKey(item)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onSelect(item); setQuery(""); setAbierto(false); }}
                className="w-full text-left px-3 py-2 hover:bg-[#1a1a1a] transition-colors border-b border-neutral-800 last:border-0"
            >
                <p className="text-sm text-white truncate">{getLabel(item)}</p>
                {getSub && <p className="text-xs text-neutral-500 truncate">{getSub(item)}</p>}
            </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}