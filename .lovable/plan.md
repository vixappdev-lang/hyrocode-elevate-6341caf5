## 1. Erro do build na Vercel — diagnóstico honesto

O erro `No Output Directory named "public" found` acontece porque **o projeto não é compilado para a Vercel**. O build atual usa `@lovable.dev/vite-tanstack-config`, que internamente acopla o `@cloudflare/vite-plugin` e gera saída no formato **Cloudflare Workers** (`.output/server/...` + assets), não o formato estático/SSR da Vercel (`.vercel/output` ou `public/`).

O `vercel.json` que existe hoje apontando `outputDirectory: ".output/public"` **não resolve** — essa pasta nunca é produzida porque o preset da TanStack Start está fixado em Cloudflare pelo wrapper da Lovable. Não dá pra simplesmente trocar o preset para `vercel` sem quebrar o preview da Lovable (que depende do plugin Cloudflare + `wrangler.jsonc` + `src/server.ts`).

### Caminho recomendado (o que realmente funciona)

**Publicar o site pela própria Lovable e apontar o domínio `hyrocode.online` para a Lovable, não para a Vercel.** A infra da Lovable já roda o build correto (Cloudflare Workers na borda), entrega SSR, sitemap dinâmico, rotas `/api/public/*`, e suporta domínio customizado nativamente. Performance é equivalente ou superior à Vercel para esse stack, sem nenhuma reconfiguração.

Passos (você faz pelo painel, eu não preciso mexer em código):
1. Clicar em **Publish** no topo direito do editor.
2. **Project Settings → Domains → Add custom domain** → `hyrocode.online`.
3. Atualizar os registros DNS no provedor do domínio conforme as instruções mostradas (vai pedir um CNAME / A record apontando pra Lovable em vez da Vercel).
4. Remover o projeto da Vercel (ou deixar parado — não vai mais receber tráfego).

Resultado: site no ar em `hyrocode.online`, com todo o SEO, sitemap, robots e JSON-LD que já estão configurados, **sem o erro de build**.

### Limpeza no repositório

- **Remover `vercel.json`** — está enganando, dá a impressão que o projeto suporta Vercel quando não suporta.
- Manter `wrangler.jsonc`, `src/server.ts` e o resto intacto.

### Por que não "forçar Vercel"?

Para rodar de verdade na Vercel seria necessário:
- Trocar `@lovable.dev/vite-tanstack-config` por config manual da TanStack Start com preset `vercel`.
- Reescrever `src/server.ts` (hoje é wrapper Cloudflare-specific).
- Remover `@cloudflare/vite-plugin` e `wrangler.jsonc`.
- Perder o preview da Lovable (o editor não sabe rodar o preset Vercel).

Ou seja: você ganharia Vercel e **perderia o ambiente de desenvolvimento da Lovable**. Não é uma troca boa. Por isso a recomendação é publicar pela Lovable com domínio customizado.

---

## 2. Menu da Navbar muito estreito

Olhando o `Navbar.tsx` atual: no breakpoint `md` (768px–1024px) já aparecem **logo + 4 links + botão "Iniciar projeto"** dentro de uma pílula `max-w-6xl` com `gap-1` entre links e `px-4` em cada. Em viewports apertados o conteúdo fica espremido contra a logo e o botão.

### Correção (cirúrgica, sem mexer em design)

Em `src/components/site/Navbar.tsx`:
- Subir o breakpoint do menu desktop de `md:flex` para `lg:flex` (mostrar links só a partir de 1024px, abaixo disso usa o menu mobile que já existe e funciona bem).
- Mesma coisa no botão "Iniciar projeto": `md:inline-flex` → `lg:inline-flex`.
- No botão hamburguer: `md:hidden` → `lg:hidden`.
- Adicionar `gap-2` no `<ul>` em vez de `gap-1` e reduzir `px-4` dos links para `px-3` — fica respirado sem aumentar a largura total.
- Adicionar `whitespace-nowrap` nos links para garantir que nunca quebrem linha.

Resultado: em telas médias o usuário vê logo + botão + hamburguer (limpo, sem aperto). A partir de 1024px o menu completo aparece com espaçamento confortável. Identidade visual, cores, glass, logo — nada muda.

---

## Arquivos afetados

- `vercel.json` — deletar
- `src/components/site/Navbar.tsx` — ajuste de breakpoints e espaçamento (≈6 linhas)

Nenhum outro arquivo é tocado. Hero, Pricing, Footer, SEO, sitemap, rotas admin — tudo permanece.
