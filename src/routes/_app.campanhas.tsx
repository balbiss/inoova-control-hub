import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Zap } from "lucide-react";

export const Route = createFileRoute("/_app/campanhas")({
  component: CampanhasPage,
});

function CampanhasPage() {
  const { user } = useAuth();
  const [numeros, setNumeros] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [delay, setDelay] = useState(5);
  const [webhook, setWebhook] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("inoova_webhook") ?? "" : ""));
  const [busy, setBusy] = useState(false);

  const numbersArr = numeros.split("\n").map((n) => n.trim()).filter(Boolean);

  const start = async () => {
    if (!webhook) return toast.error("Configure a URL do webhook n8n");
    if (numbersArr.length === 0) return toast.error("Adicione pelo menos um número");
    if (!mensagem) return toast.error("Escreva a mensagem da campanha");

    localStorage.setItem("inoova_webhook", webhook);
    setBusy(true);
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          numeros: numbersArr,
          mensagem,
          delay_segundos: delay,
          enviado_em: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
      toast.success(`Disparo iniciado para ${numbersArr.length} contatos`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao chamar webhook");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Campanhas em Massa</h1>
        <p className="text-muted-foreground mt-1">Dispare mensagens via n8n para múltiplos contatos</p>
      </header>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>Webhook n8n</Label>
          <Input placeholder="https://n8n.seudominio.com/webhook/..." value={webhook} onChange={(e) => setWebhook(e.target.value)} />
          <p className="text-xs text-muted-foreground">Salvo localmente neste navegador.</p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <Label>Lista de números (um por linha)</Label>
          <Textarea rows={8} value={numeros} onChange={(e) => setNumeros(e.target.value)} placeholder={"5511999999999\n5511988888888"} className="font-mono text-sm" />
          <p className="text-xs text-muted-foreground">{numbersArr.length} número(s) detectado(s)</p>
        </div>

        <div className="space-y-2">
          <Label>Mensagem</Label>
          <Textarea rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Olá! Temos uma novidade para você..." />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Delay entre mensagens (segundos)</Label>
            <Input type="number" min={1} value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
          </div>
          <div className="flex items-end">
            <Button onClick={start} disabled={busy} className="w-full" style={{ background: "var(--gradient-neon)", color: "var(--success-foreground)", boxShadow: "var(--shadow-neon)" }}>
              {busy ? <Zap className="h-4 w-4 mr-2 animate-pulse" /> : <Send className="h-4 w-4 mr-2" />}
              {busy ? "Disparando..." : "Iniciar Disparo"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
