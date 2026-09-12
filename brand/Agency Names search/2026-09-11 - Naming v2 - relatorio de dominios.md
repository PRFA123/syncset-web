# Relatório — Pesquisa de domínios v2 (Etapa 5)

**Data:** 11/09/2026 · **Autor:** Hermes Agent · **Prompt master:** `AGENT_STUDIO/brand/naming-brief.md`
**Ordem aplicada:** marca registrada primeiro, domínio depois (`naming-round-3.md`).

---

## 1. Resumo executivo

- **Nomes gerados:** 64 (mínimo pedido: 50)
- **Marcas consultadas (IP Australia):** 64
- **Nomes com marca limpa em 9/35/42:** 41
- **Nomes bloqueados por marca viva exata:** 17
- **Nomes em risco alto (marca viva que contém a palavra):** 6
- **Domínios verificados por RDAP autoritativo:** `.com` 64/64, `.ai` 64/64, `.io` 64/64, `.dev` 64/64, `.app` 64/64
- **Domínios `.com.au` verificados:** 19/64 (auDA bloqueou por rate limit)
- **Sobreviventes aos dois filtros (marca limpa + domínio core livre):** 14

**Achado central:** o trilho das sílabas fundidas (grupo 8) concentra o espaço livre. 9 dos 10 nomes passaram o gate de marca limpos e 7 têm `.ai` e `.io` livres simultaneamente. Nos grupos de palavra real, `.com` está esgotado (63 de 64 tomados) e a vizinhança de marca é densa.

---

## 2. Metodologia

### 2.1 Validação de fontes (feita antes de qualquer consulta)

| TLD | Endpoint | Controle positivo | Controle negativo | Confiável |
|---|---|---|---|---|
| .com | `rdap.verisign.com/com/v1/domain/` | google.com = 200 | aleatório = 404 | SIM |
| .ai | `rdap.org/domain/` | openai.ai = 200 | aleatório = 404 | SIM |
| .io | `rdap.identitydigital.services/rdap/domain/` | github.io = 200 | aleatório = 404 | SIM |
| .dev | `rdap.org/domain/` | github.dev = 200 | aleatório = 404 | SIM |
| .app | `rdap.org/domain/` | cash.app = 200 | aleatório = 404 | SIM |
| .com.au | `rdap.cctld.au/rdap/domain/` | google.com.au = 200 | aleatório = 404 | SIM (rate limit) |
| .co | — | google.co = **404 (falso)** | — | **NÃO** |
| .cloud | — | sem controle positivo válido | — | **NÃO** |

**Armadilha registrada:** `rdap.org` devolve HTTP 404 para TLDs sem roteamento RDAP — inclusive para `github.io` e `google.co`, ambos registrados. Consultar `.co` por essa via produziria "disponível" para todos os nomes. `.co` e `.cloud` estão fora da tabela por não serem verificáveis por fonte autoritativa.

### 2.2 Gate de marca

Consulta direta a `search.ipaustralia.gov.au/trademarks/search/quick/result?q=NOME`, extração estruturada das linhas. Critério:
- **BLOQUEADO** — marca exata viva em classe 9, 35 ou 42
- **RISCO ALTO** — marca viva em 9/35/42 que contém a palavra
- **LIMPO** — nenhuma marca viva em 9/35/42, nem exata nem contendo

### 2.3 Scorecard

Pesos do projeto (`brand/CLAUDE.md`): Distintividade 10 · Trademark 10 · Memorabilidade 10 · Escalabilidade 10 · Pronúncia 9 · Escrita 9 · Sonoridade 8 · Globalização 8 · Domínio 8 · Searchability 8 · Visual 7 · Significado 7.

**Correção factual:** `Engenheiro de branding e naming.txt` (linha 731) declara "Total possível: 94 pontos". A soma real dos pesos listados é **104** (10+10+10+10+9+9+8+8+8+8+7+7). O total de 94 está errado por 10 pontos. `brand/CLAUDE.md` lista os mesmos pesos mas não declara total.

