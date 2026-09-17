# PROMPT — SyncSet Web: auditoria profunda + correção até 100%

> **Como usar:** abra o Claude Code em `C:\Users\paulo\syncset-web` e cole TUDO abaixo da linha `===== COPIE A PARTIR DAQUI =====` como a primeira mensagem. Não resuma, não corte — o prompt já carrega as evidências da auditoria e economiza várias horas de redescoberta.

---

===== COPIE A PARTIR DAQUI =====

# PAPEL

Você é um **senior staff engineer** responsável por levar este site de "quase pronto" a **production-grade**. Não é um assistente que sugere: é o engenheiro que audita, decide, corrige, **prova que corrigiu** e assume as consequências. Trate cada afirmação sua como algo que será auditado por outro engenheiro sênior amanhã.

# CONTEXTO DO PROJETO

- **Repo:** `C:\Users\paulo\syncset-web` (Windows, você tem shell completo aqui)
- **Stack:** Astro 5 · `@astrojs/cloudflare` v12 · alvo Cloudflare Pages · `output: 'static'` + adapter
- **Produto:** site de marketing da SyncSet — agência de automação de workflow com IA (Austrália). O único objetivo comercial da página é **converter em "Book a Workflow Audit"** (Cal.com) ou no formulário de contato.
- **Dono:** solo founder, orçamento apertado, sem equipe. Nada de dependência paga nova sem justificar.
- **CSS:** escrito à mão. `src/styles/tokens.css` é a **única** fonte de tokens; `src/styles/v28.css` consome. Não introduza um segundo sistema de tokens.

## Referência visual canônica (o alvo)

A direção visual aprovada é a **V28** — o artifact "SyncSet Visual Direction". O site deve **rodar como ela**, não apenas parecer com ela.

Se você tiver acesso ao artifact, leia-o. Se não tiver, a especificação da V28 que importa está resumida em `PARTE 2` abaixo, e os tokens já estão corretos em `tokens.css`.

---

# REGRAS INEGOCIÁVEIS

Estas regras existem porque já foram violadas neste projeto. Violar de novo é falha grave.

1. **Nunca declare algo corrigido sem verificação própria, ao vivo, do comportamento final.**
   - "O elemento existe no DOM" **não é** verificação. "O build passou" **não é** verificação.
   - Verificação = você executou o fluxo real e observou o resultado real (a request saiu, o status foi 200, o pixel apareceu, a animação rodou).
2. **Nunca confie em relatório de terceiro** (nem em resumo seu de turno anterior). Releia o arquivo, rode o comando, meça.
3. **Toda hipótese de causa-raiz precisa ser testada antes de virar correção.** Se você mediu e a hipótese caiu, **descarte-a por escrito** — não force um fix em cima de um diagnóstico morto.
4. **Uma mudança por vez em código crítico**, com verificação entre elas. Não empilhe 8 edits e rode o build no fim.
5. **Se não conseguir verificar algo, diga explicitamente "NÃO VERIFICADO" e por quê.** Nunca omita, nunca maquie.
6. **Não quebre o que funciona.** Antes de refatorar, registre o comportamento atual.
7. Responda em **português do Brasil**. Identificadores, nomes de arquivo, commits e código em **inglês**.

---

# PARTE 0 — BASELINE (faça antes de tocar em qualquer coisa)

Objetivo: ter um ponto de comparação objetivo. Sem isso você não sabe se melhorou ou piorou.

```bash
git status --short
git log --oneline -10
npm install
npm run build
npm audit --omit=dev
```

Registre em `audit/00-baseline.md`:
- Tamanho de `dist/` total e do maior asset
- Warnings e erros do build (na íntegra, não resumidos)
- Saída do `npm audit`
- Estado do git (branch, arquivos não commitados)

Suba o dev server (`npm run dev`) e **confirme que a home carrega sem erro no console**. Anote todos os erros/warnings do console.

> ⚠️ Se `git status` mostrar trabalho não commitado, **commite ou faça stash antes de começar**. Não misture seu trabalho com alterações anteriores não salvas.

---

# PARTE 1 — BUGS P0 CONFIRMADOS (já auditados; corrija e prove)

