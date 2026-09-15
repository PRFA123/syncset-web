# 02 — Remoção do Tailwind + higiene (2026-09-15 11:00)

## O que o preflight estava fazendo
`@astrojs/tailwind` injetava o preflight (~6 KB) em toda página, na frente de `tokens.css`.
Zero classes utilitárias em `src/` (grep). O CSS escrito à mão dependia implicitamente de:
`box-sizing:border-box`, margens zeradas em `p/h*/blockquote`, `ul/ol` sem bullets,
`img/svg display:block`, `button/input/textarea font:inherit`, `textarea resize:vertical`.

## Método de verificação (zero diferença visual)
Snapshot de computed styles (42 propriedades + bounding rect) de TODOS os elementos,
4 páginas × 5 larguras (360/390/768/1024/1440, via iframe same-origin), antes e depois.
Helper: `audit/snapshot.js`.

| página | elementos | 360 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|---|
| `/` | 550 | 0 | 0 | 0 | 0 | 0 |
| `/book` | 31 | 0 | 0 | 0 | 0 | 1* |
| `/privacy` | 51 | 0 | 0 | 0 | 0 | 0 |
| `/terms` | 47 | 0 | 0 | 0 | 0 | 0 |

\* iframe do Cal.com: `height 537px -> 536px` — auto-height do embed de terceiro, não CSS do site.

Primeira tentativa (border-color `var(--rule)` em vez do `#e5e7eb` do preflight) deu 487
diferenças de `border-top-color` (invisíveis, `border-width:0`) — igualei ao preflight para o portão.

## Resultado
- CSS por página: 21.3 KB → 16.6 KB (`book.*.css`), sem `--tw-*`.
- `package.json`: −2 deps (`@astrojs/tailwind`, `tailwindcss`); `tailwind.config.mjs` removido.
- Lixo removido: `nul`, `src/pages/index.astro.bak-2026-09-14`, `src/styles/v28.css.bak-2026-09-14`,
  `Claude outputs/` (diff contra `src/` confirmou que o atual é superconjunto).

## Hipótese descartada
"O preflight está brigando com o CSS à mão e causando os problemas de alinhamento/texto":
**não confirmado**. O site foi escrito em cima do preflight e depende dele; remover sem
reset equivalente é que quebraria. Os problemas de texto/alinhamento têm outras causas
(ver `01-findings.md`).
