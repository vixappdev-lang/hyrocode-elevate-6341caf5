
# Plano de refinamento — HyroCode

## 1. Navbar — logo maior
- Aumentar a logo (`hyrocode-logo.png`) de ~28px para ~44–48px de altura.
- Manter a altura do header inalterada (padding vertical reduzido para compensar) — menu não cresce.
- Logo nítida, com tamanho equilibrado em mobile/desktop.

## 2. Hero — substituir mockup do topo
- Remover o "painel app.hyrocode.com" atual.
- Trocar por uma composição visual mais marcante: **mosaico/colagem flutuante** com 3 cards reais (preview de site, dashboard e mobile app) sobrepostos com profundidade, sombras suaves, leve rotação e glow.
- Geração de 3 novos assets (premium quality, fotorealistas de UI real):
  - `hero-site.jpg` — preview de website premium (landing real).
  - `hero-dashboard-v2.jpg` — painel SaaS real.
  - `hero-mobile.jpg` — tela mobile de app.

## 3. Portfólio — realismo, organização e loop automático
- Cabeçalho reorganizado e centralizado:
  - Eyebrow: "Portfólio"
  - Título: "Projetos reais entregues"
  - Descrição: "Confira alguns dos últimos projetos realizados pela HyroCode — sites, sistemas e plataformas construídos do zero para clientes reais."
- Reduzir tamanho dos cards: **240×320 mobile / 280×360 desktop** (hoje 280×420 / 320×480).
- Manter animação em loop **automática contínua** (marquee CSS já presente, garantir suavidade e não pausar no hover do container inteiro — apenas leve slow-down).
- Substituir as 8 imagens por screenshots **fotorealistas de sites/sistemas reais** (premium quality), cada uma com nome de "cliente" plausível:
  - Landing SaaS fintech, dashboard de gestão, e-commerce de moda, app mobile de delivery, site institucional de clínica, plataforma de cursos, CRM imobiliário, landing de agência.
- Cards mostram nome do projeto + categoria curta.

## 4. Nova seção "Qual a Nossa Proposta" (antes do Portfólio)
- Eyebrow: "Nossa proposta"
- Título: "Transformamos ideias em produtos digitais que vendem"
- Descrição persuasiva (3–4 linhas) com gatilhos de autoridade, escassez sutil e resultado.
- Layout centralizado, tipografia grande, fundo com glow sutil.

## 5. Nova seção "Como Funciona" (substitui Process atual visualmente)
- Eyebrow: "Como funciona"
- Título: "Obtenha resultados surpreendentes em apenas 4 etapas simples"
- Subtítulo curto persuasivo.
- 4 cards numerados com ícones (lucide):
  1. **Consulta gratuita** — entendemos sua ideia, objetivos e público.
  2. **Alinhamento** — desenhamos a estratégia, escopo e identidade visual.
  3. **Desenvolvimento** — construímos com tecnologia de ponta e design premium.
  4. **Entrega & Check** — testamos, ajustamos e entregamos pronto para vender.
- Cards com glass, hover sutil, número grande em gradient.

## 6. Nova seção "Quanto Custa" (Pricing)
- Eyebrow: "Investimento"
- Título: "Preço que cabe no seu bolso, resultado que impressiona"
- Subtítulo persuasivo.
- 2 planos lado a lado:
  - **Landing Page Premium** — R$ 497 à vista ou 12× R$ 49,70
    - Logotipo profissional incluso
    - Design 100% personalizado
    - Estrutura totalmente responsiva
    - SEO técnico otimizado
    - Animações premium
    - Hospedagem orientada
    - Entrega em até 7 dias
  - **Painel / Sistema Web** — R$ 697 à vista ou 12× R$ 69,70 *(destacado "Mais escolhido")*
    - Tudo do plano Landing
    - Painel administrativo completo
    - Banco de dados integrado
    - Login e área de usuário
    - Dashboard com métricas
    - Suporte 30 dias
- Botão CTA em cada card: **"QUERO ESSE"** (link mailto/WhatsApp).
- Card destacado com borda gradient e badge.

## 7. Botões com efeito espelho (shine)
- Adicionar utilitário CSS `.btn-shine` em `styles.css` — pseudo-elemento com gradiente diagonal branco translúcido animando automaticamente em loop (a cada ~3s) atravessando o botão.
- Aplicar nos CTAs principais: "Iniciar projeto", "Quero esse" e botões de hero.
- Sem bagunçar layout — overflow-hidden no botão.

## 8. Remoção do CTA final
- Remover por completo a seção `FinalCTA` ("Pronto para construir o próximo produto…").

## 9. Footer reformulado
- Logo + nome HyroCode **centralizados grandes** no topo do footer.
- Descrição abaixo: "A HyroCode cria soluções digitais personalizadas, modernas e funcionais para destacar o seu negócio online — sites, sistemas e experiências que convertem."
- Apenas ícone do **Instagram** (remover GitHub e Twitter).
- Linha inferior centralizada: "Feito com carinho por HyroCode Desenvolvimento · © 2026"

## 10. Ordem final das seções
1. Navbar
2. Hero (mosaico novo)
3. Nossa Proposta
4. Portfólio (loop automático, cards menores)
5. Como Funciona (4 etapas)
6. Quanto Custa (Pricing)
7. Footer (logo centralizada + Instagram)

---

## Detalhes técnicos

**Arquivos a criar:**
- `src/components/site/Proposta.tsx`
- `src/components/site/ComoFunciona.tsx` (substitui Process)
- `src/components/site/Pricing.tsx`
- 3 imagens hero: `hero-site.jpg`, `hero-dashboard-v2.jpg`, `hero-mobile.jpg`
- 8 imagens novas de portfólio (sobrescrevem as atuais)

**Arquivos a editar:**
- `src/components/site/Navbar.tsx` — logo maior
- `src/components/site/Hero.tsx` — novo mosaico + botão com shine
- `src/components/site/PortfolioSlider.tsx` — cabeçalho reorganizado, cards menores, novos dados
- `src/components/site/Footer.tsx` — logo grande, descrição, só Instagram
- `src/routes/index.tsx` — nova ordem, remover FinalCTA, adicionar Proposta/Pricing
- `src/styles.css` — utility `.btn-shine` com keyframe

**Arquivos a deletar:**
- `src/components/site/FinalCTA.tsx`
- `src/components/site/Process.tsx` (substituído por ComoFunciona)

**Logo:** será reutilizada do arquivo já enviado (`src/assets/hyrocode-logo.png`) — nunca recriada.