Estes quatro foram confirmados por leitura de código. **Não perca tempo redescobrindo — valide e corrija.** Mas valide: se sua medição contradisser o que está escrito aqui, **acredite na sua medição** e documente a divergência.

## P0-1 — `/api/lead` quebra em produção SEMPRE (formulário morto)

**Arquivo:** `src/pages/api/lead.ts`

```ts
const webhookUrl = process.env.MAKE_WEBHOOK_URL;
```

`process.env` **não existe no runtime do Cloudflare Workers**. Sem `nodejs_compat`, isso lança `ReferenceError: process is not defined`, cai no `catch` externo e devolve **500 "Internal server error"** — em toda submissão, mesmo com `MAKE_WEBHOOK_URL` configurada corretamente no painel da Cloudflare. **Este é provavelmente o "botão que não funciona".**

**Correção:** no adapter Cloudflare, as env vars chegam por `locals.runtime.env`.

```ts
export const POST: APIRoute = async ({ request, locals }) => {
  const webhookUrl =
    (locals as any).runtime?.env?.MAKE_WEBHOOK_URL ??
    import.meta.env.MAKE_WEBHOOK_URL;
  // ...
```

**Verificação obrigatória (as duas):**
- `wrangler pages dev ./dist` com `MAKE_WEBHOOK_URL` em `.dev.vars`, POST real em `/api/lead`, **confirmar 200 e confirmar que o payload chegou no Make** (cenário `lead-intake-v1`).
- Um POST com `MAKE_WEBHOOK_URL` ausente deve devolver **500 com `Configuration error`** — e não estourar `ReferenceError`.

Confirme também a tipagem de `locals.runtime` (`@astrojs/cloudflare` expõe `Runtime`; declare em `src/env.d.ts` se necessário) e que `export const prerender = false` continua presente.

## P0-2 — Honeypot é teatro: nunca chega no servidor

**Arquivos:** `src/components/ContactForm.astro` + `src/pages/api/lead.ts`

O campo `company_website` é checado **só no cliente**. O `fetch` envia apenas `name, email, business, message`. Um bot que faça POST direto em `/api/lead` — que é o que bots fazem — passa limpo. **O endpoint público não tem nenhuma proteção anti-spam.**

**Correção:**
- Enviar `company_website` no body do `fetch`.
- No servidor: se preenchido, responder **200 de sucesso falso** sem encaminhar ao Make (não dê feedback ao bot).
- Adicionar um **timestamp de render do formulário**: submissão em menos de ~3s é bot. Rejeitar silenciosamente.

## P0-3 — Sem rate limiting num endpoint que gasta a cota do Make

`/api/lead` é público e encaminha para o webhook do Make. Qualquer pessoa pode fazer flood e **queimar as operations do plano do Paulo**. Isso é custo financeiro direto.

**Correção (escolha a mais simples que funcione e justifique):**
- Cloudflare Rate Limiting Rule no painel (grátis no plano free, sem código) — **prefira esta**, e documente exatamente onde configurar.
- Ou rate limit por IP em memória no Worker (cuidado: isolates não compartilham estado — explique a limitação se escolher).

Verifique também: valide `Content-Type: application/json` e **limite o tamanho do body** (hoje um POST de 10MB é aceito e repassado).

## P0-4 — Preview social quebrado (og:image relativo)

**Arquivo:** `src/layouts/BaseLayout.astro`

```astro
ogImage = '/og-image.png',
...
<meta property="og:image" content={ogImage} />
```

Open Graph exige **URL absoluta**. WhatsApp, LinkedIn e Facebook não renderizam o card. Todo link que o Paulo mandar sai sem imagem.

**Correção:**
```astro
const ogImageURL = new URL(ogImage, Astro.site).href;
```
Mesma coisa para `twitter:image`. E troque `canonicalURL = Astro.url.href` por `new URL(Astro.url.pathname, Astro.site).href` — o atual carrega query strings no canonical.

**Verificação:** buildar e conferir no HTML gerado (`dist/index.html`) que as URLs saem absolutas com `https://www.syncset.com.au`.

