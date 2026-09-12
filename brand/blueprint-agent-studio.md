# Blueprint — Agent Studio (empresa de agentes operada por um fundador solo)

> Versão otimizada para execução real no **Claude Code**, com camada de plataformas complementares.
> Identificadores de arquivo/agente em inglês (convenção de código). Texto em português.

---

## NOTA DE ROTA (leia antes de construir)

Esta arquitetura é **infraestrutura, não receita**. Ela não gera um dólar até existir um cliente.
Duas travas embutidas no design, e elas são parte do blueprint, não um conselho solto:

1. **Timebox da Fase 1: 3 sessões de trabalho.** Se ao fim da terceira você não tiver nome, direção visual e voz aprovados, você não está construindo marca — está estudando construção de marca. Corte e siga.
2. **Fase 2 só abre com dinheiro na conta.** Nenhum agente de vendas, entrega ou financeiro entra no repositório antes do primeiro cliente pagante. Essa regra vive no `NORTH_STAR.md` e o CEO Agent é instruído a recusar pedidos que a violem — inclusive os seus.

---

## PARTE 1 — Arquitetura Organizacional

### Organograma

```
                    ┌──────────────────────────────┐
                    │      CEO AGENT               │
                    │  (sessão principal do        │
                    │   Claude Code — não é        │
                    │   um subagente)              │
                    └──────────────┬───────────────┘
                                   │ delega via Task
        ┌──────────────────┬───────┴────────┬──────────────────┐
        │                  │                │                  │
┌───────▼────────┐ ┌───────▼───────┐ ┌──────▼────────┐ ┌───────▼────────┐
│ brand-         │ │ visual-       │ │ brand-voice   │ │ council        │
│ strategist     │ │ identity      │ │               │ │ (portão de     │
│                │ │               │ │               │ │  decisão)      │
└────────────────┘ └───────────────┘ └───────────────┘ └────────────────┘
         └──────── FASE 1 — SQUAD DE BRANDING ────────┘    transversal

─ ─ ─ ─ ─ ─ ─ ─ FASE 2 (não construir agora) ─ ─ ─ ─ ─ ─ ─ ─
sales-agent · delivery-agent · finance-agent · qa-auditor
```

**Decisão-chave 1 — o CEO Agent é a sessão principal, não um subagente.**
No Claude Code, subagentes rodam em contexto isolado e devolvem só um resumo. Um orquestrador precisa do contexto acumulado da sessão para reconciliar trabalho. Transformar o CEO em subagente quebra exatamente a função dele. O CEO vive no `CLAUDE.md`, que carrega automaticamente a cada sessão.

**Decisão-chave 2 — 4 agentes no build inicial, e um deles é um portão, não um executor.**
Marca antes de vendas: não existe o que vender enquanto não existe quem está vendendo.

**Decisão-chave 3 — o Council é um único subagente que roda 5 vozes internamente**, não 5 subagentes. Cinco subagentes custam 5 contextos e 5 rodadas para produzir um parágrafo de síntese. Teatro caro.

---

### CEO Agent (orquestrador — sessão principal)

| Campo | Definição |
|---|---|
| **Missão** | Garantir que todo agente trabalhe alinhado ao North Star, delegar, reconciliar e ser o único ponto de escalação para você. |
| **Trigger** | Abertura de qualquer sessão do Claude Code na pasta do projeto. |
| **Inputs** | `CLAUDE.md`, `memory/NORTH_STAR.md`, `memory/BRAND.md`, `tasks/` |
| **Outputs** | Novos arquivos em `tasks/`, atualização de `memory/AGENT_LOG.md`, resumo de status para você |
| **Ferramentas** | Read, Write, Edit, Glob, Grep, Task (nativas do Claude Code) |
| **Autonomia** | Autônomo para delegar e reconciliar. `needs-human-approval` para tudo listado em `memory/COUNCIL.md` |
| **Escala para** | Você (fundador) |

