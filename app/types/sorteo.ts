export interface Premio {
  cantidad: number;
  nombre: string;
  esMayor?: boolean;
}

export interface Sorteo {
  id: string;
  badge: string;
  fecha: string;
  fechaSorteo: string; // 👈 nuevo
  titulo: string;
  premios: Premio[];
  precio: number;
  esEspecial?: boolean;
  link: string;
}
export interface Ganador {
  id: string;
  nombre: string;
  premio: string;
  fecha: string;
  emoji: string;
  sorteo: string;
}
export interface Producto {
  nombre: string;
  descripcion: string;
  emoji: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  emoji: string;
  whatsapp: string;
  telefono: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  sorteos: string[];
  productos: Producto[];
  logo_url?: string;
  mision?: string;
  vision?: string;
}