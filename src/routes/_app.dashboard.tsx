import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Users, CheckCircle2, ArrowRightCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

type LogRow = { id: string; status: string; contato_nome: string | null; created_at: string | null };

function DashboardPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("leads_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setLogs((data ?? []) as LogRow[]);
        setLoading(false);
      });
  }, [user]);

  const total = logs.length;
  const qualified = logs.filter((l) => l.status === "Qualificado").length;
  const transferred = logs.filter((l) => l.status === "Transferido").length;
  const conv = total ? Math.round((transferred / total) * 100) : 0;

  // last 14 days for sparkline + chart
  const chartData = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const day = d.toISOString().slice(0, 10);
    const count = logs.filter((l) => l.created_at?.slice(0, 10) === day).length;
    return {
      day: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
      leads: count,
    };
  });

  const last7 = chartData.slice(-7).reduce((a, b) => a + b.leads, 0);
  const prev7 = chartData.slice(0, 7).reduce((a, b) => a + b.leads, 0);
  const delta = prev7 ? Math.round(((last7 - prev7) / prev7) * 100) : 0;

  const stats = [
    { label: "Total de leads", value: total, delta: delta, icon: Users },
    { label: "Qualificados pela IA", value: qualified, delta: null, icon: CheckCircle2 },
    { label: "Transferidos", value: transferred, delta: null, icon: ArrowRightCircle },
    { label: "Taxa de conversão", value: `${conv}%`, delta: null, icon: TrendingUp },
  ];

  return (
    <div className="px-8 py-8 space-y-8 max-w-[1400px] mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Visão geral</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe a saúde do seu funil em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Atualizado agora
        </div>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border">
        {stats.map((s) => {
          const Icon = s.icon;
          const positive = (s.delta ?? 0) >= 0;
          return (
            <div key={s.label} className="bg-card p-5 hover:bg-elevated transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums tracking-tight">{s.value}</span>
                {s.delta !== null && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${positive ? "text-success" : "text-destructive"}`}>
                    {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(s.delta)}%
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">vs. semana anterior</div>
            </div>
          );
        })}
      </div>

      {/* Chart + sidebar */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="text-sm font-semibold">Volume de leads</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Últimos 14 dias</p>
            </div>
            <div className="flex gap-1 text-[11px]">
              <button className="px-2 py-1 rounded bg-elevated border border-border">14d</button>
              <button className="px-2 py-1 rounded text-muted-foreground hover:text-foreground">30d</button>
              <button className="px-2 py-1 rounded text-muted-foreground hover:text-foreground">90d</button>
            </div>
          </div>
          <div className="h-[320px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 16, right: 16, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.66 0.2 290)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.66 0.2 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.62 0.018 260)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.62 0.018 260)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.015 260)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "oklch(1 0 0 / 0.1)" }}
                />
                <Area type="monotone" dataKey="leads" stroke="oklch(0.66 0.2 290)" strokeWidth={1.75} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Atividade recente</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">{logs.length} eventos</p>
          </div>
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="p-5 text-xs text-muted-foreground">Carregando...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-elevated border border-border flex items-center justify-center mb-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Nenhuma atividade ainda.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {logs.slice(0, 8).map((l) => (
                  <li key={l.id} className="px-5 py-3 flex items-center gap-3 hover:bg-elevated transition-colors">
                    <div className="h-7 w-7 rounded-full bg-elevated border border-border flex items-center justify-center text-[10px] font-medium">
                      {(l.contato_nome ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{l.contato_nome ?? "Contato"}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {l.created_at ? new Date(l.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                      </div>
                    </div>
                    <StatusPill status={l.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    Transferido: { color: "var(--success)", bg: "color-mix(in oklab, var(--success) 14%, transparent)" },
    Qualificado: { color: "var(--primary)", bg: "color-mix(in oklab, var(--primary) 18%, transparent)" },
    Iniciado: { color: "oklch(0.78 0.13 70)", bg: "color-mix(in oklab, oklch(0.78 0.13 70) 14%, transparent)" },
    Abandono: { color: "var(--destructive)", bg: "color-mix(in oklab, var(--destructive) 14%, transparent)" },
  };
  const s = map[status] ?? { color: "var(--muted-foreground)", bg: "var(--muted)" };
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded font-medium font-mono uppercase tracking-wider"
      style={{ color: s.color, background: s.bg }}
    >
      {status}
    </span>
  );
}