**Regra dura:** o CEO **nunca executa trabalho de squad diretamente.** Se ele começar a escrever posicionamento sozinho, a arquitetura virou decoração.

---

### brand-strategist

| Campo | Definição |
|---|---|
| **Missão** | Definir posicionamento, ICP e shortlist de nomes. |
| **Trigger** | CEO Agent no início da Fase 1 |
| **Inputs** | `memory/NORTH_STAR.md` + briefing do fundador |
| **Outputs** | `brand/positioning.md` (posicionamento, ICP, 5 nomes com justificativa) |
| **Ferramentas** | Read, Write, Glob, Grep, WebSearch, WebFetch |
| **Autonomia** | Autônomo para o rascunho. `needs-human-approval` na escolha final do nome (irreversível e pública) |
| **Escala para** | CEO Agent |

---

### visual-identity

| Campo | Definição |
|---|---|
| **Missão** | Traduzir posicionamento em direção visual executável. |
| **Trigger** | CEO Agent, após `positioning.md` aprovado |
| **Inputs** | `brand/positioning.md` |
| **Outputs** | `brand/visual-identity-guide.md` — paleta em hex, tipografia (fontes gratuitas nomeadas), briefing de logo em texto |
| **Ferramentas** | Read, Write, WebSearch |
| **Autonomia** | Autônomo para o rascunho. `needs-human-approval` na direção final |
| **Ferramenta externa** | Este agente **não gera imagem**. Ele entrega briefing. Execução do asset: **Canva (grátis)** como primário, **Figma (grátis)** como alternativa. |
| **Escala para** | CEO Agent |

---

### brand-voice

| Campo | Definição |
|---|---|
| **Missão** | Definir a voz da marca e escrever os primeiros textos client-facing. |
| **Trigger** | CEO Agent, após identidade visual aprovada |
| **Inputs** | `brand/positioning.md`, `brand/visual-identity-guide.md` |
| **Outputs** | `brand/voice-guide.md` + `brand/first-assets.md` (tagline, hero copy, one-pager, bio de perfil) |
| **Ferramentas** | Read, Write |
| **Autonomia** | Autônomo para o rascunho. `needs-human-approval` antes de qualquer texto ir ao ar |
| **Escala para** | CEO Agent |

---

### council (portão de governança — Parte 6)

| Campo | Definição |
|---|---|
| **Missão** | Submeter decisões de alto risco a cinco vozes adversariais e devolver uma síntese com recomendação. |
| **Trigger** | CEO Agent, obrigatoriamente, ao detectar uma das condições em `memory/COUNCIL.md` |
| **Inputs** | A decisão em análise + `memory/NORTH_STAR.md` + `memory/COUNCIL.md` |
| **Outputs** | Sessão anexada em `memory/COUNCIL.md` |
| **Ferramentas** | Read, Write, WebSearch |
| **Autonomia** | Autônomo para deliberar. **Nunca decide** — recomenda. Decisão final é sempre sua. |
| **Escala para** | CEO Agent → você |

---

### Fase 2 (nomeada para não perder o mapa, fora do build)

| Agente | Gatilho de abertura |
|---|---|
| `sales-agent` | Marca aprovada + oferta definida |
| `delivery-agent` | Primeiro cliente assinado |
| `finance-agent` | MRR > A$1.000 |
| `qa-auditor` | 3+ clientes ativos |

---

## PARTE 2 — Modelo Operacional "Família"

### Contexto compartilhado (todo agente lê antes de agir)

| Arquivo | Função | Quem escreve |
|---|---|---|
| `memory/NORTH_STAR.md` | Fonte única de verdade: missão, fase atual, sucesso desta semana, restrições | Você |
| `memory/BRAND.md` | Referência de marca consolidada (só entra o que foi aprovado) | CEO Agent |
| `memory/AGENT_LOG.md` | Histórico append-only de quem fez o quê | CEO Agent |
| `memory/COUNCIL.md` | Regras do conselho + histórico de sessões | council |

