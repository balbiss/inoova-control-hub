import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/_app/configuracoes")({
  component: ConfigPage,
});

const NICHOS = ["Geral", "Saúde", "Educação", "Imobiliário", "Jurídico", "Beleza", "E-commerce", "Tecnologia"];

type Config = {
  id?: string;
  ia_nome: string;
  nicho: string;
  prompt_principal: string;
  prompt_followup: string;
  followup_ativo: boolean;
  pausar_followup_humano: boolean;
  tentativas_max: number;
  intervalo_minutos: number;
  horario_inicio: string;
  horario_fim: string;
  chatwoot_account_id: string;
  chatwoot_token: string;
  chatwoot_inbox_id: string;
};

const DEFAULTS: Config = {
  ia_nome: "Assistente Virtual",
  nicho: "Geral",
  prompt_principal: "",
  prompt_followup: "",
  followup_ativo: true,
  pausar_followup_humano: true,
  tentativas_max: 3,
  intervalo_minutos: 120,
  horario_inicio: "08:00",
  horario_fim: "18:00",
  chatwoot_account_id: "",
  chatwoot_token: "",
  chatwoot_inbox_id: "",
};

function ConfigPage() {
  const { user } = useAuth();
  const [cfg, setCfg] = useState<Config>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("configuracoes")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCfg({
            ...DEFAULTS,
            ...data,
            ia_nome: data.ia_nome ?? DEFAULTS.ia_nome,
            nicho: data.nicho ?? DEFAULTS.nicho,
            prompt_principal: data.prompt_principal ?? "",
            prompt_followup: data.prompt_followup ?? "",
            followup_ativo: data.followup_ativo ?? true,
            pausar_followup_humano: data.pausar_followup_humano ?? true,
            tentativas_max: data.tentativas_max ?? 3,
            intervalo_minutos: data.intervalo_minutos ?? 120,
            horario_inicio: (data.horario_inicio ?? "08:00:00").slice(0, 5),
            horario_fim: (data.horario_fim ?? "18:00:00").slice(0, 5),
            chatwoot_account_id: data.chatwoot_account_id ?? "",
            chatwoot_token: data.chatwoot_token ?? "",
            chatwoot_inbox_id: data.chatwoot_inbox_id ?? "",
          });
        }
      });
  }, [user]);

  const update = <K extends keyof Config>(k: K, v: Config[K]) => setCfg((c) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const payload = { ...cfg, user_id: user.id };
    const { error } = await supabase.from("configuracoes").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configurações salvas com sucesso");
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações IA</h1>
          <p className="text-muted-foreground mt-1">Personalize o comportamento do seu assistente</p>
        </div>
        <Button onClick={save} disabled={saving} style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
          <Save className="h-4 w-4 mr-2" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </header>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Identidade</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome da IA</Label>
            <Input value={cfg.ia_nome} onChange={(e) => update("ia_nome", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nicho</Label>
            <Select value={cfg.nicho} onValueChange={(v) => update("nicho", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {NICHOS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Prompt Principal</Label>
          <Textarea rows={8} value={cfg.prompt_principal} onChange={(e) => update("prompt_principal", e.target.value)} placeholder="Você é um assistente especializado em..." />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Follow-up</h2>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <Label>Ativar Follow-up</Label>
            <p className="text-xs text-muted-foreground mt-1">Reengaje leads que não responderam</p>
          </div>
          <Switch checked={cfg.followup_ativo} onCheckedChange={(v) => update("followup_ativo", v)} />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <Label>Pausar após atendimento humano</Label>
            <p className="text-xs text-muted-foreground mt-1">Para o follow-up quando atendente assume</p>
          </div>
          <Switch checked={cfg.pausar_followup_humano} onCheckedChange={(v) => update("pausar_followup_humano", v)} />
        </div>
        <div className="space-y-2">
          <Label>Prompt de Follow-up</Label>
          <Textarea rows={4} value={cfg.prompt_followup} onChange={(e) => update("prompt_followup", e.target.value)} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Máx. Tentativas</Label>
            <Input type="number" min={1} value={cfg.tentativas_max} onChange={(e) => update("tentativas_max", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Intervalo (minutos)</Label>
            <Input type="number" min={1} value={cfg.intervalo_minutos} onChange={(e) => update("intervalo_minutos", Number(e.target.value))} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Horário Comercial</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Início</Label>
            <Input type="time" value={cfg.horario_inicio} onChange={(e) => update("horario_inicio", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Fim</Label>
            <Input type="time" value={cfg.horario_fim} onChange={(e) => update("horario_fim", e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Integração Chatwoot</h2>
        <div className="space-y-2">
          <Label>Account ID</Label>
          <Input value={cfg.chatwoot_account_id} onChange={(e) => update("chatwoot_account_id", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Token</Label>
          <Input type="password" value={cfg.chatwoot_token} onChange={(e) => update("chatwoot_token", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Inbox ID</Label>
          <Input value={cfg.chatwoot_inbox_id} onChange={(e) => update("chatwoot_inbox_id", e.target.value)} />
        </div>
      </Card>
    </div>
  );
}
