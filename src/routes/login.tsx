import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck, Zap, Workflow } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) return toast.error(error.message);
    if (mode === "signup") toast.success("Conta criada. Confira seu email se necessário.");
    else {
      toast.success("Bem-vindo");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.66 0.2 290 / 0.5), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.16 165 / 0.4), transparent 70%)" }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center">
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight">VisitaIA</span>
        </div>

        <div className="relative space-y-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">v1.0 · Plataforma</p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
              Operação inteligente <br />
              de leads, em <span className="text-primary">tempo real</span>.
            </h1>
            <p className="mt-5 text-base text-muted-foreground max-w-md leading-relaxed">
              Configure sua IA, distribua atendimentos e dispare campanhas — tudo em um painel
              construído para times que não toleram fricção.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg">
            {[
              { icon: Zap, label: "IA configurável", sub: "Prompts por nicho" },
              { icon: Workflow, label: "Rodízio n8n", sub: "Round robin nativo" },
              { icon: ShieldCheck, label: "Multi-tenant", sub: "RLS por user_id" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3.5 backdrop-blur-sm">
                <Icon className="h-4 w-4 text-primary mb-2" />
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} VisitaIA. Todos os direitos reservados.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="h-8 w-8 rounded-lg border border-border bg-elevated flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-primary" />
            </div>
            <span className="text-sm font-semibold">VisitaIA</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              {mode === "signin" ? "Acesse sua conta" : "Crie sua conta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {mode === "signin"
                ? "Continue de onde parou."
                : "Comece grátis em segundos."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Senha</Label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            <Button type="submit" disabled={busy} className="w-full h-10 group">
              {busy ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs">
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
          >
            {mode === "signin" ? (
              <>Não tem conta? <span className="text-foreground font-medium">Cadastre-se</span></>
            ) : (
              <>Já tem conta? <span className="text-foreground font-medium">Entrar</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