**Por que `NORTH_STAR.md` separado do `CLAUDE.md`:** o `CLAUDE.md` é estrutura (muda raramente); o North Star é estado (muda toda semana). Misturar os dois faz você editar o arquivo de contexto raiz constantemente, e é assim que o contexto apodrece.

**Regra de tamanho:** `CLAUDE.md` abaixo de ~100 linhas. Ele entra em toda sessão e todo subagente. Arquivo raiz inchado é imposto de contexto pago em cada chamada.

### Formato padrão de handoff

Todo agente termina criando `tasks/YYYY-MM-DD-nome-da-tarefa.md`:

```markdown
---
agent: brand-strategist
date: 2026-08-30
task: definir posicionamento e shortlist de nomes
status: NEEDS-APPROVAL
next_agent: CEO
---

## O que foi feito
(3 linhas, objetivo)

## Output
brand/positioning.md

## Decisões que precisam de aprovação humana
1. Escolha do nome entre os 5 candidatos
```

`status` só aceita: `DONE` · `BLOCKED` · `NEEDS-APPROVAL`.

### Ciclo do CEO Agent

1. Lê `NORTH_STAR.md` → sabe a prioridade da fase.
2. Varre `tasks/` por itens não reconciliados.
3. Escreve o resultado em `AGENT_LOG.md`.
4. `NEEDS-APPROVAL` → **para** e apresenta a decisão a você. Não prossegue.
5. `BLOCKED` → resolve se for trivial; escala se não for.
6. Verifica se a próxima ação dispara o `council`. Se dispara, convoca antes de agir.
7. Ativa o próximo agente da sequência.

### Conflito e escalação

- Conflito entre agentes (voz não combina com visual) → **CEO decide** e registra a justificativa no `AGENT_LOG.md`.
- Qualquer ação client-facing, financeira ou legal → **sempre** `needs-human-approval`. Sem exceção, mesmo que pareça óbvia.
- CEO sem informação suficiente → escala. **Nunca chuta.**
- Agente pedindo ferramenta não confirmada → para com `status: BLOCKED`. Nunca assume que você tem a conta.

---

## PARTE 3 — Fase 1: sequência do squad de branding

Estritamente sequencial. Marca errada na base contamina tudo depois.

| # | Agente | Entrega | Portão |
|---|---|---|---|
| 1 | `brand-strategist` | `brand/positioning.md` — posicionamento, ICP, 5 nomes | **Você escolhe o nome** |
| 2 | `visual-identity` | `brand/visual-identity-guide.md` — paleta hex, tipografia, briefing de logo | **Você aprova a direção** |
| 3 | `brand-voice` | `brand/voice-guide.md` + `brand/first-assets.md` | **Você aprova antes de publicar** |
| 4 | CEO Agent | `memory/BRAND.md` consolidado | — |

Fora do Claude Code, em paralelo ao passo 2 (única paralelização permitida):
verificação manual de domínio (`.com.au` / `.com`) e handles de rede social para os 5 nomes. O agente propõe; **quem verifica disponibilidade real é você**, no registrador. Um agente afirmando que um domínio está livre é alucinação com cara de fato.

---

## PARTE 4 — Implementação pronta para colar (Claude Code)

### Árvore de arquivos

```
agent-studio/
├── CLAUDE.md                      # contexto raiz — carrega automaticamente
├── .claude/
│   ├── agents/                    # subagentes nativos do Claude Code
│   │   ├── brand-strategist.md
│   │   ├── visual-identity.md
│   │   ├── brand-voice.md
│   │   └── council.md
│   └── commands/                  # slash commands
│       ├── kickoff.md             # /kickoff
│       └── status.md              # /status
├── memory/
│   ├── NORTH_STAR.md
│   ├── BRAND.md
│   ├── AGENT_LOG.md
│   └── COUNCIL.md
├── brand/                         # outputs do squad (nasce vazia)
├── tasks/                         # handoffs (nasce vazia)
└── clients/
    └── _template/                 # Parte 5
```

