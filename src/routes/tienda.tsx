import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { categories, mxn, products } from "@/lib/data";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda para perritos — Amipatitas" },
      { name: "description", content: "Higiene, juguetes, camas, carnazas y premios. Cada compra apoya al refugio." },
      { property: "og:title", content: "Tienda para perritos — Amipatitas" },
      { property: "og:description", content: "Artículos de cuidado para tu perrito; las ganancias apoyan al refugio." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [cat, setCat] = useState<string>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState(false);
  const list = cat === "Todos" ? products : products.filter((p) => p.category === cat);
  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const total = items.reduce((s, [id, q]) => s + (products.find((p) => p.id === id)!.price * q), 0);
  const add = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold sm:text-5xl">Tienda Amipatitas</h1>
      <p className="mt-2 text-muted-foreground">El 100% de las ganancias se destina a alimento y atención veterinaria del refugio.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border-2 border-foreground px-4 py-1.5 font-bold ${cat === c ? "bg-foreground text-background" : "bg-card"}`}>{c}</button>
        ))}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="flex flex-col rounded-2xl border-2 border-foreground bg-card p-4">
              <div className="grid aspect-square place-items-center rounded-xl bg-muted text-6xl">{p.emoji}</div>
              <p className="mt-3 text-xs font-bold text-primary">{p.category}</p>
              <p className="font-bold leading-tight">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="font-display text-lg font-bold">{mxn(p.price)}</span>
                <button onClick={() => add(p.id, 1)} className="btn bg-primary px-3 py-1 text-primary-foreground">+</button>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border-2 border-foreground bg-card p-4 shadow-pop lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">🛒 Tu carrito</h2>
          {ordered ? (
            <p className="mt-3 rounded-xl bg-secondary p-3 text-secondary-foreground">¡Gracias! Recibimos tu pedido. Te contactaremos para el envío.</p>
          ) : items.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Aún no agregas artículos.</p> : (
            <>
              <ul className="mt-3 space-y-2">
                {items.map(([id, q]) => {
                  const p = products.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex-1">{p.name}</span>
                      <span className="flex items-center gap-1">
                        <button onClick={() => add(id, -1)} className="h-6 w-6 rounded-full border">−</button>{q}
                        <button onClick={() => add(id, 1)} className="h-6 w-6 rounded-full border">+</button>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Envío gratis en compras mayores a $799</p>
              <div className="mt-2 flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{mxn(total)}</span></div>
              <button onClick={() => { setOrdered(true); setCart({}); }} className="btn mt-3 w-full bg-primary text-primary-foreground">Finalizar compra</button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
