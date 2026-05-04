import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle2, ArrowRightCircle, TrendingUp, Activity } from "lucide-react";
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

  // chart - last 7 days
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const day = d.toISOString().slice(0, 10);
    const count = logs.filter((l) => l.created_at?.slice(0, 10) === day).length;
    return { day: d.toLocaleDateString("pt-BR", { weekday: "short" }), leads: count };
  });

  const stats = [
    { label: "Total de Leads", value: total, icon: Users, accent: "primary" },
    { label: "Qualificados IA", value: qualified, icon: CheckCircle2, accent: "success" },
    { label: "Transferidos", value: transferred, icon: ArrowRightCircle, accent: "primary" },
    { label: "Taxa de Conversão", value: `${conv}%`, icon: TrendingUp, accent: "success" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1400px]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu funil inteligente</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const isNeon = s.accent === "success";
          return (
            <Card key={s.label} className="p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20" style={{ background: isNeon ? "var(--gradient-neon)" : "var(--gradient-primary)" }} />
              <div className="flex items-center justify-between relative">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="text-3xl font-bold mt-2">{s.value}</div>
                </div>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: isNeon ? "color-mix(in oklab, var(--success) 20%, transparent)" : "color-mix(in oklab, var(--primary) 20%, transparent)" }}>
                  <Icon className="h-5 w-5" style={{ color: isNeon ? "var(--success)" : "var(--primary)" }} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold">Volume de Leads</h2>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.52 0.31 295)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.52 0.31 295)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 258)" />
              <XAxis dataKey="day" stroke="oklch(0.72 0.03 258)" fontSize={12} />
              <YAxis stroke="oklch(0.72 0.03 258)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "oklch(0.25 0.04 258)", border: "1px solid oklch(0.32 0.03 258)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="leads" stroke="oklch(0.86 0.2 165)" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-success" />
          <h2 className="font-semibold">Atividades Recentes</h2>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
        ) : (
          <ul className="divide-y divide-border">
            {logs.slice(0, 10).map((l) => (
              <li key={l.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{l.contato_nome ?? "Contato sem nome"}</div>
                  <div className="text-xs text-muted-foreground">{l.created_at ? new Date(l.created_at).toLocaleString("pt-BR") : ""}</div>
                </div>
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: l.status === "Transferido" ? "color-mix(in oklab, var(--success) 20%, transparent)" : "color-mix(in oklab, var(--primary) 20%, transparent)",
                    color: l.status === "Transferido" ? "var(--success)" : "var(--primary)",
                  }}
                >
                  {l.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