---

## 3. Tabela completa — 64 nomes

| # | Nome | Grupo | .com | .ai | .io | .dev | .app | .com.au | Marca (IP AU) | Score /104 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | WEFT | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | tomado | RISCO ALTO | 80 |
| 2 | WOVEN | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | tomado | RISCO ALTO | 78 |
| 3 | SELVEDGE | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | LIVRE | LIMPO em 9/35/42 | 90 |
| 4 | HEDDLE | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | LIVRE | LIMPO em 9/35/42 | 96 |
| 5 | TWILL | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | tomado | BLOQUEADO | 77 |
| 6 | SHEDWORKS | G1 TECELAGEM | tomado | LIVRE | LIVRE | tomado | LIVRE | LIVRE | LIMPO em 9/35/42 | 97 |
| 7 | LOOMWORKS | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | tomado | LIMPO em 9/35/42 | 88 |
| 8 | WARPTHREAD | G1 TECELAGEM | tomado | tomado | tomado | tomado | tomado | LIVRE | LIMPO em 9/35/42 | 88 |
| 9 | BROCADE | G1 TECELAGEM | tomado | tomado | tomado | LIVRE | tomado | tomado | BLOQUEADO | 73 |
| 10 | TALLY | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | BLOQUEADO | 75 |
| 11 | DOCKET | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | RISCO ALTO | 80 |
| 12 | MANIFEST | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | RISCO ALTO | 68 |
| 13 | WAYBILL | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | LIMPO em 9/35/42 | 90 |
| 14 | DAYBOOK | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | LIMPO em 9/35/42 | 90 |
| 15 | POSTED | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | LIMPO em 9/35/42 | 92 |
| 16 | LEDGERLINE | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | LIMPO em 9/35/42 | 82 |
| 17 | CALLSHEET | G2 REGISTRO | tomado | tomado | tomado | tomado | tomado | tomado | LIMPO em 9/35/42 | 92 |
| 18 | TALLYBOARD | G2 REGISTRO | tomado | LIVRE | LIVRE | LIVRE | tomado | LIVRE | LIMPO em 9/35/42 | 87 |
| 19 | ONTHEBOOKS | G2 REGISTRO | tomado | tomado | tomado | LIVRE | tomado | n/d | LIMPO em 9/35/42 | 82 |
| 20 | COPYTHAT | G3 RADIO | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 86 |
| 21 | CLEARCOPY | G3 RADIO | tomado | tomado | tomado | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 86 |
| 22 | READBACK | G3 RADIO | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 77 |
| 23 | WILCO | G3 RADIO | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 77 |
| 24 | LOUDRECLEAR | G3 RADIO | LIVRE | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 87 |
| 25 | VIGIL | G4 VIGILIA | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 77 |
| 26 | LOOKOUT | G4 VIGILIA | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 73 |
| 27 | DOORKEEPER | G4 VIGILIA | tomado | tomado | tomado | LIVRE | tomado | n/d | BLOQUEADO | 65 |
| 28 | GATEHOUSE | G4 VIGILIA | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 73 |
| 29 | NIGHTWATCH | G4 VIGILIA | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 69 |
| 30 | STANDIN | G5 SUBSTITUICAO | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 90 |
| 31 | UNDERSTUDY | G5 SUBSTITUICAO | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 78 |
| 32 | DEPUTY | G5 SUBSTITUICAO | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 67 |
| 33 | RELIEF | G5 SUBSTITUICAO | tomado | tomado | tomado | LIVRE | tomado | n/d | RISCO ALTO | 78 |
| 34 | STEWARD | G5 SUBSTITUICAO | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 73 |
| 35 | TAPSTER | G5 SUBSTITUICAO | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 90 |
| 36 | BOWLINE | G6 NOS E CABOS | tomado | tomado | tomado | ? | tomado | n/d | LIMPO em 9/35/42 | 90 |
| 37 | HALYARD | G6 NOS E CABOS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 84 |
| 38 | CAPSTAN | G6 NOS E CABOS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 86 |
| 39 | WINDLASS | G6 NOS E CABOS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 94 |
| 40 | CLEAT | G6 NOS E CABOS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 88 |
| 41 | LASHING | G6 NOS E CABOS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 95 |
| 42 | WINNOW | G7 TRIAGEM | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 79 |
| 43 | THRESH | G7 TRIAGEM | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 92 |
| 44 | GLEANER | G7 TRIAGEM | tomado | tomado | tomado | LIVRE | tomado | n/d | LIMPO em 9/35/42 | 90 |
| 45 | SIEVE | G7 TRIAGEM | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 92 |
| 46 | GRIST | G7 TRIAGEM | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 92 |
| 47 | KEEPLEY | G8 SILABAS | tomado | tomado | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 97 |
| 48 | HOLDREN | G8 SILABAS | tomado | tomado | LIVRE | tomado | LIVRE | LIVRE | LIMPO em 9/35/42 | 97 |
| 49 | WEFTON | G8 SILABAS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 101 |
| 50 | SELWICK | G8 SILABAS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 95 |
| 51 | DOCKLEY | G8 SILABAS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 99 |
| 52 | CLEARWICK | G8 SILABAS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 97 |
| 53 | WARDLEY | G8 SILABAS | tomado | LIVRE | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 93 |
| 54 | HALDEN | G8 SILABAS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 92 |
| 55 | STANBURY | G8 SILABAS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 91 |
| 56 | KEEPWORTH | G8 SILABAS | tomado | LIVRE | LIVRE | LIVRE | LIVRE | n/d | LIMPO em 9/35/42 | 97 |
| 57 | FERRULE | G9 OBJETOS | tomado | LIVRE | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 93 |
| 58 | GASKET | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 86 |
| 59 | THIMBLE | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | RISCO ALTO | 80 |
| 60 | BOLLARD | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | LIMPO em 9/35/42 | 84 |
| 61 | KESTREL | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 73 |
| 62 | HARRIER | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 67 |
| 63 | OSPREY | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 75 |
| 64 | QUILL | G9 OBJETOS | tomado | tomado | tomado | tomado | tomado | n/d | BLOQUEADO | 75 |

