import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { mxn } from "@/lib/data";

export const Route = createFileRoute("/donar")({
  head: () => ({
    meta: [
      { title: "Dona al refugio — Amipatitas" },
      { name: "description", content: "Tu donativo alimenta, vacuna y cuida a los perritos del refugio Amipatitas." },
      { property: "og:title", content: "Dona al refugio — Amipatitas" },
      { property: "og:description", content: "Apoya a los perritos rescatados con un donativo." },
    ],
  }),
  component: Donate,
});

const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(100),
  amount: z.coerce.number().min(20, "Mínimo $20").max(100000),
  card: z.preprocess((v) => String(v ?? "").replace(/\s/g, ""), z.string().regex(/^\d{15,16}$/, "Número de tarjeta inválido")),
  exp: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
});

const impact: [number, string][] = [[100, "1 semana de croquetas"], [250, "Vacuna completa"], [500, "Esterilización"], [1000, "Mes de cuidados"]];

function Donate() {
  const [amount, setAmount] = useState(250);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]))); return; }
    setErrors({}); setDone(true);
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold sm:text-5xl">Cada peso es una <span className="text-primary">colita feliz</span></h1>
        <p className="mt-3 text-muted-foreground">Amipatitas se sostiene gracias a donativos. Así se usa tu ayuda:</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {impact.map(([n, t]) => (
            <button key={n} onClick={() => setAmount(n)} className={`rounded-2xl border-2 border-foreground p-4 text-left ${amount === n ? "bg-accent shadow-pop" : "bg-card"}`}>
              <p className="font-display text-2xl font-bold">{mxn(n)}</p><p className="text-sm">{t}</p>
            </button>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">¿Prefieres donar en especie? Recibimos croquetas, cobijas y medicamentos en el refugio.</p>
      </div>
      <div className="rounded-3xl border-2 border-foreground bg-card p-6 shadow-pop">
        {done ? (
          <div className="py-10 text-center"><p className="text-5xl">💛</p><h2 className="mt-2 text-2xl font-bold">¡Gracias por tu donativo!</h2><p className="mt-2 text-muted-foreground">Los perritos te lo agradecen con muchos lengüetazos.</p></div>
        ) : (
          <form onSubmit={submit} className="space-y-3" noValidate>
            <h2 className="text-2xl font-bold">Hacer un donativo</h2>
            <L label="Nombre" err={errors.name}><input name="name" className="field mt-1" /></L>
            <L label="Monto (MXN)" err={errors.amount}><input name="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="field mt-1" /></L>
            <L label="Número de tarjeta" err={errors.card}><input name="card" inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19} className="field mt-1" /></L>
            <div className="grid grid-cols-2 gap-2">
              <L label="Vencimiento" err={errors.exp}><input name="exp" placeholder="MM/AA" maxLength={5} className="field mt-1" /></L>
              <L label="CVV" err={errors.cvv}><input name="cvv" type="password" inputMode="numeric" maxLength={4} className="field mt-1" /></L>
            </div>
            <button className="btn w-full bg-primary text-primary-foreground">Donar {mxn(amount || 0)}</button>
            <p className="text-center text-xs text-muted-foreground">🔒 Modo demostración: no se realiza ningún cargo real.</p>
          </form>
        )}
      </div>
    </div>
  );
}

function L({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-bold">{label}{children}{err && <span className="text-xs font-normal text-destructive">{err}</span>}</label>;
}
