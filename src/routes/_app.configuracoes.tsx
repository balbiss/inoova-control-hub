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
  horario_inicio: string;
  horario_fim: string;
  chatwoot_account_id: string;
  chatwoot_token: string;
  chatwoot_inbox_id: string;
};

type FollowupConfig = {
  id_config?: number;
  tempo_followup_minutos: number;
  limite_cobrancas: number;
  instrucao_followup: string;
  hora_inicio_semana: number;
  hora_fim_semana: number;
  hora_inicio_sabado: number;
  hora_fim_sabado: number;
  trabalha_domingo: boolean;
};

const DEFAULTS: Config = {
  ia_nome: "Assistente Virtual",
  nicho: "Geral",
  prompt_principal: "",
  horario_inicio: "08:00",
  horario_fim: "18:00",
  chatwoot_account_id: "",
  chatwoot_token: "",
  chatwoot_inbox_id: "",
};

const FOLLOWUP_DEFAULTS: FollowupConfig = {
  tempo_followup_minutos: 30,
  limite_cobrancas: 3,
  instrucao_followup: "",
  hora_inicio_semana: 8,
  hora_fim_semana: 18,
  hora_inicio_sabado: 8,
  hora_fim_sabado: 14,
  trabalha_domingo: false,
};

function ConfigPage() {
  const { user } = useAuth();
  const [cfg, setCfg] = useState<Config>(DEFAULTS);
  const [followup, setFollowup] = useState<FollowupConfig>(FOLLOWUP_DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Buscar configurações básicas
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
            horario_inicio: (data.horario_inicio ?? "08:00:00").slice(0, 5),
            horario_fim: (data.horario_fim ?? "18:00:00").slice(0, 5),
            chatwoot_account_id: data.chatwoot_account_id ?? "",
            chatwoot_token: data.chatwoot_token ?? "",
            chatwoot_inbox_id: data.chatwoot_inbox_id ?? "",
          });

          // Buscar configurações de follow-up vinculadas ao usuário
          supabase
            .from("n8n_config_clientes")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()
            .then(({ data: n8nData }) => {
              if (n8nData) {
                setFollowup({
                  ...FOLLOWUP_DEFAULTS,
                  ...n8nData,
                });
              }
            });
        }
      });
  }, [user]);

  const update = <K extends keyof Config>(k: K, v: Config[K]) => setCfg((c) => ({ ...c, [k]: v }));
  const updateFollowup = <K extends keyof FollowupConfig>(k: K, v: FollowupConfig[K]) => setFollowup((c) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    
    // Salvar configurações básicas
    const payload = { ...cfg, user_id: user.id };
    const { data: configData, error: configError } = await supabase
      .from("configuracoes")
      .upsert(payload)
      .select()
      .single();

    if (configError) {
      setSaving(false);
      console.error("Erro ao salvar config:", configError);
      return toast.error("Erro ao salvar configurações básicas");
    }

    // Salvar configurações de follow-up vinculadas ao user_id
    const followupPayload = { 
      ...followup, 
      user_id: user.id,
      account_id: cfg.chatwoot_account_id || followup.account_id
    };
    
    console.log("Tentando salvar Follow-up:", followupPayload);

    const { data: n8nData, error: n8nError } = await supabase
      .from("n8n_config_clientes")
      .upsert(followupPayload, { onConflict: 'user_id' })
      .select();

    if (n8nError) {
      console.error("ERRO AO SALVAR FOLLOW-UP:", n8nError);
      setSaving(false);
      return toast.error(`Erro no banco: ${n8nError.message}. Verifique o console.`);
    }

    console.log("Sucesso ao salvar Follow-up:", n8nData);

    setSaving(false);
    if (configData) setCfg((c) => ({ ...c, ...configData }));
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="px-4 md:px-8 py-8 space-y-6 max-w-4xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações IA</h1>
          <p className="text-muted-foreground mt-1">Personalize o comportamento do seu assistente</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save className="h-4 w-4 mr-2" /> {saving ? "Salvando..." : "Salvar"}
        </Button>
      </header>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg text-primary">Configurações de Follow-up</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tempo de Follow-up (minutos)</Label>
            <Input 
              type="number" 
              value={followup.tempo_followup_minutos} 
              onChange={(e) => updateFollowup("tempo_followup_minutos", parseInt(e.target.value))} 
            />
            <p className="text-xs text-muted-foreground">Tempo de espera antes de enviar a próxima mensagem automática.</p>
          </div>
          <div className="space-y-2">
            <Label>Limite de Cobranças</Label>
            <Input 
              type="number" 
              value={followup.limite_cobrancas} 
              onChange={(e) => updateFollowup("limite_cobrancas", parseInt(e.target.value))} 
            />
            <p className="text-xs text-muted-foreground">Máximo de vezes que a IA tentará reengajar o cliente.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Instrução de Follow-up</Label>
          <Textarea 
            rows={4} 
            value={followup.instrucao_followup} 
            onChange={(e) => updateFollowup("instrucao_followup", e.target.value)} 
            placeholder="Ex: Tente ser mais persuasivo na segunda cobrança..." 
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wider">Horários de Operação Follow-up</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Segunda a Sexta</h4>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  className="w-20"
                  value={followup.hora_inicio_semana} 
                  onChange={(e) => updateFollowup("hora_inicio_semana", parseInt(e.target.value))} 
                />
                <span>às</span>
                <Input 
                  type="number" 
                  className="w-20"
                  value={followup.hora_fim_semana} 
                  onChange={(e) => updateFollowup("hora_fim_semana", parseInt(e.target.value))} 
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Sábado</h4>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  className="w-20"
                  value={followup.hora_inicio_sabado} 
                  onChange={(e) => updateFollowup("hora_inicio_sabado", parseInt(e.target.value))} 
                />
                <span>às</span>
                <Input 
                  type="number" 
                  className="w-20"
                  value={followup.hora_fim_sabado} 
                  onChange={(e) => updateFollowup("hora_fim_sabado", parseInt(e.target.value))} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label>Trabalha Domingo?</Label>
              <p className="text-xs text-muted-foreground">Ativar follow-up automático aos domingos.</p>
            </div>
            <Switch 
              checked={followup.trabalha_domingo} 
              onCheckedChange={(v) => updateFollowup("trabalha_domingo", v)} 
            />
          </div>
        </div>
      </Card>

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
