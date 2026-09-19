# SyncSet — SPEC.md
**Versão:** 1.0 · **Data:** 2026-09-12 · **Estágio:** 0 (uma página)
**Ferramenta de build:** Claude Code
**Fonte:** sintetiza `website-architecture-plan-v1.md`, `DESIGN.md` (Figma), `CONTENT.md`, `00_DECISIONS.md`

> Este documento é a única fonte de verdade técnica para o Claude Code.
> Toda linha de código deve ser rastreável a uma linha deste arquivo.
> Se uma decisão não está aqui, o CC para e pergunta — não assume.

---

## 1. Repositório e ambiente

**🛠 Ferramenta:** Claude Code + GitHub
**Por quê:** CC inicializa, versiona e faz push; GitHub é o registro permanente de cada mudança

```
Repo:        syncset-web (GitHub, público)
Branch main: produção — push só via CC após build passando
Branch dev:  trabalho corrente
Node:        ≥ 20 LTS
Package mgr: npm
```

**Estrutura de pastas (criar na Fase 2 do roadmap):**
```
syncset-web/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   ├── sitemap.xml          ← gerado pelo @astrojs/sitemap
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png  (180×180)
│   ├── og-image.png          (1200×630)
│   └── fonts/
│       ├── PlusJakartaSans-Regular.woff2
│       ├── PlusJakartaSans-Medium.woff2
│       ├── PlusJakartaSans-Bold.woff2
│       └── JetBrainsMono-Regular.woff2
├── src/
│   ├── styles/
│   │   └── tokens.css        ← ÚNICA fonte de cor/tipo/espaço
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Cta.astro          ← botão único, reutilizado em toda ocorrência
│   │   ├── SyncDiagram.astro  ← a peça animada
│   │   └── Faq.astro          ← emite FAQPage schema
│   ├── pages/
│   │   ├── index.astro
│   │   ├── book.astro
│   │   ├── privacy.astro
│   │   └── terms.astro
│   │   └── api/
│   │       └── lead.ts        ← Cloudflare Pages Function
│   └── lib/
│       └── schema.ts          ← geradores de JSON-LD
└── docs/
    ├── DESIGN.md              ← tokens (exportado do Figma)
    ├── CONTENT.md             ← copy final
    └── CLIENT_TEMPLATE.md     ← como reskinar para cliente (Fase 2+)
```

---

## 2. Stack — versões fixas

**🛠 Ferramenta:** Claude Code (instala e configura)
**Por quê:** versões fixas evitam breaking changes silenciosos entre sessões de CC

```json
{
  "astro": "^5.0.0",
  "@astrojs/tailwind": "^5.0.0",
  "@astrojs/sitemap": "^3.0.0",
  "tailwindcss": "^3.4.0",
  "typescript": "^5.4.0"
}
```

**Circuit breaker:** se em 14 dias corridos o Estágio 0 não estiver no ar, migra para Framer sem cerimônia. A decisão de stack não vale mais que o prazo.

---

## 3. Tokens CSS — `src/styles/tokens.css`

**🛠 Ferramenta:** Claude Code (cria o arquivo uma vez; Figma é a fonte de referência)
**Por quê:** token único = mudar uma variável muda o site inteiro, sem caça a hex no código

