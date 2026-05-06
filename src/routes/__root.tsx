import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Voltar
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VisitaIA — Dashboard SaaS" },
      { name: "description", content: "Painel multi-tenant para gestão de IA, atendentes e campanhas." },
      { property: "og:title", content: "VisitaIA — Dashboard SaaS" },
      { name: "twitter:title", content: "VisitaIA — Dashboard SaaS" },
      { property: "og:description", content: "Painel multi-tenant para gestão de IA, atendentes e campanhas." },
      { name: "twitter:description", content: "Painel multi-tenant para gestão de IA, atendentes e campanhas." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e2212408-8ace-4b52-8d8f-19373da50fde/id-preview-07902ffd--05c7a4fb-9d6b-4718-819d-f98297e308fe.lovable.app-1778089351457.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e2212408-8ace-4b52-8d8f-19373da50fde/id-preview-07902ffd--05c7a4fb-9d6b-4718-819d-f98297e308fe.lovable.app-1778089351457.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
