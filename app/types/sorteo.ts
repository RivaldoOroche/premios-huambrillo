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