# 03 — Fidelidade V28 (Fase 5, 2026-09-15)

Decisões sobre os quatro elementos-assinatura ausentes + tipografia. O artifact V28 original não está em disco; as implementações seguem a descrição funcional do briefing.

## Decisões

| Elemento | Decisão | Justificativa |
|---|---|---|
| `.announce` | **não implementado** | Não há anúncio real. Slot de design vazio não justifica inventar notícia. |
| `.h1-shine` | **implementado** (`v28.css`, `index.astro:58`) | Ver medição abaixo — a versão óbvia (`background-clip:text` + `background-position` animado) custava ~13% do main thread mobile; a versão final é 100% compositor. |
| `.ring`/`.rail`/`.taper` | **implementado com gate** (`index.astro` script, `v28.css`) | Custo medido aceitável só depois de pré-amostrar o anel; roda apenas com o frame na viewport (`IntersectionObserver`, `rootMargin:40px`) e sem `prefers-reduced-motion`. |
| `.motion-toggle` | **não implementado** | Em produção o estado inicial correto é a preferência do sistema, que já é respeitada (CSS + SMIL pausado + rail desligado). Um toggle exigiria persistir a escolha e sobrepor a preferência — sem pedido explícito, não. |
| Fontes | **self-host** (`public/fonts/*-latin.woff2`, `tokens.css` `@font-face`, preload em `BaseLayout.astro`) | Google Fonts CSS era o único request render-blocking (926ms no LCP mobile). Subsets latin variáveis (30 KB + 31 KB); 202 KB de Plus Jakarta/JetBrains não referenciados apagados. |

## Medições (Chrome headless via CDP, `Emulation.setCPUThrottlingRate 4`, 412×915 @2.6, janela de 3 s com o frame do fluxo centrado)

Script: `railcost.mjs` (scratch, não versionado). Métricas = soma de eventos do trace `devtools.timeline` na janela.

| Cenário | Paint ms | Layout ms | Style ms | Script ms | fps | frames >20ms |
|---|---|---|---|---|---|---|
| rail v1 (`getPointAtLength` ×46 por frame) | 733 | 229 | 338 | 106 | 53.4 | 19 |
| sem rail (controle, mesma página) | 685 | 181 | 301 | 107 | 57.5 | 6 |
| h1-shine v1 (`background-position`) removido | 288 | 174 | 334 | 83 | 58.0 | 7 |
| **final: rail v2 + h1-shine v3** | **233** | **131** | **199** | **71** | **60.3** | **0** |
| final sem rail | 194 | 101 | 172 | 62 | 60.1 | 0 |
| final sem rail e sem shine | 148 | 104 | 108 | 60 | 60.2 | 0 |

- **Rail v1 → v2:** custo de script por frame caiu de **5.08 ms** para **0.017 ms** (medido com 300 chamadas síncronas de `draw()`); a causa era `getPointAtLength` forçando style flush após cada `setAttribute('points')`. v2 pré-amostra o anel a cada 2 px no `ResizeObserver` (≈1 380 pontos + normais em `Float32Array`).
- **Rail v2 custo líquido:** ≈ +40 ms paint, +30 layout, +27 style, +10 script por 3 s ≈ **3.6 % do main thread a 4× throttle**, 60 fps, zero frames lentos.
- **h1-shine v1 → v3:** `background-clip:text` animado repintava o H1 inteiro (≈400 ms paint / 3 s ≈ 13 %). v2 (`::after` + `mix-blend-mode: overlay` + transform) era barato mas visível como faixa cinza sobre o fundo (rejeitada). v3: janela `overflow:hidden` de 22 % deslizando por transform, com cópia branca do texto (`content: attr(data-text)`, `white-space: pre-line`) deslizando ao contrário para manter registro; máscara estática nas bordas. Custo líquido ≈ 46 ms paint + 64 ms style / 3 s ≈ 3.7 %, tudo em compositor. Registro dos glifos verificado visualmente (cópia pintada de vermelho: sobreposição exata).
- **Gate do rail:** frames/s = 0 com a página no topo, 60 com o frame centrado, 0 no rodapé.
- **Reduced motion emulado:** rail 0 frames/s, `points` vazio; SMIL `getCurrentTime` delta 0; `.shine` `animation-duration: 1e-05s`.

## Fontes — verificação

- `document.fonts`: `Instrument Sans 400 700 loaded`, `JetBrains Mono 400 500 loaded`; `document.fonts.check()` true para 400/700 e mono 500.
- Largura de "Workflow audit" a 40 px: 281 / 284 / 288 / 291 px nos pesos 400/500/600/700 → eixo `wght` real, sem bold sintético.
- Nenhum request para `fonts.googleapis.com`/`fonts.gstatic.com`; os dois `.woff2` chegam via `<link rel=preload>` (initiator `link`).
- Subset latin apenas (site em en-AU); `unicode-range` mantido igual ao do Google para fallback correto de glifos fora do subset.
