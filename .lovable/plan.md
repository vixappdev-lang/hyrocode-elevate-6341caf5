## 1. Seção "Nossos Valores" — refinar (sem neon, sem "—")

Editar `src/components/site/Valores.tsx`:

- **Remover as bolinhas azuis com glow/blur** dos cantos (efeito neon que o usuário rejeitou) — tanto do card grande quanto dos cards menores.
- **Remover o glow radial primário** no canto dos cards menores. Trocar por um fundo `bg-card` sólido com **uma borda mais refinada** `border border-white/[0.07]` e um leve highlight superior via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)`.
- Card grande: manter imagem + overlay, mas **escurecer o overlay** (`from-background via-background/92 to-background/55`) e remover a bolinha azul. Substituir por um indicador discreto: linha vertical 2px à esquerda do eyebrow em `bg-primary`.
- **Reescrever os textos sem travessões** "—":
  - Card grande h3: "Designs inteligentes e resultados precisos para sua marca digital." (sem "—")
  - "Nossa missão": "Priorizamos o suporte ao cliente para garantir uma experiência única antes, durante e depois do lançamento." (sem "—")
- Tipografia: títulos `font-display` mantidos, mas reduzir um pouco o tamanho (`lg:text-[30px]` no grande) para um look mais corporativo.
- CTA "Saber mais": trocar o gradiente azul por `bg-foreground text-background` (consistente com botões principais do site) — sem neon.
- Cards menores: alinhar verticalmente o conteúdo ao centro (`justify-center`) para uniformidade visual já que os textos têm tamanhos diferentes.

## 2. Footer — reorganizar completo (estilo Stripe/Linear/Vercel)

Reescrever `src/components/site/Footer.tsx`:

**Estrutura nova (3 colunas equilibradas)**:
```
┌─ MARCA (col-span-5) ─┬─ NAVEGAÇÃO (col-span-3) ─┬─ SOLUÇÕES (col-span-4) ─┐
│ Logo                 │ Início                    │ Sites Premium            │
│ Descrição curta      │ Projetos                  │ Sistemas Web             │
│ Ícones sociais       │ Serviços                  │ SaaS                     │
│                      │ Processo                  │ Dashboards               │
│                      │ Contato                   │ Automação                │
└──────────────────────┴───────────────────────────┴──────────────────────────┘
─────────────── © HyroCode 2026 · Política · Termos ───────────────
```

**Refinamentos**:
- Container `max-w-7xl`, padding **reduzido** `py-14 sm:py-16` (footer mais compacto, não gigante).
- Logo `h-12 md:h-14` (bem menor que o atual `h-16/h-20`).
- Descrição curta: "Estúdio digital especializado em sites premium, sistemas web e experiências de alta conversão." `max-w-xs text-sm`.
- Headings de coluna: `text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/90`.
- Links: `text-sm text-muted-foreground` com hover refinado `hover:text-foreground transition-colors duration-200`. Espaçamento `space-y-3`.
- Ícones sociais: minimalistas `size-9 rounded-full border border-white/[0.06]` (sem fundo glass pesado), hover `border-white/15 text-foreground`.
- **Linha divisória premium suave**: simplificar a atual — manter apenas `bg-white/[0.06]` + um **glow extremamente discreto** central via `bg-gradient-to-r from-transparent via-primary/25 to-transparent` (sem o ponto radial brilhante, sem opacity 70). Bem mais sutil que o atual.
- Barra inferior: `mt-12 pt-6 border-t border-white/[0.04]` com `© 2026 HyroCode` à esquerda e "Política de privacidade · Termos" à direita.

## 3. Navbar — corrigir tamanho da logo

Editar `src/components/site/Navbar.tsx`:

- Trocar `h-28 w-auto sm:h-32` por `h-10 w-auto sm:h-12` na imagem da logo.
- Remover o `-my-4` no anchor (compensação que estava deixando a nav muito alta).
- Resultado: navbar volta ao tamanho compacto original sem distorção pela logo grande.

## 4. Pricing — renomear badge "Mais escolhido"

Editar `src/components/site/Pricing.tsx`:

- Trocar `badge: "Mais escolhido"` por `badge: "Recomendado"` (mais profissional e sóbrio).
- **Alinhar melhor o card "Sistemas & Painéis Sob Medida"** que tem menos features: adicionar `flex flex-col` (já tem) e empurrar o botão CTA para a base com `mt-auto` na classe do botão (em vez de `mt-9` fixo), garantindo que ambos os cards tenham o CTA alinhado na mesma altura mesmo com listas de tamanhos diferentes.

## 5. Formulário do Pricing — envio real de email

O usuário quer que ao clicar "Enviar solicitação" no `ContactModal` o email seja realmente enviado para **hyrocodecontato@gmail.com**, sem abrir o cliente de email do usuário. O formulário já coleta nome, estado, WhatsApp e descrição — **adicionar campo de email do remetente** (obrigatório, validado com Zod).

### Implementação técnica

Como o usuário pediu envio real de email, é necessário backend. **Habilitar Lovable Cloud** (já não está ativo) — isso provisiona Supabase + permite criar a infraestrutura de emails da Lovable.

**Fluxo após Cloud habilitado**:
1. Verificar status do domínio de email com `email_domain--check_email_domain_status`.
2. Como provavelmente não há domínio configurado, mostrar o setup dialog **`<presentation-open-email-setup>`** para o usuário configurar um sender domain (necessário para envio real e profissional).
3. Após configurado, scaffold da infra transacional (`email_domain--setup_email_infra` + `email_domain--scaffold_transactional_email`).
4. Criar template React Email `contact-form.tsx` em `src/lib/email-templates/` com os campos: nome, email do contato, estado, WhatsApp, descrição. Subject: "Novo contato HyroCode — {nome}".
5. Registrar o template no `registry.ts`.
6. Como o formulário é **público** (visitante não autenticado), criar uma rota de servidor pública em `src/routes/api/public/contact.ts` que:
   - Valida o payload com Zod (nome 1-100, email válido, estado 2 chars, whatsapp 10-20, descrição 0-1000).
   - Chama internamente o queue de envio para `hyrocodecontato@gmail.com` usando o template.
   - Retorna 200 com `{ ok: true }`.
7. Atualizar `ContactModal.tsx`:
   - Adicionar campo "Seu email" (input type=email obrigatório).
   - Validação client-side com Zod.
   - On submit: `fetch('/api/public/contact', { method: 'POST', body: JSON.stringify(...) })`.
   - Estado de loading no botão durante o envio.
   - Tratamento de erro (toast/mensagem) se falhar.
   - Tela de sucesso só aparece após resposta OK do servidor.

## Arquivos

**Editar**:
- `src/components/site/Valores.tsx`
- `src/components/site/Footer.tsx`
- `src/components/site/Navbar.tsx`
- `src/components/site/Pricing.tsx`
- `src/components/site/ContactModal.tsx`

**Criar** (após Cloud + email domain setup):
- `src/lib/email-templates/contact-form.tsx`
- Atualização em `src/lib/email-templates/registry.ts`
- `src/routes/api/public/contact.ts`

**Não tocar**: Hero, Proposta, PortfolioSlider, ComoFunciona, tokens em `styles.css`, identidade visual geral.

## Observação importante

A parte do **envio real de email** depende de você (1) aprovar habilitar Lovable Cloud e (2) configurar um domínio de envio (eu te mostro o botão para isso após Cloud ligado). Sem domínio de envio configurado, os emails não saem de verdade. Se preferir começar só pelas partes visuais (Valores, Footer, Navbar, Pricing) e deixar o email para depois, me avisa que já implemento o que dá agora.