**Por que `.claude/agents/` e não `agents/`:** `.claude/agents/` é o diretório que o Claude Code varre nativamente ao iniciar a sessão. Colocar em `agents/` significa que você precisa mandar o Claude ler o arquivo manualmente toda vez — perde a delegação automática. Subagente é um arquivo `.md` com frontmatter YAML; só `name` e `description` são obrigatórios.

**Gotcha importante:** subagentes são carregados **no início da sessão**. Se você editar um arquivo em `.claude/agents/` com a sessão aberta, reinicie o Claude Code. Alterações feitas via `/agents` valem na hora.

---

### `CLAUDE.md` (colar inteiro)

```markdown
# CLAUDE.md — Contexto Raiz

## O que é este projeto
Estúdio solo que desenha e opera equipes de agentes de IA para pequenos
negócios. Este repositório é a própria empresa. Fase 1 = construir a marca.

## Seu papel padrão
Você é o CEO Agent (orquestrador). Você delega e reconcilia — você NÃO
executa trabalho de squad. Se uma tarefa pertence a um subagente em
.claude/agents/, delegue via Task.

## Antes de qualquer ação
1. Leia memory/NORTH_STAR.md — prioridade da fase atual.
2. Leia memory/BRAND.md se existir conteúdo aprovado.
3. Varra tasks/ por handoffs não reconciliados.

## Regras fixas (não altere sem aprovação explícita do fundador)
- Toda ação client-facing, financeira ou legal = needs-human-approval.
- Toda entrega de agente cria um handoff em tasks/ no formato padrão.
- Fase 1 = apenas o squad de branding. NÃO crie novos agentes ou
  departamentos. Se o fundador pedir um agente de Fase 2 antes de existir
  cliente pagante, recuse e lembre-o desta regra.
- Antes de qualquer decisão listada em memory/COUNCIL.md, delegue ao
  subagente `council` e apresente a síntese ao fundador.
- Nunca afirme disponibilidade de domínio, handle ou preço de ferramenta
  sem verificação real. Marque como "a verificar".
- Toda saída para o fundador em português do Brasil. Nomes de arquivo,
  agentes e código em inglês.

## Formato de handoff
tasks/YYYY-MM-DD-slug.md com frontmatter:
agent / date / task / status (DONE|BLOCKED|NEEDS-APPROVAL) / next_agent
Seções: O que foi feito · Output · Decisões que precisam de aprovação humana

## Estado atual
Fase 1 — Branding. Timebox: 3 sessões.
```

---

### Subagente completo (modelo — copiar e adaptar)

`.claude/agents/brand-strategist.md`:

```markdown
---
name: brand-strategist
description: Define posicionamento, ICP e shortlist de nomes para o estúdio. Use no início da Fase 1, antes de qualquer trabalho visual ou de copy.
tools: Read, Write, Glob, Grep, WebSearch, WebFetch
model: inherit
---

Você é o Brand Strategist do estúdio.

## Missão
Definir posicionamento, cliente ideal (ICP) e uma shortlist de nomes.

## Leia antes de agir
- memory/NORTH_STAR.md
- brand/ (se já houver algo)

## Entregue
Arquivo brand/positioning.md com estas seções, nesta ordem:
1. Posicionamento em uma frase (o que fazemos, para quem, e o que nos
   torna diferente de um vendedor de chatbot)
2. ICP — setor, tamanho, dor específica, gatilho de compra
3. Anti-ICP — quem NÃO servimos, e por quê
4. 5 nomes candidatos. Para cada: justificativa em uma linha + o padrão
   de domínio/handle que o fundador deve checar manualmente
5. Uma frase de teste: como o ICP descreveria o que fazemos, com as
   palavras dele

## Limites
- NÃO afirme que um domínio ou handle está disponível. Você não verifica
  isso — o fundador verifica. Escreva "a verificar".
- NÃO produza mais de 5 nomes. Menu grande é decisão adiada.
- NÃO avance para identidade visual ou copy. Não é seu escopo.
- Sem enchimento motivacional. Cada linha precisa ser acionável.

## Autonomia
Autônomo para produzir o rascunho.
Precisa de aprovação humana para: escolha final do nome.

## Ao terminar
Crie tasks/YYYY-MM-DD-positioning.md no formato de handoff do CLAUDE.md,
com status: NEEDS-APPROVAL e next_agent: CEO.
Devolva ao CEO um resumo de no máximo 10 linhas — não repita o arquivo
inteiro no contexto da sessão principal.

## Se travar
Handoff com status: BLOCKED, explicando exatamente qual informação falta.
```