```css
:root {
  /* Superfícies */
  --paper:    #FBFAF7;
  --surface:  #F2F0EB;
  --rule:     #E2DED6;

  /* Texto */
  --ink:      #101112;
  --graphite: #55585E;

  /* Estados de workflow — NUNCA usar decorativamente */
  --running:  #1F7A5C;   /* "em fase" — único acento permitido por escolha estética */
  --queued:   #A8721A;   /* só quando algo está de fato pendente */
  --failed:   #A32E22;   /* só em erro real de UI */

  /* Tipografia */
  --font-human:  'Plus Jakarta Sans', system-ui, sans-serif;
  --font-system: 'JetBrains Mono', 'Courier New', monospace;

  /* Escala de tipo (base 4px) */
  --text-xs:  0.75rem;   /*  12px */
  --text-sm:  0.875rem;  /*  14px */
  --text-base: 1.125rem; /*  18px — body */
  --text-lg:  1.5rem;    /*  24px — H3 */
  --text-xl:  2.25rem;   /*  36px — H2 */
  --text-2xl: 3.5rem;    /*  56px — H1 */
  --text-3xl: 4rem;      /*  64px — Display (só herói) */

  /* Espaçamento (escala 4px) */
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  /* Layout */
  --max-content: 1280px;
  --gutter:      var(--space-8);   /* 32px mobile */

  /* Movimento */
  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast:   120ms;
  --duration-base:   240ms;
}

@media (min-width: 768px) {
  :root { --gutter: var(--space-16); }  /* 64px tablet+ */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Regra de disciplina (o CC deve seguir, não contornar):**
- Nenhum valor de cor, tipo ou espaço entra no código que não seja uma variável CSS deste arquivo
- `--running` é a única cor que pode aparecer por escolha visual
- `--queued` e `--failed` só aparecem quando algo está de fato naquele estado

---

## 4. Fontes — carregamento

**🛠 Ferramenta:** Claude Code
**Por quê:** auto-hospedagem evita requisição externa, reduz LCP e remove dependência de CDN de terceiro

Baixar de:
- Plus Jakarta Sans: https://www.fontshare.com/fonts/plus-jakarta-sans (baixar `.woff2`, pesos 400/500/700)
- JetBrains Mono: https://www.jetbrains.com/lp/mono/ (baixar `.woff2`, peso 400 apenas)

Colocar em `public/fonts/`. No `BaseLayout.astro`:

```html
<!-- preload dos pesos usados no herói para não bloquear LCP -->
<link rel="preload" href="/fonts/PlusJakartaSans-Bold.woff2"
      as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/PlusJakartaSans-Medium.woff2"
      as="font" type="font/woff2" crossorigin>
```

No `tokens.css`, no topo (antes dos `:root`):
```css
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Medium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Bold.woff2') format('woff2');
  font-weight: 700; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
```

---

## 5. Páginas — rotas do Estágio 0

**🛠 Ferramenta:** Claude Code

| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `index.astro` | Home — 8 seções |
| `/book` | `book.astro` | Cal.com embed + schema |
| `/privacy` | `privacy.astro` | Política de privacidade |
| `/terms` | `terms.astro` | Termos de uso |
| `/api/lead` | `api/lead.ts` | Cloudflare Pages Function |

Rotas do Estágio 1+ não existem no repositório até o gatilho ser atingido. Sem páginas vazias, sem placeholders online.

---

## 6. `BaseLayout.astro` — especificação completa do `<head>`

**🛠 Ferramenta:** Claude Code

```astro
---
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalURL?: string;
}
const {
  title = 'SyncSet — AI Workflow Automation for Australian Business',
  description = 'SyncSet connects the tools your business already uses so no enquiry goes unanswered and no booking gets lost. We build it. You own it.',
  ogImage = '/og-image.png',
  canonicalURL = Astro.url.href,
} = Astro.props;
---
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="canonical" href={canonicalURL}>

  <!-- Open Graph -->
  <meta property="og:title" content={title}>
  <meta property="og:description" content={description}>
  <meta property="og:image" content={ogImage}>
  <meta property="og:url" content={canonicalURL}>
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_AU">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={title}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image" content={ogImage}>

  <!-- Favicons -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon-32.png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Fontes (preload no BaseLayout, @font-face no CSS) -->
  <link rel="preload" href="/fonts/PlusJakartaSans-Bold.woff2"
        as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/PlusJakartaSans-Medium.woff2"
        as="font" type="font/woff2" crossorigin>

  <!-- CSS -->
  <link rel="stylesheet" href="/src/styles/tokens.css">

  <!-- JSON-LD — injetado via slot pelo layout filho -->
  <slot name="schema" />

  <!-- Cloudflare Web Analytics — sem cookie, sem banner -->
  <!-- Token a inserir após deploy no Cloudflare Dashboard -->
  <!-- <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
       data-cf-beacon='{"token": "SEU_TOKEN"}'></script> -->

  <!-- Skip link para acessibilidade -->
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <slot />
</body>
</html>
```

**Skip link CSS (em tokens.css):**
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  background: var(--ink);
  color: var(--paper);
  padding: var(--space-2) var(--space-4);
  border-radius: 4px;
  font-family: var(--font-human);
  font-size: var(--text-sm);
  z-index: 9999;
  transition: top var(--duration-fast);
}
.skip-link:focus { top: var(--space-4); }
```

---

## 7. Componente `<Cta />` — regra de uso

**🛠 Ferramenta:** Claude Code
**Por quê:** CTA único em toda a página — texto nunca varia entre ocorrências

