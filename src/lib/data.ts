import d1a from "@/assets/dog1a.jpg";
import d1b from "@/assets/dog1b.jpg";
import d2a from "@/assets/dog2a.jpg";
import d2b from "@/assets/dog2b.jpg";
import d3a from "@/assets/dog3a.jpg";
import d3b from "@/assets/dog3b.jpg";
import d4a from "@/assets/dog4a.jpg";
import d4b from "@/assets/dog4b.jpg";

export type Dog = {
  id: string; name: string; sex: "Macho" | "Hembra"; size: string; breed: string; age: string;
  vaccines: string[]; temperament: string; goodWithDogs: boolean; sterilized: boolean;
  story: string; photos: string[];
};

export const dogs: Dog[] = [
  { id: "canela", name: "Canela", sex: "Hembra", size: "Mediano (~18 kg)", breed: "Mestiza tipo Golden", age: "3 años",
    vaccines: ["Rabia", "Séxtuple", "Bordetella"], temperament: "Cariñosa, juguetona y muy obediente",
    goodWithDogs: true, sterilized: true, story: "Rescatada de la calle en Coyoacán. Ama las pelotas y las siestas al sol.", photos: [d1a, d1b] },
  { id: "pepe", name: "Pepe", sex: "Macho", size: "Pequeño (~4 kg)", breed: "Mestizo Chihuahua", age: "2 años",
    vaccines: ["Rabia", "Séxtuple"], temperament: "Curioso, vigilante y apegado a su humano",
    goodWithDogs: false, sterilized: true, story: "Ideal para departamento. Prefiere ser el único perrito de casa.", photos: [d2a, d2b] },
  { id: "bruno", name: "Bruno", sex: "Macho", size: "Grande (~32 kg)", breed: "Mestizo Labrador", age: "9 años (senior)",
    vaccines: ["Rabia", "Séxtuple", "Leptospirosis", "Bordetella"], temperament: "Tranquilo, noble y paciente con niños",
    goodWithDogs: true, sterilized: true, story: "Un abuelito dulce que busca un hogar tranquilo para sus años dorados.", photos: [d3a, d3b] },
  { id: "luna", name: "Luna", sex: "Hembra", size: "Mediano (~10 kg)", breed: "Mestiza Beagle", age: "6 meses",
    vaccines: ["Primera Séxtuple", "Desparasitación"], temperament: "Energética, sociable y muy lista",
    goodWithDogs: true, sterilized: false, story: "Cachorrita llena de energía. Necesita paseos diarios y mucho juego.", photos: [d4a, d4b] },
];

export type Product = { id: string; name: string; category: string; price: number; emoji: string; desc: string };

export const categories = ["Todos", "Higiene", "Juguetes", "Camas", "Carnazas", "Premios"] as const;

export const products: Product[] = [
  { id: "sh", name: "Shampoo avena hipoalergénico", category: "Higiene", price: 189, emoji: "🧴", desc: "500 ml, piel sensible" },
  { id: "cep", name: "Cepillo deslanador", category: "Higiene", price: 249, emoji: "🪮", desc: "Para pelo corto y largo" },
  { id: "pd", name: "Kit dental (pasta + cepillo)", category: "Higiene", price: 159, emoji: "🦷", desc: "Sabor pollo" },
  { id: "toa", name: "Toallitas húmedas", category: "Higiene", price: 99, emoji: "🧻", desc: "Paquete de 80" },
  { id: "bol", name: "Bolsas biodegradables", category: "Higiene", price: 79, emoji: "♻️", desc: "8 rollos" },
  { id: "pel", name: "Pelotas de tenis x3", category: "Juguetes", price: 119, emoji: "🎾", desc: "Resistentes a mordidas" },
  { id: "cue", name: "Cuerda trenzada", category: "Juguetes", price: 139, emoji: "🪢", desc: "Algodón natural" },
  { id: "pel2", name: "Peluche con sonido", category: "Juguetes", price: 169, emoji: "🧸", desc: "Squeaker interno" },
  { id: "kon", name: "Juguete rellenable", category: "Juguetes", price: 229, emoji: "🦴", desc: "Rellena con premios" },
  { id: "cs", name: "Cama chica", category: "Camas", price: 449, emoji: "🛏️", desc: "50 × 40 cm · hasta 7 kg" },
  { id: "cm", name: "Cama mediana", category: "Camas", price: 699, emoji: "🛏️", desc: "70 × 55 cm · hasta 20 kg" },
  { id: "cg", name: "Cama grande ortopédica", category: "Camas", price: 1099, emoji: "🛏️", desc: "100 × 75 cm · hasta 45 kg" },
  { id: "car1", name: "Carnaza hueso prensado", category: "Carnazas", price: 89, emoji: "🦴", desc: "Paquete de 5" },
  { id: "car2", name: "Carnaza trenzada", category: "Carnazas", price: 129, emoji: "🥨", desc: "Paquete de 3" },
  { id: "pr1", name: "Premios de pollo deshidratado", category: "Premios", price: 149, emoji: "🍗", desc: "200 g, 100% natural" },
  { id: "pr2", name: "Galletas de entrenamiento", category: "Premios", price: 99, emoji: "🍪", desc: "Bajas en calorías" },
];

export const mxn = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
