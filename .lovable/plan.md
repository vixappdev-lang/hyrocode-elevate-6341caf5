# Plano de ajustes — HyroCode

## 1. Portfólio — voltar para prints de site (modernos e profissionais)

O usuário não quis o mockup de notebook flutuando. Voltamos para **screenshots de site reais** (como estava antes), mas agora **modernizados**: UI mais limpa, tipografia em português, paleta sóbria, tirando o ar "amador".

Regerar `src/assets/p1-analytics.jpg` … `p6-ecom.jpg` com prompt do tipo:

> "Photorealistic full-screen screenshot of a modern Brazilian [nicho] website homepage in Portuguese, premium minimal UI, elegant typography, generous whitespace, hero section visible with headline + CTA button + product/service photo, clean navigation bar, professional color palette, shot straight-on (not tilted), 16:9, no laptop frame, no browser chrome, just the website canvas, agency-quality design, Awwwards-level"

Nichos:
1. Clínica Odontológica
2. Barbearia
3. Estética & Beleza
4. Studio de Pilates
5. Advocacia
6. Restaurante

`PortfolioSlider.tsx`:
- Cards 100% responsivos:
  - Mobile: `h-[220px] w-[300px]`
  - Tablet: `sm:h-[280px] sm:w-[400px]`
  - Desktop: `lg:h-[320px] lg:w-[480px]`
- Gap: `gap-4 sm:gap-6 lg:gap-8`.
- Fades das bordas: `w-16 sm:w-24 lg:w-32`.
- `object-cover object-top`, borda sutil `border border-white/[0.06]`, `rounded-2xl`.
- Overlay enxuto: **mostrar apenas o nicho/categoria** (ex: "Clínica Odontológica") como eyebrow em `text-primary-glow uppercase tracking-[0.18em]`. Nome do negócio sai do overlay visível e fica só no `alt` da imagem (acessibilidade/SEO). Sem títulos grandes expostos.
- Manter marquee em loop automático.

## 2. Hero — adaptar bem para mobile (390px)

Hoje os 2 cards flutuantes laterais estão `hidden sm:block` (somem no mobile) e o mockup central ocupa altura enorme com muito vazio.

`src/components/site/Hero.tsx`:
- Container do visual: `h-[320px] sm:h-[440px] lg:h-[500px]`.
- Mockup central: `w-[94%] sm:w-[88%]`, padding `p-4 sm:p-7`.
- Browser top bar mantém `hidden sm:flex` na barra de URL.
- Cards flutuantes laterais: passar a aparecer no mobile também, menores:
  - `w-[140px] sm:w-[210px]`
  - Remover `hidden sm:block` → visíveis sempre
  - Reduzir rotação no mobile (`-rotate-3` / `rotate-3`)
  - Reposicionar para não cobrir o centro (top-left e bottom-right com offsets adequados ao container menor)
- Texto e CTAs mantidos (já responsivos).

## 3. Footer — layout 3 colunas estilo exemplo

Inspirado no print do usuário: **logo + descrição + Instagram à esquerda**, **"Suporte" no meio**, **"Empresa" à direita**. Manter paleta da marca (não copiar o vermelho do exemplo).

```text
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]               Suporte           Empresa              │
│  Descrição curta...   Central de ajuda  Início               │
│  [@ Instagram]        FAQ               Portfólio            │
│                       Contato           Como funciona        │
│                                         Preços               │
├──────────────────────────────────────────────────────────────┤
│  Feito com carinho por HyroCode Desenvolvimento · © 2026     │
└──────────────────────────────────────────────────────────────┘
```

`src/components/site/Footer.tsx`:
- Grid: `grid-cols-1 md:grid-cols-3 gap-12 md:gap-16`.
- Coluna 1: logo `h-20 md:h-24`, descrição curta, botão circular do Instagram.
- Coluna 2 "Suporte": Central de ajuda, FAQ, Contato.
- Coluna 3 "Empresa": Início, Portfólio, Como funciona, Preços (âncoras existentes).
- Títulos: `text-sm font-semibold uppercase tracking-[0.14em] text-foreground` (sem cor vermelha).
- Links: `text-sm text-muted-foreground hover:text-foreground transition-colors`.
- Linha inferior: copy centralizada com `border-t border-white/[0.06] pt-6 mt-12`.
- Mobile: empilhado, alinhamento `text-left`, padding `px-6 py-16`.

## 4. Otimização
- Limpar qualquer resíduo de `orb-*` em `styles.css` se ainda existir.
- Manter `loading="lazy"` nos prints, dimensões `width={1280} height={720}` para evitar CLS.

## Arquivos a editar
- `src/components/site/PortfolioSlider.tsx`
- `src/components/site/Hero.tsx`
- `src/components/site/Footer.tsx`

## Assets a regerar (1280×720)
- `src/assets/p1-analytics.jpg` … `p6-ecom.jpg`

## Não mexer
- Navbar, Pricing, ContactModal, Proposta, ComoFunciona, tokens de cor.
