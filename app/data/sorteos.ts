import { Sorteo } from "../types/sorteo";

export const sorteos: Sorteo[] = [
  {
    id: "abril",
    badge: "⭐ Fin de Mes",
    fecha: "Sorteo 30 de Abril",
    titulo: "Gran Sorteo Abril",
    precio: 40,
    link: "#",
    premios: [
      { cantidad: 1, nombre: "🚗 Ford Ranger", esMayor: true },
      { cantidad: 3, nombre: "Ford Territory" },
      { cantidad: 10, nombre: "Toyota Yaris" },
      { cantidad: 1, nombre: "Corolla Cross" },
      { cantidad: 15, nombre: "Motos NS200" },
      { cantidad: 180, nombre: "Efectivo S/ 1,200" },
      { cantidad: 15, nombre: "📱 iPhone 17 Pro Max" },
    ],
  },
  {
    id: "mayo",
    badge: "💝 Día de la Madre",
    fecha: "Sorteo 10 de Mayo",
    titulo: "Gran Sorteo Mayo",
    precio: 60,
    esEspecial: true,
    link: "#",
    premios: [
      { cantidad: 1, nombre: "🚙 Toyota Fortuner", esMayor: true },
      { cantidad: 14, nombre: "Toyota Yaris" },
      { cantidad: 10, nombre: "Motos NS400Z" },
      { cantidad: 5, nombre: "Hilux SRV" },
      { cantidad: 180, nombre: "Fajos S/ 1,200" },
      { cantidad: 5, nombre: "📱 iPhone 17 Pro Max" },
    ],
  },
];