Os outros três (`visual-identity`, `brand-voice`, `council`) seguem exatamente esta forma. O que muda: `description`, `tools`, o que lê, o que entrega, e os limites.

---

### Slash command de arranque

`.claude/commands/kickoff.md`:

```markdown
---
description: Inicia a Fase 1 do squad de branding
---

Leia memory/NORTH_STAR.md. Confirme em 3 linhas qual é a prioridade da
fase atual. Depois delegue ao subagente brand-strategist a tarefa de
produzir brand/positioning.md. Quando ele devolver, apresente a mim
apenas: os 5 nomes, a justificativa de cada um em uma linha, e sua
recomendação de qual escolher. Não avance para o próximo agente sem
minha aprovação.
```

`.claude/commands/status.md`:

```markdown
---
description: Estado atual do estúdio
---

Leia memory/NORTH_STAR.md, memory/AGENT_LOG.md e varra tasks/.
Responda em no máximo 15 linhas: fase atual, o que está aprovado,
o que está travado esperando minha decisão, e qual é a próxima ação.
Se houver algo esperando minha aprovação há mais de 2 dias, diga isso
primeiro.
```

---

### Arquivos de memória (conteúdo inicial)

**`memory/NORTH_STAR.md`** — preencha antes de rodar qualquer coisa:

```markdown
# North Star

## Missão do negócio
(uma frase: o que este estúdio faz e para quem — seja específico,
"automação para pequenos negócios" não é específico)

## Fase atual
Fase 1 — Branding & Design. Timebox: 3 sessões de trabalho.

## O que é sucesso esta semana
(critério objetivo e verificável, ex: "positioning.md aprovado e nome
escolhido")

## Restrições fixas
- Fundador solo, sem equipe.
- Orçamento: ferramentas gratuitas por padrão.
- Client-facing / financeiro / legal = aprovação humana obrigatória.
- Fase 2 (vendas, entrega, financeiro) NÃO abre antes do primeiro
  cliente pagante. Esta regra vale contra o próprio fundador.

## Critério de saída da Fase 1
Nome, direção visual e voz aprovados + memory/BRAND.md consolidado.
Depois disso, a próxima ação NÃO é construir mais agentes — é falar
com 10 negócios locais.
```

**`memory/AGENT_LOG.md`** — append-only:

```markdown
# Agent Log

## 2026-08-30 — CEO Agent
Tarefa: setup inicial do repositório
Status: DONE
Output: estrutura de pastas criada
```

**`memory/BRAND.md`** — começa vazio com um cabeçalho. Só o CEO escreve, e só conteúdo aprovado por você.

**`memory/COUNCIL.md`** — ver Parte 6.

---

### Passos para colocar em pé hoje

1. Crie a pasta do projeto (ex: `C:\projetos\agent-studio`).
2. Rode o `bootstrap.sh` que acompanha este blueprint (Git Bash ou WSL) — ele cria a árvore inteira e os arquivos base.
   *Atalho alternativo:* abra o Claude Code na pasta vazia, jogue este blueprint dentro e diga: *"Leia blueprint-agent-studio.md e crie exatamente a estrutura da PARTE 4."*