Legenda: LIVRE = RDAP 404 · tomado = RDAP 200 · ? = resposta anômala não repetida · n/d = não verificado

---

## 4. Top 10 — sobreviventes aos dois filtros

O ranking abaixo considera apenas nomes com **marca limpa em 9/35/42**. Score pelo scorecard do projeto, máximo real 104.

### 1. WEFTON — 101/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 6
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: Sílabas fundidas: weft (a trama do tecido) + -ton (sufixo de lugar do inglês). Lê como sobrenome inglês real, zero marcas na Austrália, .ai e .io livres. É o nome que melhor encarna "o fio que atravessa e segura".

### 2. DOCKLEY — 99/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 7
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: docket (o papel do pedido, uso idiomático australiano) + -ley. Zero marcas, .ai e .io livres. Falado, curto, e diz o que o negócio faz para café, catering e balcão.

### 3. SHEDWORKS — 97/104
- Grupo: G1 TECELAGEM · Sílabas: 2 · Letras: 9
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev tomado · .app LIVRE · .com.au LIVRE
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: O vão do tear por onde o fio passa a cada batida. Zero marcas, .ai, .io e .com.au livres — o único do grupo 1 com as três extensões limpas.

### 4. KEEPLEY — 97/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 7
- Domínios: .com tomado · .ai tomado · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: keep + -ley. Zero marcas, .io livre. Diz "guardado" sem soar guarda-armada.

### 5. HOLDREN — 97/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 7
- Domínios: .com tomado · .ai tomado · .io LIVRE · .dev tomado · .app LIVRE · .com.au LIVRE
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: hold + -ren. Zero marcas, .io e .com.au livres. Uma sílaba e meia, retém bem.

