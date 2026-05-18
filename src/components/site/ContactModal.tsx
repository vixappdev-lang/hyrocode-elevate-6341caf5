import { useState, type FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ESTADOS: { uf: string; nome: string }[] = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContactModal({ open, onOpenChange }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    estado: "",
    contato: "",
    descricao: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.estado || !form.contato) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ nome: "", estado: "", contato: "", descricao: "" });
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : handleClose())}>
      <DialogContent className="border-white/[0.08] bg-card sm:max-w-lg">
        {!submitted ? (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-2xl font-semibold text-foreground">
                Vamos conversar sobre seu projeto
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                Preencha o formulário abaixo e nossa equipe entra em contato em
                até 24 horas com uma proposta personalizada.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-2 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nome completo *
                </label>
                <input
                  required
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estado *
                  </label>
                  <Select
                    value={form.estado}
                    onValueChange={(v) => setForm({ ...form, estado: v })}
                  >
                    <SelectTrigger className="w-full rounded-xl border-white/10 bg-background/60 px-4 py-5 text-sm text-foreground transition-colors focus:border-primary/60 focus:ring-0">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 rounded-xl border-white/10 bg-popover">
                      {ESTADOS.map((e) => (
                        <SelectItem
                          key={e.uf}
                          value={e.uf}
                          className="rounded-lg text-sm focus:bg-white/[0.06]"
                        >
                          {e.nome} ({e.uf})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.contato}
                    onChange={(e) => setForm({ ...form, contato: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Descrição (opcional)
                </label>
                <textarea
                  rows={3}
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Conte um pouco sobre seu projeto, objetivos ou dúvidas..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60"
                />
              </div>

              <button
                type="submit"
                className="btn-shine mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold tracking-wide text-background shadow-[var(--shadow-elegant)] transition-all hover:translate-y-[-1px]"
              >
                Enviar solicitação
                <Send className="size-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div
              className="mx-auto flex size-16 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            >
              <CheckCircle2 className="size-8 text-background" strokeWidth={2.4} />
            </div>
            <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">
              Solicitação enviada com sucesso!
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Recebemos seu contato. Em até <span className="text-foreground">24 horas</span> nossa
              equipe falará com você pelo WhatsApp para alinhar todos os detalhes do seu projeto.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="btn-shine mt-7 inline-flex items-center justify-center rounded-full bg-foreground px-7 py-2.5 text-sm font-semibold text-background"
            >
              Fechar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