---

# PARTE 2 — FIDELIDADE À DIREÇÃO VISUAL V28

Auditoria confirmou que **quatro elementos-assinatura da V28 não existem no site**. Grep em `src/pages/index.astro` + `src/styles/v28.css` retornou zero ocorrências de:

| Elemento V28 | Status no site | O que é |
|---|---|---|
| `.announce` | **ausente** | pill de anúncio no topo do hero ("New — Booking sync is live"), com luz estática na borda superior e shimmer no texto |
| `.h1-shine` | **ausente** | passagem lenta de luz sobre o gradiente prateado do H1 (22s) |
| `.ring` / `.rail` / `.taper` | **ausente** | a luz afilada que percorre a borda da moldura do diagrama de fluxo — o efeito mais característico da V28, feito com `getPointAtLength` + polígono amostrado |
| `.motion-toggle` / `[data-motion]` | **ausente** | botão que liga/desliga movimento |

`.frame--glow` (luz estática na aresta) **existe** e está correto. Não mexa.

## Decisões que você deve tomar (e justificar em uma linha cada)

Não implemente cegamente os quatro. Você é o engenheiro — decida:

1. **`.announce`** — só faz sentido se houver um anúncio real. Se não houver, **não implemente** e diga isso. Não invente notícia falsa para preencher um slot de design.
2. **`.h1-shine`** — barato, alto impacto visual, zero risco. Implemente.
3. **`.ring`/`.rail`/`.taper`** — é o efeito mais caro: JS com `requestAnimationFrame` contínuo + `getPointAtLength` em cada frame. Avalie honestamente o custo em INP/CPU em mobile. Se o custo for real, proponha a versão degradada (ex.: pausar via `IntersectionObserver` quando fora da viewport) em vez de simplesmente cortar. Meça antes de opinar.
4. **`.motion-toggle`** — no artifact ele existia para forçar movimento numa página de review. **Em produção o comportamento correto é respeitar `prefers-reduced-motion` do sistema**, que já está implementado em `v28.css` (4 blocos). Um toggle que dá ao usuário controle explícito é um ganho de acessibilidade — implemente **apenas** se ele respeitar o padrão do sistema como estado inicial. Nunca force `data-motion="force"` como default em produção: isso ignora a preferência declarada do usuário.

## Conferência de tipografia

`BaseLayout.astro` carrega **Instrument Sans + JetBrains Mono do Google Fonts** (correto para a V28), mas `public/fonts/` ainda tem **202KB de Plus Jakarta Sans + JetBrains Mono self-hosted que ninguém referencia**. `public/` é copiado verbatim para `dist/` — esse peso morto está sendo publicado.

**Decisão a tomar:** self-hostar Instrument Sans (elimina render-blocking de terceiro, melhora LCP, remove dependência do Google) **ou** manter Google Fonts com `preconnect` (já existe). Recomendação: **self-hostar** e apagar as fontes não usadas. Se self-hostar, adicione `<link rel="preload" as="font" type="font/woff2" crossorigin>` para o peso usado no hero.

---

# PARTE 3 — AUDITORIA PROFUNDA PRÓPRIA (não confie nesta lista)

A auditoria acima é um ponto de partida, **não um escopo fechado**. O dono do site relatou, sem conseguir localizar: *"configurações de texto, alinhamento, botões que não funcionam"*. Alguns desses podem não estar na lista acima. Encontre-os.

Execute estas varreduras e **reporte achados com arquivo + linha**:

### 3.1 Links e botões — todos
Extraia **todo** `href` e todo handler de clique do site. Para cada um, prove que o destino existe:
- âncoras `#...` → o `id` existe na página?
- rotas internas → a página existe em `src/pages/`?
- externas → responde 200?

Cuidado especial: o artifact V28 usa `href="#book"`, mas o site tem `/book` como **página separada**. Verifique se sobrou alguma âncora apontando para um destino que não existe nesta arquitetura.

### 3.2 Responsividade real
Teste em **360px, 390px, 768px, 1024px, 1440px**. Em cada um:
- há scroll horizontal? (`document.documentElement.scrollWidth > clientWidth`)
- algum texto fica ilegível (< 12px efetivo) ou cortado?
- algum alvo de toque < 44×44px?

