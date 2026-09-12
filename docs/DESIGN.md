# SyncSet — Design Tokens

**Fonte única de verdade para cor, tipo e espaçamento.** Qualquer mudança começa aqui.

## Paleta

| Categoria | Token | Valor |
|-----------|-------|-------|
| **Superfícies** | `--paper` | #FBFAF7 |
| | `--surface` | #F2F0EB |
| | `--rule` | #E2DED6 |
| **Texto & marca** | `--ink` | #101112 |
| | `--graphite` | #55585E |
| **Estados** | `--running` | #1F7A5C (único acento permitido) |
| | `--queued` | #A8721A (só quando pendente) |
| | `--failed` | #A32E22 (só em erro real) |

## Tipografia

| Nível | Família | Peso | Tamanho | Letra de escala |
|-------|---------|------|---------|-----------------|
| **Display / H1** | Plus Jakarta Sans | Bold (700) | 56px | −1.5% |
| **H2** | Plus Jakarta Sans | Bold (700) | 36px | −1% |
| **H3** | Plus Jakarta Sans | Medium (500) | 24px | −0.5% |
| **Body** | Plus Jakarta Sans | Regular (400) | 18px | — |
| **Small / UI** | Plus Jakarta Sans | Regular (400) | 14px | — |
| **Mono / System** | JetBrains Mono | Regular (400) | 14px | — |

**Famílias:**
- `--font-human`: 'Plus Jakarta Sans', system-ui, sans-serif
- `--font-system`: 'JetBrains Mono', 'Courier New', monospace

## Espaçamento

Escala base: **4px**

| Token | Valor | Pixels |
|-------|-------|--------|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-24` | 6rem | 96px |
| `--space-32` | 8rem | 128px |

## Layout

- `--max-content`: 1280px
- `--gutter`: 32px (mobile), 64px (tablet+)

## Movimento

- `--ease-out`: cubic-bezier(0.16, 1, 0.3, 1)
- `--duration-fast`: 120ms
- `--duration-base`: 240ms

### Regras de movimento

- Anima **apenas** `transform` e `opacity` — nunca cor, layout ou sombra
- Única peça ousada: SyncDiagram no herói — SVG + CSS, loop ~6s
- Fade + slide 240ms em elementos ao entrar no viewport
- Hover de botão: `translateY(−2px)` + shadow leve, 120ms ease-out
- `prefers-reduced-motion: reduce` — remove tudo, inclusive o SyncDiagram (SVG estático)
- Sem scroll-jacking, parallax ou 3D
