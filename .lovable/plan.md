# Plano de refinamentos HyroCode

## 1. Navbar — logo maior
- Em `src/components/site/Navbar.tsx`: aumentar `img` da logo para `h-16 sm:h-20` (sem alterar padding do nav, mantendo a barra com mesma altura visual graças ao `py-1.5`). Ajustar `py` se necessário só para a logo não estourar o círculo.

## 2. Footer — restaurar versão anterior
- Reabrir `src/components/site/Footer.tsx` e voltar à estrutura anterior (logo + nome HyroCode grande centralizado, descrição "HYROCODE cria soluções personalizadas, modernas e funcionais...", ícone único do Instagram, rodapé "Feito com carinho por HyroCode Desenvolvimento · © 2026"). Garantir que está exportado e usado em `routes/index.tsx`.

## 3. Hero — simplificar e animar
Substituir o mosaico de 3 imagens por **um único visual animado e elegante**:
- Remover imports de `hero-site`, `hero-dashboard-v2`, `hero-mobile` no Hero.
- Criar um "orb" central: uma esfera com gradiente da marca, glow pulsante, anéis orbitais em CSS animados (rotate infinito lento), partículas/pontos sutis. Tudo em CSS/SVG puro — leve, sem imagem. Animação contínua suave (não exagerada).
- Eyebrow chip muda de "Estúdio premium de produto digital" → **"BEM-VINDO À HYROCODE"**.
- H1 muda para: **"Seu negócio merece um site que vende por você."**
- Subtítulo: **"Uma nova proposta de site para você que está com baixa conversão. Adquira hoje mesmo sua landing page ou site institucional com tecnologias de alta conversão e design pensado para gerar resultado real."**

## 4. Portfolio — 6 nichos BR, realista, texto em PT
- Reduzir para 6 projetos com nichos críveis no Brasil:
  1. Clínica Odontológica (Sorriso Bem Estar)
  2. Barbearia (Barbearia Don Lucca)
  3. Estética & Estética Avançada (Lumière Estética)
  4. Studio de Pilates (Core Pilates Studio)
  5. Advocacia (Almeida & Ribeiro Advocacia)
  6. Restaurante (Cantina Bella Massa)
- Regenerar 6 imagens fotorrealistas (`imagegen` premium) de **mockups de sites reais em português brasileiro**, mostrando hero, menus em PT-BR (Início, Serviços, Sobre, Contato), botões "Agendar agora", "Fale conosco". Substituir `p1..p6` (excluir p7 e p8 ou simplesmente não importá-los).
- Manter marquee em loop automático.

## 5. Pricing — ajustes
**Plano 1 — Landing Page Premium (R$ 497 / 12× R$ 49,70):**
Features substituídas por:
- Logotipo feito do zero
- Banners profissionais
- Design personalizado
- Estrutura responsiva
- SEO básico
- Conteúdo visual
- Configuração de domínio
- Garantia de desempenho
- 2 rodadas completas de alterações
- Formulário de captura de leads (opcional)
- Estrutura 100% personalizada

**Plano 2 — Sistemas & Painéis Sob Medida (renomear):**
- Título: **"Sistemas & Painéis Sob Medida"**
- Preço: **"Valor a consultar"** (sem "à vista"/parcelas)
- Descrição: para software, painel administrativo, CRM, dashboards e automações personalizadas.
- Features: Software sob medida · Painel administrativo · CRM personalizado · Integrações com APIs · Banco de dados robusto · Login e permissões · Dashboard com métricas · Escopo personalizado conforme necessidade.
- Botão muda de "QUERO ESSE" para **"Entrar em contato"** e abre **modal** (não link wpp).
- Botão do Plano 1 continua "QUERO ESSE" (link wpp).

## 6. Modal de contato (novo componente)
Criar `src/components/site/ContactModal.tsx` usando `Dialog` do shadcn (já instalado):
- Título: "Vamos conversar sobre seu projeto"
- Descrição: "Preencha o formulário abaixo e nossa equipe entra em contato em até 24 horas."
- Campos:
  - Nome (input texto)
  - Estado (Select com **todos os 27 estados do Brasil** — AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO)
  - WhatsApp / Contato (input com máscara simples)
  - Descrição do projeto (textarea, opcional)
- Botão "Enviar" com shine.
- Ao enviar: troca conteúdo do modal para tela de sucesso — ícone check, título "Solicitação enviada com sucesso!", texto "Recebemos seu contato. Em até 24 horas nossa equipe falará com você pelo WhatsApp." + botão "Fechar".
- Estado interno (`useState`) controla `submitted`. Sem backend — apenas UX (form local). Validação básica obrigatórios.
- `Pricing.tsx` controla `open` do modal e passa ao componente.

## 7. Shine em todos os botões
Aplicar a classe `.btn-shine` em **todos** os CTAs/botões principais:
- Navbar "Iniciar projeto" (já tem) — manter
- Navbar mobile (já tem) — manter
- Hero "Iniciar um projeto" (já tem) — manter
- Hero "Ver portfólio" — **adicionar**
- Pricing "QUERO ESSE" (já tem) — manter
- Pricing "Entrar em contato" — adicionar
- Modal "Enviar" e "Fechar" — adicionar
- Footer (se houver CTA) — adicionar

## Detalhes técnicos
- Não tocar em outras seções (Proposta, ComoFunciona) além do necessário.
- Não mudar tokens do design system; usar utilitários já existentes.
- Animação do orb 100% CSS (`@keyframes` no `styles.css`): `orb-pulse`, `ring-spin-slow`, `ring-spin-reverse`. Performance ok (transform/opacity).
- Estados do Brasil em const array dentro do `ContactModal.tsx`.
- Imagens de portfólio: prompts em português pedindo "realistic browser screenshot of a Brazilian [nicho] website, copy in Brazilian Portuguese, modern design".

## Arquivos
- editar: `Navbar.tsx`, `Hero.tsx`, `Footer.tsx`, `PortfolioSlider.tsx`, `Pricing.tsx`, `styles.css`
- criar: `ContactModal.tsx`
- regenerar: `p1-analytics.jpg` … `p6-ecom.jpg` (renomear conceitualmente, manter nomes de arquivo para evitar refator)
- não usar mais: `p7-health.jpg`, `p8-landing.jpg`, `hero-site.jpg`, `hero-dashboard-v2.jpg`, `hero-mobile.jpg` (deixar no disco, só remover imports)