> **Bug já corrigido mas NÃO confirmado visualmente:** o SVG do diagrama "How it runs" recebeu `width="1060" height="400"` explícitos porque sem eles o `min-width: 780px` era ignorado no mobile e o diagrama encolhia até ficar ilegível. **Confirme visualmente em 390px que isso está resolvido** (deve haver scroll horizontal *dentro* do container `.flow-scroll`, com o diagrama em tamanho legível).

### 3.3 Acessibilidade
- Navegação completa por teclado (Tab/Shift+Tab/Enter/Esc), foco sempre visível
- Contraste AA em **todo** texto — o tema é escuro, `--muted: #6B7C85` sobre `--ground: #05080A` é o candidato mais provável a falhar
- Hierarquia de headings sem pulos
- Todo `<img>` com `alt` (decorativas com `alt=""`)
- Formulário: labels associados, erros anunciados (`aria-live` já existe — confirme que funciona)

### 3.4 Performance
Lighthouse em **mobile**, home e `/book`. Meta declarada no `BUILD_STATUS.md`: **Performance ≥ 95, Accessibility ≥ 95**. Reporte os números reais. Para cada métrica abaixo da meta, identifique o ofensor específico.

Atenção ao `/book`: o embed do Cal.com carrega um script de terceiro pesado. Considere carregá-lo sob interação ou com `IntersectionObserver`.

### 3.5 SEO / dados estruturados
- Valide os três JSON-LD (Organization, LocalBusiness, WebSite) — `@id` unificado, campos obrigatórios
- `sitemap.xml` e `robots.txt` gerados e acessíveis
- Cada página com `title` e `description` únicos (confira `privacy.astro` e `terms.astro` — páginas de skeleton costumam herdar o default)

### 3.6 Higiene do repositório
Confirmados na auditoria:
- `nul` (42 bytes) na raiz — lixo de redirecionamento `> nul` do Windows. Apagar.
- `src/pages/index.astro.bak-2026-09-14` e `src/styles/v28.css.bak-2026-09-14` — backups dentro de `src/`. Apagar (o git é o backup).
- `Claude outputs/` com `index-NEW.astro` e `v28-NEW.css` — pasta de staging. `v28-NEW.css` já foi integrado (mesmo tamanho do atual). **Antes de apagar, diff `Claude outputs/index-NEW.astro` contra `src/pages/index.astro`** e confirme que não há nada valioso que nunca foi integrado.
- `dist/` está no `.gitignore` mas existe em disco — normal, só confirme que não está commitado.
- **Tailwind está instalado, configurado e integrado (`@astrojs/tailwind` + `tailwind.config.mjs`) mas ZERO classes Tailwind são usadas no projeto.** Isso injeta o preflight do Tailwind globalmente — um reset que pode estar brigando silenciosamente com o CSS escrito à mão (candidato forte para os "problemas de alinhamento e texto" relatados). **Investigue o que o preflight está alterando, e então remova a integração inteira** (`astro.config.mjs`, `package.json`, `tailwind.config.mjs`) se confirmar que é peso morto. Rode o build e compare o CSS gerado antes/depois pixel a pixel.

---

# PARTE 4 — ORDEM DE EXECUÇÃO E PORTÕES

Execute em fases. **Não avance de fase sem o portão anterior fechado.**

| Fase | Escopo | Portão de saída |
|---|---|---|
| 0 | Baseline | `audit/00-baseline.md` escrito, build verde, git limpo |
| 1 | P0-1 a P0-4 | formulário provado end-to-end contra o Make; OG absoluto no HTML buildado |
| 2 | Higiene (3.6) + Tailwind | build verde, **zero diferença visual** antes/depois (comprove com screenshots) |
| 3 | Auditoria própria (3.1–3.5) | `audit/01-findings.md` com todo achado + arquivo/linha + severidade |
| 4 | Correções da fase 3 | cada item com evidência de verificação |
| 5 | Fidelidade V28 (Parte 2) | decisões justificadas; implementados verificados ao vivo |
| 6 | Verificação final | Lighthouse ≥95/95, tabela de evidências completa |

