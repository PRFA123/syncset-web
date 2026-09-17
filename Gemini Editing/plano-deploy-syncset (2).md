# Plano de Ação — Deploy SyncSet Web (Cloudflare Workers + Astro 6)

> Gerado em 2026-09-15. Substitui as instruções anteriores de deploy.
> Diagnóstico: 3 causas raiz — (1) output 'static' incompatível com adapter v13
> (worker não gerado / assets em path errado → 404 geral), (2) deploy com
> `-c dist/server/wrangler.json` ignora o wrangler.jsonc da raiz (flags e env
> nunca chegaram à produção), (3) MAKE_WEBHOOK_URL ausente no Worker →
> fetch(undefined) → self-fetch no workers.dev → erro 1042.

## Decisão arquitetural
FICAR em Cloudflare Workers + @astrojs/cloudflare v13 (Pages foi removido no v13).
output: 'hybrid' → home e /book/ pré-renderizadas (assets estáticos), /api/lead
on-demand no worker. Sem run_worker_first (não é necessário: /api/lead não tem
asset correspondente, o worker é invocado naturalmente).

## Arquivos finais

### astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.syncset.com.au',
  integrations: [sitemap()],
  output: 'hybrid',          // ← era 'static' (CAUSA RAIZ #1)
  adapter: cloudflare(),
  vite: { build: { minify: 'esbuild' } },
});

### wrangler.jsonc (raiz — única fonte de verdade)
{
  "name": "syncset-web",
  "main": "./dist/server/entry.mjs",
  "compatibility_date": "2026-09-15",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS"
  },
  "routes": [
    { "pattern": "syncset.com.au/*", "custom_domain": true },
    { "pattern": "www.syncset.com.au/*", "custom_domain": true }
  ]
}
Remover: run_worker_first, main "@astrojs/cloudflare/entrypoints/server",
workers_dev: false.

### /api/lead — guarda
export const prerender = false;
export const GET = () => new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
export const POST = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env ?? {};
  const webhook = env.MAKE_WEBHOOK_URL;
  if (!webhook) {
    return new Response(JSON.stringify({ error: 'MAKE_WEBHOOK_URL not configured' }), { status: 500 });
  }
  // ...fluxo para o Make (honeypot, validação, fetch webhook, resposta 200)
};

## Sequência (não pular etapas)

1. Aplicar os 3 arquivos acima.
2. npm run build → VERIFICAR que existem dist/server/entry.mjs E dist/client/.
   Se não existirem, PARAR. Não deployar.
3. npx wrangler secret put MAKE_WEBHOOK_URL  (colar URL do Make)
4. npx wrangler dev   → testar local:
   curl.exe -s -o NUL -w "%{http_code}" http://localhost:8787/           → 200
   curl.exe -s -o NUL -w "%{http_code}" http://localhost:8787/book/      → 200
   curl.exe -s -o NUL -w "%{http_code}" http://localhost:8787/api/lead   → 405
   POST /api/lead com payload real → lead aparece no Make
5. SOMENTE então: npx wrangler deploy
6. Dashboard (Git integration): Deploy command = npx wrangler deploy
   (ou remover override → auto-detect usa wrangler.jsonc da raiz).
   NODE_VERSION 22 permanece. Build command: npm run build.
7. Testes pós-deploy (domínio real):
   curl.exe -s -o NUL -w "%{http_code}" https://www.syncset.com.au/
   curl.exe -s -o NUL -w "%{http_code}" https://www.syncset.com.au/book/
   curl.exe -s -o NUL -w "%{http_code}" https://www.syncset.com.au/api/lead   (GET → 405)
   POST real → lead no Make
8. WAF: rate limiting no path /api/lead.
9. Commit.

## Critérios de aceite
/ → 200 | /book/ → 200 | GET /api/lead → 405/400 (nunca 200) | POST real → lead no Make

## Anti-padrões que causaram este incidente (não repetir)
- NUNCA deployar com `-c dist/server/wrangler.json` — isso ignora a config da raiz.
- NUNCA iterar em produção sem validar com `npx wrangler dev` antes.
- UMA fonte de verdade por config. Duas configs = duas verdades = 404 misterioso.
- Build verde ≠ rotas servindo. Só vale 200 no curl.
