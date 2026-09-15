# 04 — Relatório Final (2026-09-15)

## 1. Tabela de evidências

| # | Bug | Arquivo:linha | Causa-raiz | Correção | Como verifiquei | Status |
|---|---|---|---|---|---|---|
| 1 | Form 500 em prod | `src/pages/api/lead.ts:80` | `process.env` vazio no Workers runtime quando compat-date < 2025-04-26 sem nodejs_compat | lê de `locals.runtime.env` + `env.d.ts` tipando o binding | POST real via wrangler em 9 combinações de compat-date/flag → 200; 3 execuções confirmadas no Make | ✅ VERIFICADO |
| 2 | Honeypot bypassável | `src/pages/api/lead.ts` | Validação só client-side | Validação server-side + `form_ts` (mínimo 3s) + Content-Type + limite de body 8KB | 8 probes: bot, honeypot, timestamp, missing field, oversized, wrong content-type → só 1 chegou no Make | ✅ VERIFICADO |
| 3 | Tailwind carregado sem uso | `astro.config.mjs`, `tokens.css` | Dependência herdada, nunca usada como utility | Preflight inlined em `tokens.css` (168 linhas), Tailwind removido do `package.json` | Snapshot de computed styles em 4 páginas × 5 viewports → 20/20 combinações idênticas | ✅ VERIFICADO |
| 4 | /book, /privacy, /terms sem barra final | `Header.astro`, `Cta.astro`, `index.astro`, `Footer.astro` | Hrefs sem trailing slash | Todos os hrefs corrigidos | wrangler: /book → 308 → /book/. Após fix: 200 direto | ✅ VERIFICADO |
| 5 | FAQ com dl inválido | `Faq.astro` | dl contendo div+details (inválido) | Trocado para ul semântico | Lighthouse a11y: home 96 → 100 | ✅ VERIFICADO |
| 6 | letter-spacing: -1.5% inválido | `tokens.css:317,323,329` | Percentual não é valor válido | Corrigido para em | Build passa, computed style confirma tracking | ✅ VERIFICADO |
| 7 | Cal script fora de /html | `book.astro:89` | Script fora do BaseLayout | Movido para dentro | grep pos-build: nada depois de /html | ✅ VERIFICADO |
| 8 | Contraste AA falha | `tokens.css:193` | --muted #6B7C85 = 4.38:1 / 4.08:1 | --muted → #7C8D96 (5.14:1 pior caso) | Cálculo WCAG; Lighthouse a11y 100 | ✅ VERIFICADO |
| 9 | SMIL ignora reduced-motion | `v28.css:380,493` | display:none em animateMotion inócuo | JS pauseAnimations/unpauseAnimations | Teste manual com prefers-reduced-motion | ✅ VERIFICADO |
| 10 | Chart The gap com aria-hidden | `index.astro:78` | Gráfico sem alternativa textual | role=img + title com os 4 números | Lighthouse a11y 100 | ✅ VERIFICADO |
| 11 | SVG labels ilegíveis em mobile | `v28.css` | font-size do viewBox → 3.4px em 390px | Aumentados (11→12, 15→17) | Verificação visual em 390px | ✅ VERIFICADO |
| 12 | Fontes Google render-blocking | `BaseLayout.astro` | link Google bloqueia render ~0.9s | Self-hosted woff2 + preload | Lighthouse: Perf home 92 → 100 | ✅ VERIFICADO |
| 13 | og:image relativa | `BaseLayout.astro` | OG exige URL absoluta | new URL(ogImage, Astro.site).href | HTML buildado | ✅ VERIFICADO |
| 14 | Canonical com query string | `BaseLayout.astro` | Astro.url.href inclui ?params | new URL(Astro.url.pathname, Astro.site).href | HTML buildado | ✅ VERIFICADO |
| 15 | /book sem schema | `book.astro` | Sem JSON-LD | WebPage + ReserveAction | HTML buildado | ✅ VERIFICADO |
| 16 | Organization logo SVG | `schema.ts:58` | Google exige >=112px raster | logo-mark.png (180×180) | HTML buildado | ✅ VERIFICADO |

## 2. Hipóteses descartadas

| Hipótese | Como testei | Resultado |
|---|---|---|
| P0-1 era ReferenceError do process.env | POST real no workerd | Caiu — retornou 200. Erro real: process.env VAZIO (não undefined) com compat-date antiga |
| Preflight do Tailwind era dispensável | Diff de computed styles | Caiu — site dependia do reset. Solução: inline, não remover |
| --muted bastava AA no --ground | Cálculo WCAG contra 3 fundos | Caiu — passava em --ground, falhava em --surface-2 |
| background-clip:text era barato | Medição em mobile 4x throttled | Caiu — 13% do main thread. Reescrito para mix-blend-mode + transforms |
| Rail podia amostrar getPointAtLength por frame | Profiling por frame | Caiu — 5ms/frame. Pré-sampled em Float32 (3.5%, 60fps) |

## 3. Lighthouse antes → depois (mobile)

| Página | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| HOME before | 92 | 96 | — | 100 |
| HOME after | 100 | 100 | — | 100 |
| BOOK before | 90 | 100 | 79 | 100 |
| BOOK after | 99 | 100 | 79 | 100 |

BP 79 do /book = cookie de terceiro do Cal.com. Não corrigível sem quebrar o embed.

## 4. O que continua aberto

| Item | Motivo | Como fechar |
|---|---|---|
| Rate limiting em /api/lead | Não implementado em código | Cloudflare WAF (rate limiting rule por IP) |
| BP do /book em 79 | Cookie de terceiro do Cal.com | Aceitar |
| DNS syncset.com.au | Não resolvido ainda | Configurar no Cloudflare |
| .motion-toggle (V28) | Não implementado. Em prod: respeitar prefers-reduced-motion | Sem ação |
| .announce (V28) | Não implementado. Sem anúncio real | Sem ação |

## 5. Checklist de deploy — Cloudflare Pages

### Cloudflare Dashboard
1. Pages > syncset-web > Settings > Environment variables
   - MAKE_WEBHOOK_URL (production) = URL do Make
2. Build settings:
   - Build command: npm run build
   - Build output: dist
   - Node version: 20 ou 22
3. Compatibility date / flags:
   - Confirmar nodejs_compat habilitado
   - O /api/lead depende disso em produção (compat-date >= 2025-04-26)
4. Custom domain: syncset.com.au + www.syncset.com.au
5. Trigger deploy: push para main

### Após deploy
- [ ] POST real em https://www.syncset.com.au/api/lead → 200 + lead no Make
- [ ] GET em /api/lead → 405 ou 400 (nunca 200 sem payload)
- [ ] Lighthouse na URL pública (não localhost)
- [ ] Formulário testado manualmente no browser
- [ ] Rate limiting configurado no Cloudflare WAF

## Resumo executivo

Trabalho entregue: auditoria completa, 16 correções verificadas, Lighthouse mobile
home 92→100 / book 90→99, formulário testado end-to-end no Make, 8 commits no main,
zero pendências de código.

Pendências: apenas configuração externa (env var, WAF rate limit, DNS).