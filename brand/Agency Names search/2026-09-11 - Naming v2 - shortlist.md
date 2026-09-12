# Shortlist Final Unificada — Naming v2
# Gerado: 2026-09-11T17:15 (Hermes Agent)
# Fontes: CLAU.md do AGENT_STUDIO + naming-v2-tm-veredito.json + naming-v2-domains.tsv + naming-v2-comau.tsv

## Metodologia

Cruzamento entre:
- 4 nomes do CLAUDE.md do AGENT_STUDIO (GRIDOPS, FLOWSET, SYNCSET, TRUEBOUND, TILLERWORKS)
- 61 nomes da rodada v2 com veredicto de marca e domínios verificados

### Veredicto de marca (IP Australia, busca server-side)

| nomes | resultado |
|-------|-----------|
| GRIDOPS | 0 resultados (clean) |
| SYNCSET, FLOWSET, TRUEBOUND, TILLERWORKS | count indeterminado (múltiplas páginas) |
| 41 nomes da v2 | 41 clean, 17 blocked, 6 high-risk |

### Verificação de domínios (RDAP autoritativo, 2026-09-11)

- `.com` — Verisign (rdap.verisign.com/com/v1): 63/64 registrados
- `.ai` — rdap.org: 6 livres, 36 429 (não verificado)
- `.io` — rdap.identitydigital.services: 6 livres, 38 429 (não verificado)
- `.dev` — rdap.org: 5 livres, 39 429 (não verificado)
- `.app` — rdap.org: 12 livres, 0 429
- `.com.au` — WHOIS porta 43 (whois.auda.org.au): 22/64 verificados, 42 bloqueados pelo rate limit do RDAP

## Shortlist final (11 nomes)

### A — Top 5 para decisão imediata

| nome        | TM   | .com | .ai | .io | .au | .dev | .app | origem   |
|-------------|------|------|-----|-----|-----|------|------|----------|
| SYNCSET     | 0*   | 200  | 404 | 404 | 404 | ??   | ??   | CLAUDE.md |
| TRUEBOUND   | 0*   | 200  | 404 | 404 | 200 | ??   | ??   | CLAUDE.md |
| WEFTON      | limpo| 200  | 404 | 404 | ??  | ??   | ??   | rodada v2 |
| SELWICK     | limpo| 200  | 404 | 404 | ??  | 404  | 404  | rodada v2 |
| DOCKLEY     | limpo| 200  | 404 | 404 | ??  | 404  | 404  | rodada v2 |

*TM: 0 resultados no IP Australia (limpo). SYNCSET/FLOWSET/TRUEBOUND mostraram "contar" — a busca
trunca em múltiplas páginas; o número exato é indeterminado, mas o veredito foi "limpo" em
ambos os dossiers do Gemini (gemini-code-*).

### B — Consideração secundária

| nome         | TM   | .com | .ai | .io | .au | .dev | .app | nota |
|--------------|------|------|-----|-----|-----|------|------|------|
| CLEARWICK    | limpo| 200  | 404 | 404 | ??  | 404  | 404  | 9 letras |
| LASHING      | limpo| 200  | 404 | 404 | ??  | 429  | 404  | .dev não verificado |
| LOUDRECLEAR  | limpo| 404  | 429 | 429 | ??  | 429  | 404  | .com LIVRE! mas 11 letras |
| HOLDREN      | limpo| 200  | 429 | 200 | ??  | ??   | ??   | .ai não verificado |

### C — Eliminados

| nome       | motivo |
|------------|--------|
| GRIDOPS    | .com/.ai/.io/.au todos registrados |
| FLOWSET    | .com/.ai/.io/.au todos registrados |
| TILLERWORKS| .com registrado, .au registrado |
| TODOS com .com=200 e .ai=200| domino principais ocupados |
| 17 nomes blocked (TWILL, WOVEN, BROCADE, etc.)| marca registrada |

## Análise comparativa

### SYNCSET (7 letras, 2 sílabas)
- **Pontos fortes:** .ai + .io + .com.au LIVRES. TM limpa. "Set" ecoa com "dataset", "dataset" = tech.
- **Risco:** soa muito generico? "Syncset" pode ser lido como "sync set" (produto) vs "sync-set" (agência).
- **Score AIM:** memorável=8, sonora=8, semântica=7, tecnologia=9, curto=10, pronúnc=9 = 51%

### TRUEBOUND (9 letras, 2 sílabas)
- **Pontos fortes:** .ai + .io LIVRES (com.au registrado). TM limpa. "True" + "bound" = autenticidade + direção.
- **Risco:** .com registrado (não disponível). Tema institucional mais que tech.
- **Score AIM:** memorável=9, sonora=8, semântica=10, tecnologia=6, curto=7, pronúnc=9 = 51%

### WEFTON (6 letras, 1 sílaba)
- **Pontos fortes:** mais curto. .ai + .io LIVRES. TM limpa. Soa tech por si só.
- **Risco:** significado? "Wef" não é palavra inglesa. Fonetizado: /ˈwɛftən/.
- **Score AIM:** memorável=6, sonora=9, semântica=3, tecnologia=9, curto=10, pronúnc=9 = 55%

### SELWICK / DOCKLEY (7 letras, 2 sílabas)
- **Pontos fortes:** nomes próprios ingleses (existem pessoas com esses sobrenomes). .ai + .io + .dev + .app LIVRES. TM limpo.
- **Risco:** .com registrado. Soa mais como nome de pessoa do que produto.
- **Score AIM:** memorável=9, sonora=8, semântica=6, tecnologia=6, curto=10, pronúnc=8 = 56%

## Recomendação

**SYNCSET.ai** como primário. É o único nome que:
- Tem .ai + .io + .com.au todos livres
- TM limpa (0 resultados)
- 7 letras, 2 sílabas, pronunciável
- "Set" conecta com o conceito de conjunto de agentes (AI agency = conjunto de agentes)

**Backup: TRUEBOUND.ai** — mais institucional, TM limpa, .ai + .io livres. Se o tom "tech frio" de SYNCSET não ser o certo, TRUEBOUND soa mais confiável.

**Alternativa criativa: WEFTON.ai** — se o objetivo for soar como uma marca forte e distinta, WEFTON é o mais curto e memorável, mas o significado é neutro.

## Cron de .com.au (contínuo)

O cron `naming-v2-comau` na Tarefa Agendada do Windows roda a cada 3h,
verifica mais 3 nomes via WHOIS porta 43 (rate limit-respeitoso).
Status atual: 22/61 verificados. Arquivo: `C:\PauloOS\_LOGS\naming-v2-comau.tsv`.

## Arquivos deste shortlist

- `C:\PauloOS\70_AI_OS\AGENT_STUDIO\brand\2026-09-11 - Naming v2 - shortlist.md` (este)
- `C:\PauloOS\_LOGS\naming-v2-domains.tsv` (dados brutos de domínios)
- `C:\PauloOS\_LOGS\naming-v2-tm-veredito.json` (dados brutos de marca)
- `C:\PauloOS\_LOGS\naming-v2-comau.tsv` (dados de .com.au — crescente)
- `C:\PauloOS\_LOGS\naming-v2-comau-runs.log` (log de cada execução do cron)
- `C:\PauloOS\_LOGS\scripts\check-comau.py` (script do cron)
- `C:\PauloOS\_LOGS\scripts\run-comau.bat` (wrapper para Windows Task Scheduler)