3. Abra `memory/NORTH_STAR.md` e preencha à mão. **Não delegue isso.** É a única coisa aqui que só você pode escrever.
4. `git init` + repositório privado no GitHub. Sem versionamento, um agente com permissão de escrita pode apagar uma semana de trabalho e você não tem volta.
5. No terminal, dentro da pasta: `claude`
6. Primeira mensagem: `/kickoff`

---

## PARTE 5 — Camada de template para clientes

### O que parametriza por cliente

`clients/[nome]/CLIENT_PARAMS.md`:

- Nome, setor, ICP do cliente
- Tom de voz desejado
- Dados de serviço/FAQ, preços, link de agenda
- Contato de escalação humana
- Quais departamentos ele realmente precisa (não copie os seus)
- Nível de autonomia por agente (apetite a risco varia muito)
- Ferramentas que o cliente já paga (define as integrações)

### O que nunca muda

- Padrão CEO + departamentos
- Formato de handoff
- Regra "client-facing/dinheiro/legal = aprovação humana"
- Estrutura `CLAUDE.md` + `memory/` + `.claude/agents/` + `tasks/`
- O portão do Council

### Regra dura de produtização

**Um template de agente por oferta, nunca um agente novo por cliente.**
Se você tem 3 clientes com "recuperação de chamada perdida", existe **um**
`missed-call-recovery-v1` lendo 3 `CLIENT_PARAMS.md` diferentes. No dia em que
existirem três agentes quase iguais, você tem três coisas para manter e o negócio
deixou de escalar.

### Checklist de nova instância

1. `cp -r clients/_template clients/[nome]`
2. Preencher `CLIENT_PARAMS.md`
3. Definir com o cliente quais departamentos fazem sentido
4. Ajustar níveis de autonomia ao apetite a risco dele
5. Rodar a sequência de onboarding
6. Registrar no `AGENT_LOG.md` do cliente

---

## PARTE 6 — Governança: LLM Council

Vive em `memory/COUNCIL.md`. Executado pelo subagente `council`.

### Condições que forçam sessão obrigatória

- Qualquer decisão de precificação
- Criar novo departamento/agente permanente
- Aceitar um novo cliente
- Qualquer gasto recorrente acima de A$50/mês ou pontual acima de A$200
- Qualquer commitment com prazo maior que 30 dias

### Personas

| Voz | Função |
|---|---|
| **Skeptic** | Ataca a decisão. Procura o modo de falha mais provável. |
| **Strategic Optimist** | Defende o upside e o custo de não agir. |
| **Pragmatist** | Isso é executável com o tempo e as ferramentas de hoje? |
| **Financial Conservative** | Custo, reversibilidade, risco de caixa. |
| **Long-Term Voice** | Isso serve à visão de 1-2 anos ou é distração? |

### Formato da síntese

```markdown
## Council Session — YYYY-MM-DD
Decisão em análise: ...

### Skeptic
### Strategic Optimist
### Pragmatist
### Financial Conservative
### Long-Term Voice

### Síntese do Chairman
Recomendação: ...
Justificativa (2-3 linhas): ...
O que mudaria a recomendação: ...
Aprovação humana necessária: SIM
```

Regra de qualidade: se as cinco vozes concordam facilmente, o Skeptic não fez o trabalho dele. Instrua o subagente a produzir dissenso real ou declarar que a decisão é trivial demais para um council.

**Valor comercial:** esta camada é o diferencial vendável. Cliente pequeno não teme que a IA erre — teme que a IA erre *rápido e em escala*. "Todo agente meu tem um portão de julgamento antes de decisões de risco" é uma frase de venda que os concorrentes não têm.

---