Entre fases, **commite**. Mensagens no imperativo, explicando o *porquê*:

```
fix: read MAKE_WEBHOOK_URL from Cloudflare runtime env

process.env is undefined in the Workers runtime, so every form
submission fell through to the catch block and returned 500 —
the contact form has never worked in production.
```

---

# PARTE 5 — FERRAMENTAS QUE VOCÊ DEVE USAR

Use o que estiver disponível. Se algo não estiver, diga e siga.

- **Subagentes** — rode em paralelo o que é independente: um varrendo acessibilidade, outro links/rotas, outro responsividade. Não serialize trabalho paralelizável.
- **Browser automation / Chrome DevTools MCP / Playwright** — obrigatório para verificação visual e de comportamento. Screenshots nos 5 breakpoints. Sem isso você não tem como cumprir a Regra 1.
- **MCP da Cloudflare** — se conectado, para conferir config de Pages, env vars e regras de rate limiting.
- **MCP do Make.com** — se conectado, para inspecionar o cenário `lead-intake-v1` e confirmar que o lead de teste chegou de verdade.
- **Lighthouse** — via CLI (`npx lighthouse`) ou DevTools. Números reais, não estimativas.
- **`gh` CLI** — estado do repo, push, PR.
- **Skills de engenharia** disponíveis (`code-review`, `debug`, `testing-strategy`, `deploy-checklist`) — use onde fizerem sentido.

---

# PARTE 6 — FORMATO DA ENTREGA

Ao final, entregue **exatamente** isto:

### 1. Tabela de evidências (a parte mais importante)

Uma linha por item corrigido. Sem exceção:

| # | Bug | Arquivo:linha | Causa-raiz | Correção | **Como verifiquei** | Status |
|---|---|---|---|---|---|---|
| 1 | Form 500 em prod | `api/lead.ts:78` | `process.env` não existe no Workers runtime | lê de `locals.runtime.env` | POST real via wrangler → 200; lead apareceu no Make às 14:32 | ✅ VERIFICADO |

`Status` só pode ser: **✅ VERIFICADO** (você observou o comportamento final) ou **⚠️ NÃO VERIFICADO** (com o motivo). Não existe meio-termo, não existe "deve funcionar".

### 2. Hipóteses descartadas
O que você suspeitou, mediu e **descartou**. Esta seção provando que você testou antes de corrigir vale tanto quanto a lista de fixes.

### 3. Lighthouse antes → depois
Números dos 4 eixos, mobile, home e `/book`.

### 4. O que continua aberto
Tudo que não foi resolvido, com o motivo e o que seria preciso para resolver. **Não esconda nada.** Um item aberto declarado é profissionalismo; um item aberto escondido é o que faz alguém ser demitido.

### 5. Checklist de deploy
Passos exatos para publicar na Cloudflare Pages, incluindo as env vars a configurar e onde.

---

# CRITÉRIO DE ACEITE — "100%"

O trabalho só está pronto quando **todos** forem verdadeiros e **provados**:

- [ ] `npm run build` sem erros e sem warnings
- [ ] Formulário de contato entrega lead no Make, provado end-to-end
- [ ] `/api/lead` rejeita spam e não pode ser usado para flood
- [ ] Todo link e botão do site leva a um destino que existe
- [ ] Zero scroll horizontal em 360/390/768/1024/1440
- [ ] Zero erro no console em qualquer página
- [ ] Lighthouse mobile ≥ 95 Performance e ≥ 95 Accessibility
- [ ] Contraste AA em todo texto
- [ ] Site inteiro navegável por teclado com foco visível
- [ ] Preview social renderiza (og:image absoluto)
- [ ] JSON-LD válido no Rich Results Test
- [ ] Repositório limpo, sem lixo, tudo commitado
- [ ] Tabela de evidências completa, sem nenhum "deve funcionar"

---

**Comece pela Parte 0. Não pule o baseline. Reporte ao final de cada fase antes de avançar.**

===== FIM DO PROMPT =====
