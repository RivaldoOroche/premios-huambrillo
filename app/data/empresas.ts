import { Empresa } from "../types/sorteo";

export const empresas: Empresa[] = [
  {
    id: "automotriz-huambrillo",
    nombre: "Automotriz Huambrillo",
    descripcion: "Concesionaria líder en venta de vehículos nuevos y usados en la región. Más de 10 años brindando confianza y calidad a nuestros clientes.",
    categoria: "Automotriz",
    emoji: "🚗",
    whatsapp: "51999000001",
    telefono: "+51 999 000 001",
    instagram: "automotrizhuambrillo",
    facebook: "automotrizhuambrillo",
    sorteos: ["abril", "mayo"],
    productos: [
      { nombre: "Ford Ranger", descripcion: "Camioneta 4x4, modelo 2026", emoji: "🚙" },
      { nombre: "Toyota Yaris", descripcion: "Sedán compacto, excelente consumo", emoji: "🚗" },
      { nombre: "Corolla Cross", descripcion: "SUV híbrido, tecnología japonesa", emoji: "🚘" },
    ],
  },
  {
    id: "tech-store-pucallpa",
    nombre: "Tech Store Pucallpa",
    descripcion: "Tienda especializada en tecnología, celulares, laptops y accesorios. Importaciones directas con garantía oficial.",
    categoria: "Tecnología",
    emoji: "📱",
    whatsapp: "51999000002",
    telefono: "+51 999 000 002",
    instagram: "techstorepucallpa",
    tiktok: "techstorepucallpa",
    sorteos: ["abril", "mayo"],
    productos: [
      { nombre: "iPhone 17 Pro Max", descripcion: "Último modelo Apple, 256GB", emoji: "📱" },
      { nombre: "MacBook Air M3", descripcion: "Laptop ultradelgada, 16GB RAM", emoji: "💻" },
      { nombre: "AirPods Pro", descripcion: "Auriculares con cancelación de ruido", emoji: "🎧" },
    ],
  },
  {
    id: "motos-del-oriente",
    nombre: "Motos del Oriente",
    descripcion: "Distribuidora oficial de motos en la selva peruana. Servicio técnico autorizado y repuestos originales.",
    categoria: "Motos",
    emoji: "🏍️",
    whatsapp: "51999000003",
    telefono: "+51 999 000 003",
    facebook: "motosdel oriente",
    sorteos: ["abril", "mayo"],
    productos: [
      { nombre: "NS200", descripcion: "Moto deportiva 200cc, ideal para ciudad", emoji: "🏍️" },
      { nombre: "NS400Z", descripcion: "Moto de alto rendimiento 400cc", emoji: "🏍️" },
      { nombre: "Hilux SRV", descripcion: "Camioneta todo terreno", emoji: "🚙" },
    ],
  },
];