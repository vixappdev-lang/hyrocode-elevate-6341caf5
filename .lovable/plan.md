# Portfólio — cards em retrato + imagens realistas

## 1. Regerar as 6 imagens em formato retrato (mobile/tablet view)

Como os cards vão ficar verticais (retrato), as imagens precisam ser **screenshots de sites na vista mobile/tablet** (formato 3:4 ou 9:16) para preencher bem o card sem corte estranho.

Dimensões: **768×1024** (proporção 3:4, retrato).

Prompt base (modelo `standard`):
> "Flat website screenshot in MOBILE/TABLET portrait view, edge to edge, NO phone frame, NO laptop, NO browser chrome, NO device mockup — just the website canvas filling the whole image vertically. Modern Brazilian [NICHO] website homepage in Brazilian Portuguese, premium design, [PALETA], elegant headline visible, CTA button, hero photography, vertical scroll layout with hero section + a glimpse of the next section. Awwwards quality, realistic, professional."

Nichos + ajustes:
1. **Clínica Odontológica** — paleta branco/menta, headline "Cuidamos do seu sorriso", CTA "Agendar consulta", foto de paciente sorrindo.
2. **Barbearia** — fundo escuro + acentos cobre, headline "Estilo que marca", CTA "Agendar horário", foto barbeiro/cliente.
3. **Estética & Beleza** — bege/rosé, headline "Sua beleza em primeiro lugar", CTA "Agendar avaliação", foto modelo skincare.
4. **Studio de Pilates** — sage/cream, headline "Movimento que transforma", CTA "Aula experimental", foto pilates reformer.
5. **Advocacia** — navy/dourado, headline "Defendemos seus direitos", CTA "Consultoria", foto advogado.
6. **Restaurante italiano** — terracota/creme, headline "Sabores que contam histórias", CTA "Reservar mesa", foto prato de massa.

Arquivos sobrescritos:
- `src/assets/p1-analytics.jpg` … `p6-ecom.jpg`

## 2. Cards do PortfolioSlider — formato retrato 100% responsivo

Atualizar `src/components/site/PortfolioSlider.tsx`:

- Trocar dimensões para **retrato** (proporção ~3:4):
  - Mobile (390px): `w-[200px] h-[280px]`
  - Tablet: `sm:w-[240px] sm:h-[340px]`
  - Desktop: `lg:w-[280px] lg:h-[400px]`
- Gap entre cards: `gap-4 sm:gap-5 lg:gap-6` (mais cards visíveis simultaneamente já que ficam estreitos).
- `object-cover object-top` continua, mostrando o topo da página vertical.
- Border radius `rounded-2xl`, borda sutil `border border-white/[0.06]`.
- Hover: `-translate-y-1`, glow leve já implementado.
- Overlay base: apenas o nicho (categoria) como eyebrow em primary-glow, sem nome do negócio exposto (igual já está).
- Marquee em loop automático mantido.
- Fades laterais: `w-12 sm:w-20 lg:w-28` (ajustados ao novo card mais estreito).
- Atributos da `<img>`: atualizar `width={768} height={1024}` para refletir a nova proporção e evitar CLS.

## 3. Não mexer
- Hero, Footer, Navbar, Pricing, ContactModal, Proposta, ComoFunciona, tokens.

## Arquivos a editar
- `src/components/site/PortfolioSlider.tsx`

## Assets a regerar (768×1024 retrato)
- `src/assets/p1-analytics.jpg`
- `src/assets/p2-crm.jpg`
- `src/assets/p3-billing.jpg`
- `src/assets/p4-fintech.jpg`
- `src/assets/p5-projects.jpg`
- `src/assets/p6-ecom.jpg`
