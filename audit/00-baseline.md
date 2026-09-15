# 00 — Baseline (2026-09-15 10:28)

## Git
- Branch: `main` @ `8407542` (3 commits total; up to date with `origin/main`)
- **Working tree NÃO estava limpo**: 13 arquivos modificados + `wrangler.toml` deletado + 9 untracked
  (todo o port V28 feito por sessões anteriores nunca foi commitado).
- Decisão: commitar o trabalho pré-existente como checkpoint (`chore: checkpoint V28 port`)
  ANTES de tocar em qualquer coisa, excluindo lixo (`nul`, `*.bak-*`, `Claude outputs/`) que
  será tratado na Fase 2.

## Versões
| pkg | instalado | latest |
|---|---|---|
| astro | 5.18.2 | 7.3.2 |
| @astrojs/cloudflare | 12.6.13 | 14.3.1 |
| @astrojs/tailwind | 5.1.5 | — |
| tailwindcss | 3.4.19 | — |
| wrangler | 4.131.1 | — |
| node | 24.19.0 | — |

## `npm run build` — exit 0
Warnings (íntegra, sem cores):
```
[@astrojs/cloudflare] Enabling sessions with Cloudflare KV with the "SESSION" KV binding.
[@astrojs/cloudflare] If you see the error "Invalid binding `SESSION`" in your build output, you need to add the binding to your wrangler config file.
[WARN] [adapter] Cloudflare does not support sharp at runtime. However, you can configure `imageService: "compile"` to optimize images with sharp on prerendered pages during build time.
```
Log completo: `audit/_build-baseline.log`.
Rotas prerenderizadas: `/`, `/book`, `/privacy`, `/terms`. `/api/lead` vai para `_worker.js`.

## `dist/` — 1.1 MB total
| KB | asset |
|---|---|
| 247.7 | `_worker.js/chunks/astro/server_*.mjs` |
| 119.9 | `_worker.js/chunks/render-context_*.mjs` |
| 90.0 | `fonts/JetBrainsMono-Regular.woff2` ← **não referenciado** |
| 67.8 | `_worker.js/chunks/image-endpoint_*.mjs` |
| 66.6 | `og-image.png` |
| 58.9 | `index.html` |
| 36.4 / 36.3 / 35.4 | `fonts/PlusJakartaSans-{Medium,Bold,Regular}.woff2` ← **não referenciados** |
| 20.8 | `_astro/book.*.css` |
| 11.7 | `_astro/index.*.css` |

## `npm audit --omit=dev` — 9 vulnerabilidades (1 critical, 4 high, 2 moderate, 2 low)
| pacote | sev | via |
|---|---|---|
| astro 5.18.2 | **critical** | XSS em `define:vars` (fix só em astro ≥7.2.8); server-island replay |
| sharp (transitivo, @astrojs/cloudflare) | high | libvips/libheif CVEs — **não roda em runtime CF** (build-only) |
| undici (transitivo, @astrojs/cloudflare 12) | high | vários — fix exige @astrojs/cloudflare 14 |
| ws (transitivo) | high | idem |
| miniflare / wrangler | high/moderate | dev-only na prática |
| @astrojs/cloudflare 12.6.13 | moderate | SSRF image-binding-transform |
| @astrojs/tailwind, esbuild | low | dev-only |

Nota: `define:vars` **não é usado** no projeto (`grep -rn define:vars src/` = 0). O XSS crítico
não é explorável aqui. Upgrade Astro 5→7 + cloudflare 12→14 é breaking; fica como item aberto
com recomendação (ver relatório final).

## Dev server (porta 4330; a 4321 já estava ocupada por outro processo, PID 34440)
- `/` — console: só `[vite] connecting/connected`. **Zero erros/warnings.**
- `/book` — idem. Embed Cal.com carrega e renderiza o calendário.
- `/` @ 1448px: `scrollWidth == clientWidth` (sem scroll horizontal no desktop).