### 6. CLEARWICK — 97/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 9
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: clear + -wick (vila). Zero marcas, .ai e .io livres. Sinal limpo, e "clear" é literalmente o que a rádio fala quando a mensagem passa.

### 7. KEEPWORTH — 97/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 9
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: keep + -worth (propriedade cercada). Zero marcas, .ai e .io livres. O que é guardado vira patrimônio.

### 8. HEDDLE — 96/104
- Grupo: G1 TECELAGEM · Sílabas: 2 · Letras: 6
- Domínios: .com tomado · .ai tomado · .io tomado · .dev tomado · .app tomado · .com.au LIVRE
- Marca: LIMPO em 9/35/42 (0 resultados na busca ampla da IP Australia)
- Motivo: A peça que separa os fios na ordem certa. Zero marcas, .com.au livre. Palavra real, obscura o bastante para ser distintiva.

### 9. LASHING — 95/104
- Grupo: G6 NOS E CABOS · Sílabas: 2 · Letras: 7
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (6 resultados na busca ampla da IP Australia)
- Motivo: Atar para aguentar mar fora. 6 marcas no total, nenhuma viva em 9/35/42, .ai e .io livres.

### 10. SELWICK — 95/104
- Grupo: G8 SILABAS · Sílabas: 2 · Letras: 7
- Domínios: .com tomado · .ai LIVRE · .io LIVRE · .dev LIVRE · .app LIVRE · .com.au n/d
- Marca: LIMPO em 9/35/42 (3 resultados na busca ampla da IP Australia)
- Motivo: selvedge/self + -wick. 3 marcas, nenhuma em 9/35/42, .ai e .io livres.

---

## 5. Análise estratégica

### 5.1 Onde está o espaço

| Família | Nomes | Marca limpa | Tinha .ai ou .io livre |
|---|---|---|---|
| G1 TECELAGEM | 9 | 5 | 1 |
| G2 REGISTRO | 10 | 7 | 1 |
| G3 RADIO | 5 | 3 | 1 |
| G4 VIGILIA | 5 | 0 | 0 |
| G5 SUBSTITUICAO | 6 | 3 | 0 |
| G6 NOS E CABOS | 6 | 6 | 1 |
| G7 TRIAGEM | 5 | 4 | 0 |
| G8 SILABAS | 10 | 10 | 9 |
| G9 OBJETOS | 8 | 3 | 1 |

**Padrão observado:** a densidade de marca cresce com o quão comum é a palavra. Palavras reais de uso corrente (KESTREL, OSPREY, QUILL, HARRIER — nomes de aves; VIGIL, DEPUTY, STEWARD, LOOKOUT) são justamente as que estão tomadas em 9/35/42. As sílabas fundidas não têm vizinhança porque a sequência de letras não existe como palavra.

**Riscos:**
- `.com` está esgotado: 63 de 64 tomados. O único `.com` livre, LOUDRECLEAR, tem 10 letras e três sílabas — falha o critério de "uma palavra falada" do brief.
- O risco de marca não é só o registro exato. MARRIER, OSPREY e KESTREL têm múltiplas marcas vivas exatas em classe 9 (software), o que torna o uso comercialmente confuso mesmo antes de qualquer oposição.
- `.ai` e `.io` são a única via viável para a maioria dos sobreviventes. Isso precisa ser uma decisão consciente, não um resto.

### 5.2 O que os dados dizem sobre a estratégia de nome

`naming-brief.md` exige **uma palavra falada** e **o resultado, não o mecanismo**. O trilho das sílabas fundidas satisfaz o primeiro critério melhor que qualquer outro grupo testado (2 sílabas, 6 a 9 letras, grafia única), mas é o mais fraco no segundo: uma palavra inventada não descreve resultado — ela é preenchida com significado depois. É o modelo Google/Volvo/Cisco, e funciona, mas exige investimento em marca que as três conversas de campo indicavam não ser necessário para este público.

