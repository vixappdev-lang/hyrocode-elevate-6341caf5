import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Send, ArrowRight } from "lucide-react";

const WHATSAPP_NUMBER = "5527981374542";

export const Route = createFileRoute("/aprovada")({
  head: () => ({
    meta: [
      { title: "Pagamento aprovado — HyroCode" },
      { name: "description", content: "Pagamento confirmado. Conte os detalhes do seu site para começarmos a produção da sua Landing Page." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Pagamento aprovado — HyroCode" },
      { property: "og:description", content: "Seu pedido foi confirmado. Próximo passo: detalhar seu site." },
    ],
  }),
  component: AprovadaPage,
});

type FormState = {
  nome: string;
  segmento: string;
  objetivo: string;
  paginas: string;
  estilo: string;
  cores: string;
  referencias: string;
  conteudo: string;
  prazo: string;
  observacoes: string;
};

const initial: FormState = {
  nome: "",
  segmento: "",
  objetivo: "",
  paginas: "",
  estilo: "",
  cores: "",
  referencias: "",
  conteudo: "",
  prazo: "",
  observacoes: "",
};

function AprovadaPage() {
  const [form, setForm] = useState<FormState>(initial);

  const set = <K extends keyof FormState>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Oi, acabei de comprar a LandingPage, e abaixo está os detalhes do meu site:",
      "",
      `• Nome / Marca: ${form.nome || "—"}`,
      `• Segmento / Nicho: ${form.segmento || "—"}`,
      `• Objetivo principal: ${form.objetivo || "—"}`,
      `• Páginas / seções desejadas: ${form.paginas || "—"}`,
      `• Estilo visual: ${form.estilo || "—"}`,
      `• Cores preferidas: ${form.cores || "—"}`,
      `• Referências (sites/concorrentes): ${form.referencias || "—"}`,
      `• Conteúdo (textos, fotos, logo): ${form.conteudo || "—"}`,
      `• Prazo desejado: ${form.prazo || "—"}`,
      `• Observações: ${form.observacoes || "—"}`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const fields: Array<{ key: keyof FormState; label: string; placeholder: string; type?: "input" | "area" }> = [
    { key: "nome", label: "Nome ou marca", placeholder: "Ex.: HyroCode" },
    { key: "segmento", label: "Segmento / nicho", placeholder: "Ex.: clínica odontológica" },
    { key: "objetivo", label: "Objetivo principal do site", placeholder: "Ex.: gerar leads no WhatsApp" },
    { key: "paginas", label: "Páginas ou seções desejadas", placeholder: "Ex.: hero, serviços, depoimentos, contato", type: "area" },
    { key: "estilo", label: "Estilo visual", placeholder: "Ex.: minimalista, moderno, premium" },
    { key: "cores", label: "Cores preferidas", placeholder: "Ex.: azul escuro e branco" },
    { key: "referencias", label: "Sites de referência", placeholder: "Links de sites que você gosta", type: "area" },
    { key: "conteudo", label: "Conteúdo que já tem pronto", placeholder: "Textos, fotos, logo etc.", type: "area" },
    { key: "prazo", label: "Prazo desejado", placeholder: "Ex.: 10 dias" },
    { key: "observacoes", label: "Observações", placeholder: "Qualquer detalhe extra importante", type: "area" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
            <CheckCircle2 className="size-8 text-primary" strokeWidth={2.2} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Pagamento aprovado!
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Obrigado pela confiança. Seu pedido da Landing Page HyroCode foi confirmado.
            Para começarmos a produção agora, preencha o briefing abaixo — leva menos de
            2 minutos e nos envia direto pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-10 shadow-[var(--shadow-card)]">
          <header className="mb-8">
            <h2 className="font-display text-xl font-semibold sm:text-2xl">
              Descreva o tipo de site que você quer
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quanto mais detalhes, mais rápido entregamos. Campos opcionais podem ficar em branco.
            </p>
          </header>

          <form onSubmit={onSubmit} className="grid gap-5">
            {fields.map((f) => (
              <div key={f.key} className="grid gap-1.5">
                <label htmlFor={f.key} className="text-sm font-medium text-foreground">
                  {f.label}
                </label>
                {f.type === "area" ? (
                  <textarea
                    id={f.key}
                    rows={3}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-[16px] sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <input
                    id={f.key}
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="h-12 w-full rounded-lg border border-input bg-background px-3 text-[16px] sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold tracking-wide text-background transition-transform hover:-translate-y-[1px] sm:h-14 sm:text-base"
            >
              <Send className="size-4" />
              Enviar pelo WhatsApp
              <ArrowRight className="size-4" />
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Ao enviar, abriremos o WhatsApp com a mensagem já formatada.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
