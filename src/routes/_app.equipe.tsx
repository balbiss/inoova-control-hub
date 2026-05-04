import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/equipe")({
  component: EquipePage,
});

type Atendente = {
  id: string;
  nome: string | null;
  whatsapp: string | null;
  chatwoot_user_id: number | null;
  status_online: boolean | null;
};

function EquipePage() {
  const { user } = useAuth();
  const [list, setList] = useState<Atendente[]>([]);
  const [form, setForm] = useState({ nome: "", whatsapp: "", chatwoot_user_id: "" });

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("atendentes").select("*").eq("user_id", user.id).order("nome");
    setList((data ?? []) as Atendente[]);
  };
  useEffect(() => { load(); }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.nome) return;
    const { error } = await supabase.from("atendentes").insert({
      user_id: user.id,
      nome: form.nome,
      whatsapp: form.whatsapp || null,
      chatwoot_user_id: form.chatwoot_user_id ? Number(form.chatwoot_user_id) : null,
      status_online: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Atendente adicionado");
    setForm({ nome: "", whatsapp: "", chatwoot_user_id: "" });
    load();
  };

  const toggle = async (a: Atendente, v: boolean) => {
    const { error } = await supabase.from("atendentes").update({ status_online: v }).eq("id", a.id);
    if (error) return toast.error(error.message);
    setList((ls) => ls.map((x) => (x.id === a.id ? { ...x, status_online: v } : x)));
    toast.success(v ? "Disponível para rodízio" : "Removido do rodízio");
  };

  const remove = async (a: Atendente) => {
    const { error } = await supabase.from("atendentes").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success("Atendente removido");
    load();
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Equipe & Rodízio</h1>
        <p className="text-muted-foreground mt-1">Atendentes off-line não recebem leads no rodízio do n8n</p>
      </header>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Adicionar atendente</h2>
        <form onSubmit={add} className="grid md:grid-cols-4 gap-3 items-end">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+55 11 ..." />
          </div>
          <div className="space-y-2">
            <Label>ID Chatwoot</Label>
            <Input type="number" value={form.chatwoot_user_id} onChange={(e) => setForm({ ...form, chatwoot_user_id: e.target.value })} />
          </div>
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" /> Adicionar
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Atendentes ({list.length})</h2>
        </div>
        {list.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">Nenhum atendente cadastrado.</div>
        ) : (
          <div className="divide-y divide-border">
            {list.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium">{a.nome}</div>
                  <div className="text-xs text-muted-foreground">{a.whatsapp || "—"} · Chatwoot: {a.chatwoot_user_id ?? "—"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{a.status_online ? "Disponível" : "Indisponível"}</span>
                  <Switch checked={!!a.status_online} onCheckedChange={(v) => toggle(a, v)} />
                  <Button variant="ghost" size="icon" onClick={() => remove(a)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
