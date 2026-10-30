import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import { dogs, type Dog } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adopta un perrito — Amipatitas" },
      { name: "description", content: "Desliza a la derecha para adoptar a tu nuevo mejor amigo en el refugio Amipatitas." },
      { property: "og:title", content: "Adopta un perrito — Amipatitas" },
      { property: "og:description", content: "Conoce a los perritos del refugio y agenda una cita presencial o por videollamada." },
    ],
  }),
  component: Adopt,
});

function Adopt() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Dog | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const dog = dogs[index % dogs.length]!;
  const next = () => setIndex((i) => i + 1);

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-8">
      <section className="mb-8 grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="inline-block rounded-full border-2 border-foreground bg-accent px-3 py-1 text-sm font-bold">Refugio de perritos · CDMX</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-6xl">Encuentra a tu <span className="text-primary">amipatita</span></h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Desliza a la <b className="text-success">derecha</b> si quieres adoptarlo, o a la <b className="text-destructive">izquierda</b> para seguir buscando.
          </p>
        </div>
        <div className="flex gap-3 text-center">
          <Stat n={dogs.length} l="en adopción" />
          <Stat n={liked.length} l="te gustaron" />
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
        <SwipeCard key={index} dog={dog} onLeft={next} onRight={() => { setLiked((l) => [...new Set([...l, dog.id])]); setChosen(dog); }} />
        <aside className="space-y-4">
          <h2 className="text-2xl font-bold">¿Cómo funciona la adopción?</h2>
          {[
            ["1", "Desliza y elige", "Conoce a cada perrito, su carácter y sus vacunas."],
            ["2", "Agenda una cita", "Presencial en el refugio o por videollamada."],
            ["3", "Entrevista y visita", "Platicamos para asegurar el mejor match."],
            ["4", "¡Bienvenido a casa!", "Firmas tu carta responsiva y te lo llevas."],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-4 rounded-2xl border-2 border-foreground bg-card p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-display font-bold text-primary-foreground">{n}</span>
              <div><p className="font-bold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
            </div>
          ))}
          <div className="rounded-2xl border-2 border-dashed border-foreground bg-secondary p-4 text-sm text-secondary-foreground">
            <b>Requisitos:</b> ser mayor de 18 años, identificación oficial, comprobante de domicilio y compromiso de esterilización. La adopción tiene una cuota de recuperación de $500 MXN que cubre vacunas y chequeo.
          </div>
        </aside>
      </div>

      {chosen && <AdoptSheet dog={chosen} onClose={() => { setChosen(null); next(); }} />}
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-2xl border-2 border-foreground bg-card px-5 py-3 shadow-pop">
      <p className="font-display text-3xl font-bold">{n}</p><p className="text-xs font-bold text-muted-foreground">{l}</p>
    </div>
  );
}