```astro
---
interface Props {
  variant?: 'dark' | 'green';
  subtext?: boolean;
}
const { variant = 'dark', subtext = false } = Astro.props;
---
<div class="cta-wrapper">
  <a href="/book" class={`cta-btn cta-btn--${variant}`}>
    Book a Workflow Audit →
  </a>
  {subtext && (
    <p class="cta-subtext">20 minutes. Free. No commitment.</p>
  )}
</div>
```

Ocorrências na home:
- Header: `<Cta variant="dark" />` — sem subtext
- Hero: `<Cta variant="dark" subtext />` — com subtext
- CTA final: `<Cta variant="green" subtext />` — verde eucalipto

---

## 8. Componente `<SyncDiagram />` — a peça animada

**🛠 Ferramenta:** Claude Code — atenção: este é o maior risco de crédito (ver SPEC item crítico abaixo)
**Por quê:** SVG + CSS puro — zero JS, zero biblioteca, zero risco de INP

**Regras inegociáveis:**
- Anima APENAS `transform` e `opacity`
- Loop de ~6 segundos, contínuo
- Fallback: SVG estático quando `prefers-reduced-motion: reduce`
- Peso total do componente: < 8 KB

**Estrutura do diagrama (dois trilhos):**
```
Trilho A · Entradas              Trilho B · Saídas
────────────────────             ──────────────────────────
missed call    ──┐
WhatsApp DM    ──┼──▶ [SyncSet] ──▶ CRM updated
web form       ──┘              ──▶ SMS sent ──▶ booked
                                ──▶ Notion logged
```

**Sequência de animação (keyframes CSS):**
1. 0–1s: "missed call" aparece (fade in, translateX da esquerda)
2. 1–2s: "WhatsApp DM" e "web form" aparecem em sequência
3. 2–3s: setas se desenham em direção ao nó central [SyncSet]
4. 3–4s: nó [SyncSet] pulsa uma vez (scale 1→1.05→1)
5. 4–5s: saídas aparecem em sequência (CRM, SMS, Notion)
6. 5–6s: fade out geral → loop recomeça

**Rótulos de nó:** JetBrains Mono, 13px, `var(--ink)`
**Nó central [SyncSet]:** fundo `var(--ink)`, texto `var(--paper)`, border-radius 4px, padding 6px 12px
**Conectores (linhas):** `stroke: var(--rule)`, stroke-width 1.5, `stroke-dasharray` animado para efeito de desenho

**SPEC item crítico:** teto de 2 sessões de CC para este componente. Se na segunda sessão não estiver funcionando, congela como SVG estático e segue. O diagrama é diferenciação, não requisito de lançamento.

---

## 9. Componente `<Faq />` — estrutura HTML obrigatória

**🛠 Ferramenta:** Claude Code
**Por quê:** `<details>` nativo = zero JS, visível para crawlers de IA, WCAG nativo

```astro
---
const faqs = [
  {
    q: "Do we need to replace the tools we already use?",
    a: "No. SyncSet works with what you have — WhatsApp, Google Calendar, your existing CRM, whatever you're already running. We connect them. We don't replace them."
  },
  // ... demais perguntas do CONTENT.md
];
---
<section class="faq" aria-labelledby="faq-heading">
  <h2 id="faq-heading" class="faq__title">Common questions</h2>
  <dl class="faq__list">
    {faqs.map((item) => (
      <div class="faq__item">
        <details>
          <summary class="faq__question">{item.q}</summary>
          <div class="faq__answer">
            <p>{item.a}</p>
          </div>
        </details>
      </div>
    ))}
  </dl>
</section>
```

