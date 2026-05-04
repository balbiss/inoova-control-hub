import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Bot, Users, Send, LogOut, Search, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const nav = [
  { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard, group: "Operação" },
  { to: "/configuracoes", label: "IA & Prompts", icon: Bot, group: "Operação" },
  { to: "/equipe", label: "Equipe", icon: Users, group: "Workspace" },
  { to: "/campanhas", label: "Campanhas", icon: Send, group: "Workspace" },
] as const;

export function AppShell() {
  const loc = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const groups = Array.from(new Set(nav.map((n) => n.group)));
  const initial = (user?.email ?? "?").charAt(0).toUpperCase();
  const current = nav.find((n) => loc.pathname.startsWith(n.to));

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-[248px] shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
        {/* Brand */}
        <div className="px-5 h-14 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="h-7 w-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">InoovaWeb</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.15em]">Control</div>
          </div>
        </div>

        {/* Workspace switcher */}
        <div className="px-3 pt-3">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-sidebar-accent transition-colors text-left">
            <div className="h-6 w-6 rounded bg-primary/15 border border-primary/20 flex items-center justify-center text-[11px] font-semibold text-primary">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{user?.email?.split("@")[0] ?? "Workspace"}</div>
              <div className="text-[10px] text-muted-foreground truncate">Plano Pro</div>
            </div>
          </button>
        </div>

        <nav className="px-3 pt-4 space-y-5 flex-1 overflow-y-auto">
          {groups.map((g) => (
            <div key={g}>
              <div className="px-2.5 mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {g}
              </div>
              <div className="space-y-0.5">
                {nav.filter((i) => i.group === g).map((item) => {
                  const Icon = item.icon;
                  const active = loc.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/login" });
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-6 gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-muted-foreground">Workspace</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium">{current?.label ?? "Painel"}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="h-8 w-64 pl-8 text-xs bg-elevated border-border"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded px-1 py-0.5">⌘K</kbd>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
