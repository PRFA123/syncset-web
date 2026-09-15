# 01 — Findings da auditoria própria (Fase 3, 2026-09-15)

Severidade: **P0** quebra conversão/segurança · **P1** viola meta declarada (Lighthouse ≥95, AA, responsivo) · **P2** qualidade/consistência · **P3** cosmético/dívida.

## 3.1 Links e botões

| # | Achado | Arquivo:linha | Sev |
|---|---|---|---|
| L1 | `href="/book"` (Header, Cta, index CTA final), `/privacy`, `/terms` sem barra final → Cloudflare Pages responde **308** → `/book/` em **todo clique no CTA principal** (medido no wrangler: `/book -> 308 loc=/book/`). | `Header.astro:14`, `Cta.astro:11`, `index.astro:435`, `Footer.astro:11,13` | P2 |
| L2 | Dois e-mails de contato em circulação: `contact@syncset.com.au` (schema, Footer, terms, ContactForm) vs `hello@syncset.com.au` (privacy ×2, `public/llms.txt`). | `privacy.astro:54,69`, `public/llms.txt` | P2 |
| L3 | Nenhum `href="#book"` órfão (grep = 0). Âncoras `/#how-it-works`, `/#pricing`, `#contact` resolvem. Único `<button>` do site (`ContactForm.astro:60`) é `type=submit` com handler. Externos (`cal.com`, `app.cal.com/embed/embed.js`, Google Fonts) → 200. LinkedIn `sameAs` → 999 (bloqueio anti-bot; **não verificado**). | — | ok |
| L4 | `www.syncset.com.au` **não resolve em DNS** (nslookup: non-existent domain; controle `canva.com.au` resolve). O site não está apontado ainda — todos os testes deste relatório são contra build local. | — | info |

## 3.2 Responsividade (medido via iframe same-origin em 360/390/768/1024/1440)

| # | Achado | Arquivo:linha | Sev |
|---|---|---|---|
| R1 | **Zero scroll horizontal** em todas as 5 larguras × 4 páginas (`scrollWidth − clientWidth = 0`). | — | ok |
| R2 | Diagrama "How it runs" em 390px: SVG a 780px dentro de `.flow-scroll` (286px) com scroll **interno**, página sem overflow. Confirma o fix anterior (`width/height` explícitos). Mas labels dos nós ficam a **9.6px efetivos** (13px × 780/1060). | `index.astro:203`, `v28.css:412-417` | P1 |
| R3 | Diagrama do hero (`SyncDiagram.astro`, design pré-V28): labels de 13px num viewBox de 1200 → **10.8px no desktop (1000px), 3.4px em 390px**. Ilegível em qualquer largura. Duplica conceitualmente o "How it runs". | `SyncDiagram.astro:6,13` | P1 |
| R4 | Card "The gap": gráfico de barras com `font-size="9"` num viewBox de 340 → **6.6px em 390px** ("WITHIN 1 HOUR · 37%"). Letras N/E/S/W da bússola: 8.1px. | `index.astro:79`, `v28.css` (`.pl-bearing`) | P1 |
| R5 | Header em ≤760px esconde a nav (`display:none`) e em ≤560px esconde o CTA — **sem menu hambúrguer**. "How it works"/"Pricing" ficam inalcançáveis pelo header no mobile (só por scroll). | `Header.astro:82-92` | P2 |
| R6 | Total de 29 nós `<text>` SVG abaixo de 12px efetivos em 390px (medição por `font-size × escala do viewBox`). | (R2–R4) | — |

## 3.3 Acessibilidade (auditoria estática por agente + verificação própria)