**Schema FAQPage emitido via slot no BaseLayout:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do we need to replace the tools we already use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. SyncSet works with what you have..."
      }
    }
  ]
}
```

---

## 10. Schema JSON-LD — home (`index.astro`)

**🛠 Ferramenta:** Claude Code + validação manual em https://search.google.com/test/rich-results
**Por quê:** grafo de entidades unificado com `@id` consistente = desambiguação da marca "SyncSet" (que colide com termos técnicos de outros ecossistemas)

**Entidades obrigatórias no Estágio 0:**

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.syncset.com.au/#organization",
    "name": "SyncSet",
    "url": "https://www.syncset.com.au",
    "logo": "https://www.syncset.com.au/favicon.svg",
    "description": "AI workflow automation agency. We connect the tools your business already uses so no enquiry goes unanswered.",
    "foundingLocation": {
      "@type": "Place",
      "addressCountry": "AU"
    },
    "areaServed": ["AU", "Worldwide"],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@syncset.com.au",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.linkedin.com/company/syncset"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.syncset.com.au/#localbusiness",
    "name": "SyncSet",
    "url": "https://www.syncset.com.au",
    "address": {
      "@type": "PostalAddress",
      addressCountry: 'AU',
    },
    "areaServed": ["AU", "Worldwide"],
    "priceRange": "A$900–A$2,500",
    "email": "contact@syncset.com.au"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.syncset.com.au/#website",
    "url": "https://www.syncset.com.au",
    "name": "SyncSet",
    "publisher": { "@id": "https://www.syncset.com.au/#organization" }
  }
]
```

**Regra:** todos os `@id` usam o mesmo padrão `/#tipo`. FAQPage schema vai no componente `<Faq />` via slot. Service schema entra no Estágio 1.

---

## 11. Funil de captação — `api/lead.ts`

**🛠 Ferramenta:** Make.com (cenário Make primeiro, CC depois)
**Por quê:** depurar webhook no Make antes de escrever a Function — nunca ao contrário. Falha invisível de webhook é a forma mais rápida de queimar sessão de CC às cegas.

**Sequência obrigatória:**
1. Construir e testar cenário `lead-intake-v1` no Make.com com payload manual
2. Só depois: CC escreve a Pages Function que POSTa no webhook verificado

**Payload que a Function envia ao Make:**
```json
{
  "name": "string",
  "email": "string",
  "business": "string",
  "message": "string",
  "source": "syncset.com.au/home",
  "utm_source": "string | null",
  "utm_medium": "string | null",
  "timestamp": "ISO 8601"
}
```

**O que o Make faz com o payload (cenário `lead-intake-v1`):**
1. Cria lead no Notion CRM (status: New, origem: website)
2. Dispara alerta no Telegram `@Paulo_leads_bot`
3. Envia e-mail de confirmação ao lead em < 60s com link do Cal.com
4. Se não agendou em 24h → 1 follow-up
5. Se não agendou em 72h → 1 follow-up final, depois para
6. Se agendou → atualiza status no Notion + evento no Google Calendar

**Conectores MCP ativos nesta fase:** Notion · Google Calendar · Cloudflare · GitHub — máximo 4.
Não adicionar mais até Estágio 1. Acima de ~6 conexões ativas, seleção de ferramentas do modelo degrada.

**HITL (Human In The Loop) — regra do CLAUDE.md:**
| Ação | Autonomia | Condição para mudar |
|---|---|---|
| Criar lead no Notion | Autônomo | — |
| Alerta no Telegram | Autônomo | — |
| E-mail de confirmação (template fixo) | Autônomo após 20 envios revisados | Começa em modo rascunho |
| Follow-up 24h / 72h | `needs-human-approval` nos 30 primeiros dias | Autônomo se zero incidentes |
| Qualquer e-mail com conteúdo gerado por LLM | `needs-human-approval` sempre | Nunca muda |
| Qualquer ação com preço / contrato | `needs-human-approval` sempre | Nunca muda |

---

## 12. `public/robots.txt`

**🛠 Ferramenta:** Claude Code

```
User-agent: *
Allow: /
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://www.syncset.com.au/sitemap-index.xml
```

⚠️ Após deploy no Cloudflare: verificar nas configurações de segurança se o bloqueio automático de crawlers de IA está ativo e desligar se estiver. O Cloudflare bloqueia alguns crawlers por padrão em certas configurações — isso desliga visibilidade em AEO sem aviso.

---

## 13. `public/llms.txt`

**🛠 Ferramenta:** Claude Code (gera o arquivo) + Hermes (gera o rascunho do conteúdo)
**Por quê:** custo mínimo, downside zero, sinaliza intenção de indexação para motores que o leem

```
# SyncSet

> AI workflow automation for businesses of all sizes. We connect the tools you already use — WhatsApp, CRM, calendar — so enquiries are captured and bookings are confirmed automatically.

## Services

- Workflow automation: connecting existing business tools to eliminate manual re-entry
- CRM integration: syncing customer data across communication channels
- Enquiry capture: automated response and booking from missed calls, DMs, and web forms

## Contact

- Website: https://www.syncset.com.au
- Audit booking: https://www.syncset.com.au/book
- Email: contact@syncset.com.au
- Location: Australia (remote-first, serves AU and internationally)
```

