# Plano

## 1. Rota admin protegida por token — `/admin/contatos`

Nova rota acessível só com um token (sem login/Supabase Auth, simples e direto).

**Fluxo:**
- Acesso a `/admin/contatos` → se não houver token válido no `localStorage`, mostra tela "Acesso restrito" com campo de senha.
- Usuário digita o token → frontend envia para `POST /api/public/admin-login` que compara com `ADMIN_TOKEN` (secret) em tempo constante e devolve `{ ok: true, token }` se válido.
- Token salvo em `localStorage` (`hyro_admin_token`) e enviado no header `x-admin-token` em todas as chamadas seguintes.
- `GET /api/public/admin-contacts?page=1&pageSize=10` valida o header, consulta `contact_submissions` via `supabaseAdmin` com `range()` e retorna `{ rows, total, page, pageSize }`.

**UI da página (`/admin/contatos`):**
- Header com logo, título "Solicitações" e botão "Sair" (limpa token).
- Lista de cards (1 por solicitação), grid responsivo `md:grid-cols-2`, cada card mostra: nome (título), email + WhatsApp + estado (linha de metadados), descrição (texto), data formatada (rodapé), botão "Abrir WhatsApp" e "Responder por email".
- Paginação inferior: `‹ Anterior  Página X de Y  Próxima ›`, 10 por página.
- Estado vazio elegante quando não há solicitações.
- Loader (skeleton dos cards) e tratamento de erro (token inválido → volta pra tela de login).
- Estilo seguindo o design atual: `bg-card`, `border-white/[0.07]`, `inset` shadow — mesma linguagem da seção Valores. Sem neon.

**Segredo necessário:** `ADMIN_TOKEN` (vou pedir via `add_secret` antes de implementar).

## 2. Presença visual da logo (sem redesenhar)

Inspeção do arquivo `src/assets/hyrocode-logo.png` (1536×1024, bbox 12–1510 × 0–1024): a imagem **já está cropada nas bordas**. O "espaço vazio" que faz a logo parecer pequena é o espaço interno entre símbolo e a palavra "HYROCODE" dentro do próprio PNG — não dá pra remover sem redesenhar (o que você proibiu).

**Solução profissional sem mexer no arquivo:** deixar a logo **transbordar** a altura visual da navbar/footer usando altura maior + margens negativas, mantendo a barra compacta. É a técnica usada por marcas como Apple/Linear quando a logo tem bounding largo.

**Navbar (`src/components/site/Navbar.tsx`):**
- `<img>` muda de `h-10 sm:h-12` para `h-14 sm:h-16 -my-3` dentro do `<a>`.
- `<a>` ganha `flex items-center shrink-0` para não comprimir.
- A nav continua com `py-1` → altura visível da barra inalterada, mas o símbolo da logo cresce ~40% em presença.
- Logo no menu mobile (header dentro do drawer): manter atual.

**Footer (`src/components/site/Footer.tsx`):**
- `<img>` muda de `h-12 md:h-14` para `h-16 md:h-20`.
- Adiciona `-ml-2` para alinhar o símbolo (que tem leve respiro à esquerda no PNG) com a coluna de texto abaixo.
- Resto da coluna MARCA inalterado.

Resultado: logo com mais presença em header e footer, sem alterar cores, tipografia, identidade ou layout das demais seções.

## 3. Link do Instagram → @hyrocode

Em `Footer.tsx`, o `<a>` do ícone Instagram passa de `href="https://instagram.com/"` para `href="https://instagram.com/hyrocode"`.

## Arquivos tocados

- **Editar:** `src/components/site/Navbar.tsx`, `src/components/site/Footer.tsx`
- **Criar:** `src/routes/admin.contatos.tsx`, `src/routes/api/public/admin-login.ts`, `src/routes/api/public/admin-contacts.ts`
- **Não tocar:** Hero, Proposta, PortfolioSlider, ComoFunciona, Pricing, Valores, ContactModal, tokens de tema, logo PNG.

## Pendência antes de implementar

Preciso que você confirme/forneça o `ADMIN_TOKEN` (a senha que vai usar pra entrar em `/admin/contatos`). Posso gerar uma forte automaticamente ou você prefere escolher?
