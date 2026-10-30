import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Este perrito se perdió. La página no existe.</p>
        <Link to="/" className="btn mt-6 bg-primary text-primary-foreground">Volver al inicio</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Algo salió mal</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="btn mt-6 bg-primary text-primary-foreground">
          Reintentar
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Amipatitas — Refugio y adopción de perritos" },
      { name: "description", content: "Adopta, compra artículos y dona al refugio Amipatitas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;800&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const nav = [
  { to: "/", label: "Adoptar" },
  { to: "/tienda", label: "Tienda" },
  { to: "/donar", label: "Donar" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-0 z-30 border-b-2 border-foreground bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-foreground bg-accent">🐾</span>
            Amipatitas
          </Link>
          <nav className="flex gap-1 sm:gap-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                className="rounded-full px-3 py-1.5 font-bold sm:px-4"
                activeProps={{ className: "bg-foreground text-background" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="mt-16 border-t-2 border-foreground bg-secondary py-8 text-secondary-foreground">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 text-sm sm:grid-cols-3">
          <div><p className="font-display text-lg font-bold">Amipatitas 🐾</p><p>Refugio sin fines de lucro. Cada perrito sale vacunado y con chequeo veterinario.</p></div>
          <div><p className="font-bold">Visítanos</p><p>Mar–Dom · 10:00–18:00</p><p>Ciudad de México</p></div>
          <div><p className="font-bold">Contacto</p><p>hola@amipatitas.mx</p></div>
        </div>
      </footer>
    </QueryClientProvider>
  );
}
