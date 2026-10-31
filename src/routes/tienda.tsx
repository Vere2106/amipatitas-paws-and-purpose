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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Shop,
});

function DogBed({ scale = 1 }: { scale?: number }) {
  return (
    <svg viewBox="0 0 120 90" className="animate-[bounce_2.5s_ease-in-out_infinite]" style={{ width: `${55 * scale}%` }} aria-label="Cama para perro">
      <ellipse cx="60" cy="80" rx="52" ry="6" fill="var(--color-foreground)" opacity=".15" />
      <path d="M8 55 Q8 25 60 25 Q112 25 112 55 L112 65 Q112 80 60 80 Q8 80 8 65 Z" fill="var(--color-primary)" stroke="var(--color-foreground)" strokeWidth="3" />
      <ellipse cx="60" cy="56" rx="40" ry="14" fill="var(--color-accent)" stroke="var(--color-foreground)" strokeWidth="3" />
      <g fill="var(--color-foreground)" opacity=".7">
        <circle cx="52" cy="54" r="3" /><circle cx="60" cy="51" r="3" /><circle cx="68" cy="54" r="3" />
        <ellipse cx="60" cy="61" rx="5" ry="4" />
      </g>
    </svg>
  );
}

const bedScale: Record<string, number> = { cs: 0.7, cm: 0.85, cg: 1 };

function Shop() {
  const [cat, setCat] = useState<string>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [form, setForm] = useState({ name: "", card: "", exp: "", cvv: "", address: "" });
  const [err, setErr] = useState("");
  const list = cat === "Todos" ? products : products.filter((p) => p.category === cat);
  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const count = items.reduce((s, [, q]) => s + q, 0);
  const total = items.reduce((s, [id, q]) => s + products.find((p) => p.id === id)!.price * q, 0);
  const add = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));
  const addFromGrid = (id: string) => { add(id, 1); setStep("cart"); setOpen(true); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = form.card.replace(/\s/g, "");
    if (form.name.trim().length < 3) return setErr("Escribe tu nombre completo.");
    if (!/^\d{15,16}$/.test(digits)) return setErr("El número de tarjeta debe tener 15 o 16 dígitos.");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp)) return setErr("Vencimiento en formato MM/AA.");
    if (!/^\d{3,4}$/.test(form.cvv)) return setErr("CVV inválido.");
    if (form.address.trim().length < 10) return setErr("Escribe tu domicilio completo.");
    setErr(""); setStep("done"); setCart({});
    setForm({ name: "", card: "", exp: "", cvv: "", address: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold sm:text-5xl">Tienda Amipatitas</h1>
      <p className="mt-2 text-muted-foreground">El 100% de las ganancias se destina a alimento y atención veterinaria del refugio.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border-2 border-foreground px-4 py-1.5 font-bold ${cat === c ? "bg-foreground text-background" : "bg-card"}`}>{c}</button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <div key={p.id} className="flex flex-col rounded-2xl border-2 border-foreground bg-card p-4">
            <div className="grid aspect-square place-items-center rounded-xl bg-muted text-6xl">
              {p.category === "Camas" ? <DogBed scale={bedScale[p.id] ?? 1} /> : p.emoji}
            </div>
            <p className="mt-3 text-xs font-bold text-primary">{p.category}</p>
            <p className="font-bold leading-tight">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
            <div className="mt-auto flex items-center justify-between pt-3">
              <span className="font-display text-lg font-bold">{mxn(p.price)}</span>
              <button onClick={() => addFromGrid(p.id)} className="btn bg-primary px-3 py-1 text-primary-foreground" aria-label={`Agregar ${p.name}`}>+</button>
            </div>
          </div>
        ))}
      </div>

      {count > 0 && !open && (
        <button onClick={() => { setStep("cart"); setOpen(true); }} className="btn fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground">
          🛒 Carrito ({count})
        </button>
      )}

      <div className={`fixed inset-0 z-50 bg-foreground/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setOpen(false)} />
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l-2 border-foreground bg-card p-5 shadow-soft transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{step === "checkout" ? "💳 Datos de compra" : "🛒 Tu carrito"}</h2>
          <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full border-2 border-foreground font-bold" aria-label="Cerrar">✕</button>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">
          {step === "done" ? (
            <p className="rounded-xl bg-secondary p-3 text-secondary-foreground">¡Gracias! Recibimos tu pedido. Te contactaremos para el envío.</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no agregas artículos.</p>
          ) : step === "cart" ? (
            <>
              <ul className="space-y-3">
                {items.map(([id, q]) => {
                  const p = products.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex-1">{p.name}<br /><span className="text-muted-foreground">{mxn(p.price * q)}</span></span>
                      <span className="flex items-center gap-2">
                        <button onClick={() => add(id, -1)} className="h-7 w-7 rounded-full border-2">−</button>{q}
                        <button onClick={() => add(id, 1)} className="h-7 w-7 rounded-full border-2">+</button>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">Envío gratis en compras mayores a $799</p>
            </>
          ) : (
            <form id="checkout" onSubmit={submit} className="space-y-3">
              <label className="block text-sm font-bold">Nombre completo
                <input className="field mt-1" maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="block text-sm font-bold">Número de tarjeta
                <input className="field mt-1" inputMode="numeric" maxLength={19} placeholder="1234 5678 9012 3456"
                  value={form.card} onChange={(e) => setForm({ ...form, card: e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })} required />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-bold">Vencimiento
                  <input className="field mt-1" placeholder="MM/AA" maxLength={5} value={form.exp}
                    onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setForm({ ...form, exp: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v }); }} required />
                </label>
                <label className="block text-sm font-bold">CVV
                  <input className="field mt-1" inputMode="numeric" maxLength={4} value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })} required />
                </label>
              </div>
              <label className="block text-sm font-bold">Domicilio de envío
                <textarea className="field mt-1" rows={3} maxLength={300} placeholder="Calle, número, colonia, CP, ciudad" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </label>
              {err && <p className="text-sm font-bold text-destructive">{err}</p>}
            </form>
          )}
        </div>
        {step !== "done" && items.length > 0 && (
          <div className="border-t-2 pt-3">
            <div className="flex justify-between font-bold"><span>Total</span><span>{mxn(total)}</span></div>
            {step === "cart" ? (
              <button onClick={() => setStep("checkout")} className="btn mt-3 w-full bg-primary text-primary-foreground">Continuar con la compra</button>
            ) : (
              <div className="mt-3 flex gap-2">
                <button onClick={() => setStep("cart")} className="btn bg-card">←</button>
                <button type="submit" form="checkout" className="btn flex-1 bg-primary text-primary-foreground">Pagar {mxn(total)}</button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