---

## 14. OG Image — `public/og-image.png`

**🛠 Ferramenta:** Hermes (gera o HTML/CSS para captura) → screenshot manual ou Cloudflare OG worker
**Por quê:** imagem estática 1200×630 — não precisa de CC

**Conteúdo:**
- Fundo: `#FBFAF7` (paper)
- Logo mark + wordmark "SyncSet" à esquerda, centralizados verticalmente
- Headline à direita: "Every missed enquiry becomes a booked job." em Plus Jakarta Sans Bold, cor `#101112`
- Rodapé: "syncset.com.au" em 16px, `#55585E`

---

## 15. Orçamento de performance — tetos inegociáveis

**🛠 Ferramenta:** Claude Code (Lighthouse no build) + validação manual antes do deploy

| Métrica | Teto | O que quebra se falhar |
|---|---|---|
| LCP | < 2.0s em 4G | Não publica |
| INP | < 200ms | Não publica |
| CLS | < 0.05 | Não publica |
| JS total na home | < 40 KB comprimido | Não publica |
| Peso total da home | < 400 KB | Não publica |
| Lighthouse Performance | ≥ 95 | Não publica |
| Lighthouse Accessibility | ≥ 95 | Não publica |

Se qualquer teto falhar na auditoria do Dia 12, o deploy não acontece. Sem exceção.

---

## 16. Checklist pré-deploy (Dia 14)

**🛠 Ferramenta:** Claude Code (build + audit) + manual (DNS, Search Console)

- [ ] `npm run build` sem erros ou warnings
- [ ] Lighthouse ≥ 95 em Performance e Accessibility
- [ ] Navegação por teclado: Tab atravessa toda a página, focus visible em todos os elementos interativos
- [ ] `prefers-reduced-motion`: SyncDiagram exibe SVG estático, sem animação
- [ ] FAQ: `<details>` abre e fecha sem JS
- [ ] Formulário: 5 envios de teste produzem 5 leads no Notion + 5 alertas no Telegram + 5 e-mails de confirmação
- [ ] Cal.com: 1 agendamento de teste aparece no Google Calendar
- [ ] JSON-LD válido no Rich Results Test (sem erros — warnings são aceitáveis)
- [ ] `robots.txt` acessível em `/robots.txt`
- [ ] `sitemap.xml` acessível e submetido no Search Console
- [ ] SPF, DKIM e DMARC configurados no domínio (sem isso, e-mails de follow-up caem em spam)
- [ ] SSL ativo no domínio (Cloudflare cuida automaticamente)
- [ ] Cloudflare Analytics coletando (verificar no dashboard)
- [ ] Google Business Profile: site vinculado ao domínio
- [ ] Bloqueio de crawlers de IA da Cloudflare: desligado

---

## 17. O que o Claude Code NÃO decide sozinho

Qualquer coisa abaixo exige aprovação explícita sua antes de executar:

- Mudança em `tokens.css` que altere cor, tipo ou espaçamento
- Qualquer push para a branch `main`
- Qualquer deploy para produção
- Qualquer alteração no payload que vai para o Make/Notion
- Qualquer mudança de copy (o `CONTENT.md` é a fonte — se o CC quiser "melhorar" uma frase, para e pergunta)
- Adição de dependência nova ao `package.json`

---

## Rastreabilidade

| Decisão neste SPEC | Fonte |
|---|---|
| Stack Astro + Cloudflare | `00_DECISIONS.md` W1 |
| Tokens de cor | `DESIGN.md` (Figma, página Design Tokens) |
| Tipografia PJS + JetBrains Mono | `00_DECISIONS.md` W3 (corrigido de Satoshi) |
| Copy de todas as seções | `CONTENT.md` |
| Schema JSON-LD com `@id` unificado | `website-architecture-plan-v1.md` §8.2 |
| Funil Make → Notion → Telegram → Cal.com | `website-architecture-plan-v1.md` §7.1 |
| Tetos de performance | `website-architecture-plan-v1.md` §4.5 |
| HITL rules | `CLAUDE.md` regra 4 + §7.2 do plano de arquitetura |
| Preço na seção 5 | `00_DECISIONS.md` W9 — Council 2026-09-12 |
| robots.txt com crawlers de IA liberados | `website-architecture-plan-v1.md` §8.2 |
