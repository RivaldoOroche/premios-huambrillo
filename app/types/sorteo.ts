export interface Premio {
  cantidad: number;
  nombre: string;
  esMayor?: boolean;
}

export interface Sorteo {
  id: string;
  badge: string;
  fecha: string;
  titulo: string;
  premios: Premio[];
  precio: number;
  esEspecial?: boolean;
  link: string;
}