function SwipeCard({ dog, onLeft, onRight }: { dog: Dog; onLeft: () => void; onRight: () => void }) {
  const [dx, setDx] = useState(0);
  const [leaving, setLeaving] = useState<0 | 1 | -1>(0);
  const start = useRef<number | null>(null);

  const fling = (dir: 1 | -1) => {
    setLeaving(dir);
    setTimeout(() => (dir === 1 ? onRight() : onLeft()), 280);
  };
  const end = () => {
    if (dx > 110) fling(1); else if (dx < -110) fling(-1); else setDx(0);
    start.current = null;
  };
  const x = leaving ? leaving * 700 : dx;

  return (
    <div>
      <div
        className="relative touch-none select-none overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-soft"
        style={{ transform: `translateX(${x}px) rotate(${x / 18}deg)`, transition: start.current === null ? "transform .3s ease" : "none" }}
        onPointerDown={(e) => { start.current = e.clientX; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
        onPointerMove={(e) => { if (start.current !== null) setDx(e.clientX - start.current); }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div className="relative">
          <img src={dog.photos[0]} alt={dog.name} width={768} height={1024} draggable={false} className="aspect-[4/4.2] w-full object-cover" />
          <span className="absolute left-4 top-4 rotate-[-12deg] rounded-lg border-4 border-success px-3 py-1 font-display text-2xl font-bold text-success" style={{ opacity: Math.max(0, x / 110) }}>ADOPTAR</span>
          <span className="absolute right-4 top-4 rotate-[12deg] rounded-lg border-4 border-destructive px-3 py-1 font-display text-2xl font-bold text-destructive" style={{ opacity: Math.max(0, -x / 110) }}>SIGUIENTE</span>
        </div>
        <DogInfo dog={dog} />
      </div>
      <div className="mt-5 flex justify-center gap-4">
        <button aria-label="Seguir buscando" onClick={() => fling(-1)} className="btn h-16 w-16 bg-card text-2xl">✕</button>
        <button aria-label="Quiero adoptarlo" onClick={() => fling(1)} className="btn h-16 w-16 bg-primary text-2xl text-primary-foreground">♥</button>
      </div>
    </div>
  );
}

function DogInfo({ dog }: { dog: Dog }) {
  return (
    <div className="space-y-3 p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-3xl font-bold">{dog.name}</h2>
        <span className="font-bold text-muted-foreground">{dog.sex === "Macho" ? "♂" : "♀"} {dog.sex}</span>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <Info k="Raza" v={dog.breed} /><Info k="Edad aprox." v={dog.age} />
        <Info k="Tamaño aprox." v={dog.size} /><Info k="Esterilizado" v={dog.sterilized ? "Sí" : "Pendiente"} />
      </dl>
      <p className="text-sm"><b>Temperamento:</b> {dog.temperament}</p>
      <div className="flex flex-wrap gap-1.5">
        {dog.vaccines.map((v) => <span key={v} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">💉 {v}</span>)}
      </div>
      <p className={`rounded-xl px-3 py-2 text-sm font-bold ${dog.goodWithDogs ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
        {dog.goodWithDogs ? "🐶 Amigable con otros perritos" : "⚠️ Prefiere ser el único perrito"}
      </p>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return <div className="rounded-xl bg-muted px-3 py-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>;
}

const apptSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(100),
  email: z.string().trim().email("Correo inválido").max(255),
  phone: z.string().trim().regex(/^[0-9+\s-]{10,15}$/, "Teléfono de 10 dígitos"),
  address: z.string().trim().min(5, "Escribe tu domicilio").max(250),
  date: z.string().min(1, "Elige una fecha"),
  time: z.string().optional().refine((v) => !!v, "Elige una hora"),
});

function AdoptSheet({ dog, onClose }: { dog: Dog; onClose: () => void }) {
  const [photo, setPhoto] = useState(0);
  const [mode, setMode] = useState<"presencial" | "video">("presencial");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ date: string; time: string } | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const r = apptSchema.safeParse(data);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setDone({ date: r.data.date, time: r.data.time ?? "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border-2 border-foreground bg-background animate-in slide-in-from-bottom sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b-2 border-foreground p-4">
          <h2 className="text-2xl font-bold">¡Quieres adoptar a {dog.name}! 💛</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-2xl font-bold">✕</button>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div>
            <img src={dog.photos[photo]} alt={dog.name} className="aspect-square w-full rounded-2xl border-2 border-foreground object-cover" />
            <div className="mt-3 flex gap-2">
              {dog.photos.map((p, i) => (
                <button key={p} onClick={() => setPhoto(i)} className={`overflow-hidden rounded-xl border-2 ${i === photo ? "border-primary" : "border-transparent"}`}>
                  <img src={p} alt="" className="h-20 w-20 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{dog.story}</p>
          </div>

          {done ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-foreground bg-secondary p-6 text-center text-secondary-foreground">
              <p className="text-5xl">🎉</p>
              <h3 className="mt-2 text-2xl font-bold">¡Cita agendada!</h3>
              <p className="mt-2">Te esperamos el <b>{done.date}</b> a las <b>{done.time}</b> {mode === "video" ? "por videollamada (te enviaremos el enlace por correo)" : "en el refugio"}.</p>
              <button onClick={onClose} className="btn mt-5 bg-primary text-primary-foreground">Seguir viendo perritos</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3" noValidate>
              <h3 className="text-xl font-bold">Agenda tu cita</h3>
              <div className="grid grid-cols-2 gap-2">
                {(["presencial", "video"] as const).map((m) => (
                  <button type="button" key={m} onClick={() => setMode(m)}
                    className={`rounded-xl border-2 p-3 text-sm font-bold ${mode === m ? "border-foreground bg-accent" : "border-border bg-card"}`}>
                    {m === "presencial" ? "🏠 Presencial" : "📹 Videollamada"}
                  </button>
                ))}
              </div>
              <F name="name" label="Nombre completo" err={errors["name"]} />
              <F name="email" label="Correo" type="email" err={errors["email"]} />
              <F name="phone" label="Teléfono" type="tel" err={errors["phone"]} />
              <F name="address" label="Domicilio" err={errors["address"]} />
              <div className="grid grid-cols-2 gap-2">
                <F name="date" label="Fecha" type="date" min={today} err={errors["date"]} />
                <label className="block text-sm font-bold">Hora
                  <select name="time" className="field mt-1" defaultValue="">
                    <option value="" disabled>Elige</option>
                    {["10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                  {errors["time"] && <span className="text-xs text-destructive">{errors["time"]}</span>}
                </label>
              </div>
              <button className="btn w-full bg-primary text-primary-foreground">Confirmar cita</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function F({ name, label, type = "text", err, min }: { name: string; label: string; type?: string; err?: string | undefined; min?: string | undefined }) {
  return (
    <label className="block text-sm font-bold">{label}
      <input name={name} type={type} min={min} className="field mt-1 font-normal" />
      {err && <span className="text-xs text-destructive">{err}</span>}
    </label>
  );
}