| # | Achado | Arquivo:linha | Sev |
|---|---|---|---|
| A0 | **SMIL não respeita reduced-motion.** `.plate-streaks animateMotion {display:none}` e `.flow-scroll animateMotion {display:none}` não têm efeito — `<animateMotion>` não é elemento renderizado. As 28 animações SMIL (8 bússola + 20 fluxo, `repeatCount="indefinite"`) rodam sempre. WCAG 2.3.3. | `v28.css:380,493`; `index.astro:166-176,245-253` | P1 |
| A1 | Lighthouse `definition-list`: `<dl class="faq__list">` contém `<div><details>` — filhos inválidos para `<dl>`. Única falha de a11y do Lighthouse na home (A11y 96). | `Faq.astro:41-52` | P1 |
| A5 | **Contraste**: `--muted #6B7C85` sobre `--surface #0A1117` = **4.38:1**, sobre `--surface-2` = **4.08:1** (< 4.5). Afeta `.dash-source` (12px), `.plate-copy span` (14.5px), `.book-note` (12.5px) — todos dentro de `.frame`. Sobre `--ground` passa (4.64:1). | `v28.css:272,375,628`; `tokens.css:193` | P1 |
| A6 | Gráfico de barras do card "The gap" tem `aria-hidden="true"` mas carrega dados que não existem em texto ("WITHIN 1 HOUR · 37%" etc.). Leitor de tela não recebe. | `index.astro:78` | P1 |
| A7 | Logos de conectores: `title` no `<div>` + `alt=""` → sem nome acessível para 21 logos. | `index.astro:394-395` | P2 |
| A8 | `SyncDiagram` svg tem `aria-label` sem `role="img"` → AT expõe os `<text>` internos soltos. (Resolvido junto com R3.) | `SyncDiagram.astro:9` | P2 |
| A9 | Form: campos inválidos não recebem `aria-invalid`; ao enviar, o `aria-live` é esvaziado enquanto o botão vira "Sending…" → estado ocupado não é anunciado. | `ContactForm.astro:214-240` | P2 |
| A10 | Verificado limpo: `lang="en-AU"`, sem ids duplicados, skip-link → `#main-content` em todas as páginas, honeypot `aria-hidden`+`tabindex=-1`, sem `onclick` em div/span, contraste do botão accent (4.55–8.0:1) ok, CSS reduced-motion global cobre todas as animações **CSS**. | — | ok |
| A2 | Foco: nenhuma regra `outline:none/0` no projeto (grep = 0) → anel de foco nativo do Chrome permanece em links do header, `<summary>` e footer; só `.btn` e o form têm `:focus-visible` custom. Aceitável para AA; consistência visual é P3. | `v28.css:135`, `Header.astro`, `Faq.astro` | P3 |
| A3 | Alvos de toque: links da nav do header **105×21 / 61×21**, brand 106×29 (< 44px). CTAs `.btn` = 44px ok. | `Header.astro:72` | P2 |
| A4 | `letter-spacing: -1.5% / -1% / -0.5%` em h1/h2/h3 — percentual **não é valor válido** para `letter-spacing`; a declaração é descartada. O tracking negativo pretendido para títulos nunca foi aplicado (só onde `v28.css` define em `em`). | `tokens.css:317,323,329` | P2 |

## 3.4 Performance (Lighthouse 12, mobile, throttling simulado, build de produção via `wrangler pages dev`)

| página | Perf | A11y | BP | SEO | LCP | FCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | **92** | 96 | 100 | 100 | 2.6s | 2.6s | 0ms | 0 |
| `/book/` | **90** | 100 | **79** | 100 | 2.9s | 2.5s | 0ms | 0.081 |

| # | Achado | Sev |
|---|---|---|
| P1 | **Render-blocking**: CSS do Google Fonts (`fonts.googleapis.com/css2?…`) — 926ms estimados na home, é o único ofensor relevante do LCP (elemento LCP = `h1` do hero). CSS próprio 5.3 KB + 2.5 KB (309+159ms). Peso total da home: 96 KB. | P1 |
| P2 | `/book/`: Cal.com embed transfere **1.8 MB** (`third-party-summary`), e `third-party-cookies` derruba Best Practices para 79. CLS 0.081 vem do iframe do Cal redimensionando. | P1 (perf) / aberto (BP) |
| P3 | `public/fonts/` publica 202 KB de Plus Jakarta Sans + JetBrains Mono self-hosted que **nada referencia** (grep `fonts/` em src = 0). Só vira custo se alguém abrir a URL; não afeta LCP. | P2 |
| P4 | Script do Cal.com em `book.astro:89` fica **fora** do `<BaseLayout>` → renderiza depois de `</html>` no `dist/book/index.html` (HTML inválido; o browser reparenta). + `astro check` erro `ts(7022)` em `api.q`. | P2 |

## 3.5 SEO / dados estruturados

| # | Achado | Arquivo:linha | Sev |
|---|---|---|---|
| S1 | JSON-LD: `@id` unificados (`#organization`, `#localbusiness`, `#website`, `publisher` → `#organization`). Sem placeholders. `sitemap-index.xml` → `sitemap-0.xml` com 4 URLs (com barra final, batendo com o Pages). `robots.txt` referencia o sitemap e bloqueia `/api/`. | `schema.ts` | ok |
| S2 | `Organization.logo` aponta para `/favicon.svg`; Google prefere raster ≥112px — existe `/logo-mark.png` (não usado no schema). | `schema.ts` | P3 |
| S3 | `LocalBusiness` sem `telephone` (não há telefone público no site — omissão, não mentira). | `schema.ts` | P3 |
| S4 | `/book/` sem JSON-LD algum (página de conversão principal). | `book.astro` | P3 |
| S5 | Meta description de `/privacy` = 22 chars, `/terms` = 24 chars (guia: 50–160). | `privacy.astro`, `terms.astro` | P2 |
| S6 | `privacy.astro` e `terms.astro` trazem em produção um aviso "⚠️ Note: texto gerado por IA, não revisado por advogado" com lista de pendências jurídicas. Se é intencional, ok; se não, está publicado. | `privacy.astro`, `terms.astro` | decisão do dono |
| S7 | Home usa o title/description **default** do BaseLayout (não passa props). Funciona (único uso do default), mas é frágil. | `index.astro:48` | P3 |

## 3.6 Higiene — resolvido na Fase 2 (`696a2d6`)
`nul`, `.bak`, `Claude outputs/` removidos; Tailwind removido com zero diff (ver `02-tailwind-removal.md`).