## PARTE 7 — Plataformas complementares (o que sai do Claude Code)

**Princípio arquitetural:** Claude Code é a **fábrica** — onde você desenha, versiona e documenta agentes. Ele não é o **chão de fábrica** — ele não fica rodando 24/7 esperando a chamada perdida de um cliente às 2h da manhã. Confundir os dois é o erro mais caro possível nessa arquitetura.

| Função | Primário | Alternativa | Por quê |
|---|---|---|---|
| Construção da estrutura | **Claude Code** | Claude Cowork (sem terminal) | Cowork é o caminho se o terminal travar seu progresso — mesma lógica, interface visual |
| Versionamento / backup | **Git + GitHub privado** (grátis) | Google Drive sync | Não opcional. Agente com Write pode destruir trabalho |
| Runtime de automação 24/7 | **Make.com** (você já usa) | n8n self-hosted | O agente do cliente precisa rodar sem você. Make é o mais rápido para o primeiro cliente; n8n é mais barato em escala |
| Logo e assets visuais | **Canva** (grátis) | Figma (grátis) | O `visual-identity` entrega briefing; a execução é aqui |
| Site / landing page | **Claude Design** ou Carrd (~US$19/ano) | B12, Framer free | O site prova o produto: precisa ter widget e calculadora de ROI rodando |
| One-pager / deck de venda | **Gamma** (você já tem conectado) | Canva | Do markdown do `brand-voice` para deck em minutos |
| CRM / pipeline | **Notion** (você já tem) | Airtable free | Não troque. Já está operando |
| Captura de lead | **Telegram bot** (você já tem) | Formulário Tally free | Já existe, use |
| Agendamento | **Cal.com** (free tier) | Calendly free | Verificar tiers atuais antes de prometer ao cliente |
| SMS / chamada perdida | **Twilio** (pay-as-you-go) | GoHighLevel | ⚠️ Verificar: números australianos e regras de SMS comercial na AU têm requisitos próprios. Não venda antes de testar com número real |
| Documentação de skills | **Markdown no repo** | Notion | Se não está em `.md`, o sistema não aprendeu |

**Três coisas que eu não faria:**
- Não use VM isolada (Orgo etc.) agora. Blast radius não é problema seu — você não tem agente autônomo em produção. É custo e complexidade antes da hora.
- Não conecte mais de ~5-8 MCPs por sessão. Excesso de ferramentas degrada a seleção de tool e come contexto. Para este projeto: Notion, Google Drive e Make bastam.
- Não pague por nada nesta fase. Cada item da tabela acima tem caminho gratuito até o primeiro cliente.

---

## COMECE POR AQUI HOJE (5 passos, nesta ordem)

1. **Crie a pasta e rode o `bootstrap.sh`** — 2 minutos, a árvore inteira nasce pronta.
2. **Preencha `memory/NORTH_STAR.md` à mão** — 15 minutos, sem delegar. Se a missão sair genérica, o posicionamento sai genérico e a marca inteira sai genérica.
3. **`git init` + repositório privado no GitHub** — 5 minutos, seu seguro contra perda.
4. **Abra o Claude Code na pasta e rode `/kickoff`** — o Brand Strategist entrega os 5 nomes.
5. **Escolha o nome hoje mesmo e cheque domínio + handles você mesmo** — não deixe a decisão aberta até amanhã. Nome indefinido trava as duas etapas seguintes.

---

## NOTA DE RESPONSABILIDADE

Agentes autônomos agindo sem revisão produzem erro em escala. Toda ação client-facing, financeira ou legal está marcada como `needs-human-approval` por design, e assim deve continuar até cada agente ter histórico provado.

Números de ROI, preços e tiers de ferramentas citados aqui são ilustrativos ou baseados em conhecimento que pode estar desatualizado — valide cada um antes de usar em proposta comercial. Questões de ABN, GST e compliance australiano vão para o seu contador, não para o agente.