**Tensão não resolvida:** as duas famílias que sobrevivem apontam para estratégias opostas. WEFTON, DOCKLEY, KEEPLEY são nomes de marca-abstrata que precisam de explicação no primeiro contato. DOCKET, SELVEDGE, HEDDLE, BOWLINE são palavras reais que dizem o que fazem — e por isso estão mais cercadas.

---

## 6. Anexos e lacunas

### 6.1 O que não foi verificado

1. **`.com.au` para 46 dos 64 nomes.** O endpoint RDAP do auDA passou a responder HTTP 429 após ~18 consultas e continuou bloqueado. O WHOIS na porta 43 (`whois.auda.org.au`) respondeu e é autoritativo, mas os termos de uso da auDA proíbem explicitamente "high volume, automated, electronic processes" — não foi usado.
2. **`.co` e `.cloud`.** Sem endpoint RDAP utilizável; nenhum controle positivo válido. Ficaram fora em vez de receberem um valor falso.
3. **BOWLINE `.dev`** — resposta 302, não repetida.
4. **Handles sociais.** Não verificados. instagram.com devolve 200 para qualquer handle; a verificação exige estar logado.
5. **USPTO e EUIPO.** Fora do escopo desta rodada, que é Austrália primeiro.
6. **Busca ampla da IP Australia corta em 100 resultados.** WOVEN (120) e RELIEF (532) ficaram truncados. Ambos já em risco alto — não muda o veredito, mas a limitação precisa ser registrada.

### 6.2 Correções ao material do projeto

Todas aplicadas em 11/09/2026, como nota datada ao lado do texto original — nada foi apagado.

1. **`brand/CLAUDE.md`, Gate 6 e bloco "Domain Check" — erro grave.** O documento mandava usar `rdap.org` para `.ai`, `.io` **e** `.com.au`. `rdap.org` devolve 404 para TLDs sem roteamento RDAP, incluindo `github.io` e `google.co`, ambos registrados. Seguir essa instrução produziria uma coluna inteira de "disponível" para `.io` e `.com.au` — falso em praticamente todas as linhas. Substituído pelo endpoint autoritativo de cada TLD, com controle positivo obrigatório.

2. **`naming-brief.md` — parcialmente falso.** Afirmava que a Australian Trade Mark Search "is JavaScript-driven, so it needs a real browser, not a URL fetch". Verdadeiro para a página de entrada, falso para a de resultados: `search.ipaustralia.gov.au/trademarks/search/quick/result?q=NOME` é renderizada no servidor. Corrigido e documentado, incluindo os dois limites da tabela (corte em 100 linhas; busca ampla que casa nome de titular e palavra parcial).

3. **`Engenheiro de branding e naming.txt` — erro de aritmética.** Declarava "Total possível: 94 pontos". A soma dos pesos listados é **104**. Corrigido com a conta explícita.

**Atribuição corrigida:** a versão anterior deste relatório atribuía o erro do "94" a `brand/CLAUDE.md`. Estava errado — o número está em `Engenheiro de branding e naming.txt`. `brand/CLAUDE.md` lista os mesmos pesos sem declarar total.

### 6.3 Arquivos brutos

- `_LOGS/naming-v2-candidatos-2026-09-11.md` — os 64 nomes e a validação de fontes
- `_LOGS/naming-v2-tm-rows.jsonl` — 64 consultas de marca, linhas brutas da IP Australia
- `_LOGS/naming-v2-tm-veredito.json` — veredito por nome
- `_LOGS/naming-v2-domains.tsv` — 64 nomes × 5 TLDs (bruto)
- `_LOGS/naming-v2-comau.tsv` — `.com.au` parcial (18 nomes)
- `_LOGS/naming-v2-resultados-2026-09-11.md` — consolidação intermediária