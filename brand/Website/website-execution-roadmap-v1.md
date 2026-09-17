# SyncSet — Roadmap de Execução do Site
**Versão:** 1.0 · **Autor:** Senior Engineer / Architect / Technical Coach
**Data:** 2026-09-12 · **Status:** `NEEDS-APPROVAL` · **Substitui:** nada. Complementa `website-architecture-plan-v1.md`.

---

# 1. Audit Findings

## 1.1 Inventário do que foi lido

| Fonte | Natureza | Veredito |
|---|---|---|
| `website-architecture-plan-v1.md` | Plano A — arquitetura, marca, SEO, faseamento | **Vivo, não aprovado.** 0 de 10 decisões marcadas. |
| `Website_project_and_structure_-_deepseek.txt` | Plano B — arquitetura concorrente, do DeepSeek | **Conflita com o Plano A em 7 eixos.** Não pode coexistir. |
| `High-End_Web_Development_with_Claud.txt` | Due diligence de 41 fontes sobre construir sites com Claude Code | **Não conflita — é a camada que faltava.** Metodologia de execução, não arquitetura. |
| Base do projeto (5 arquivos) | Constituição da agência, arquitetura de agentes, guias AAA | Vinculante. Já incorporada no Plano A. |

## 1.2 A visão real do projeto (extraída, não presumida)

Estúdio solo que desenha e opera times de agentes de IA para pequenos negócios, enderecável em todo o Brasil mas com operações na Austrália. Nome **SyncSet**, registrado. Proposta: sincronizar workflows que o negócio já roda, recuperar tempo e capturar leads perdidos. Fase 1 do projeto-mãe = Branding & Design. Fase 2 (vendas, entrega, financeiro) **travada até o primeiro cliente pagante**. Ferramentas de pé: Telegram bot, Notion CRM, Make.com, Google Calendar, GitHub, Obsidian. Zero clientes. Zero cases. Zero números medidos.

## 1.3 Decisões técnicas já tomadas — e formalmente registradas

Apenas três. E nenhuma delas veio de um plano aprovado:

1. **Nome:** SyncSet. Registrado. Irreversível.
2. **Logomarca:** conceito aprovado (laço de duplo S). Dois mockups JPEG.
3. **Ambiente de build:** Claude Code como ambiente primário; Obsidian e a pasta do projeto são o mesmo diretório.

Tudo o mais — stack, paleta, tipografia, escopo, domínio, preço — **está em aberto**, apesar de dois documentos afirmarem o contrário com confiança.

## 1.4 Restrições — incluindo uma nova e decisiva

| Restrição | Fonte | Já refletida nos planos? |
|---|---|---|
| Fundador solo, não-técnico-mas-motivado | Perfil | Parcialmente |
| Fase 2 travada até 1º cliente pagante | Constituição do projeto | Plano A sim · **Plano B ignora** |
| Toda ação client-facing = `needs-human-approval` | `CLAUDE.md` | Plano A sim · Plano B não menciona |
| Orçamento em dinheiro: mínimo | Perfil | Plano A sim (~A$40/ano) · **Plano B não** |
| **Créditos do Claude Code: LIMITADOS. Uso cirúrgico, sem exploração.** | **Prompt master — restrição nova** | ❌ **Nenhum dos dois planos considera isto** |
| **Hermes Agent (OpenRouter, modelos free) disponível para trabalho de volume** | **Prompt master — recurso novo** | ❌ **Nenhum dos dois planos usa** |
| **Obsidian = sistema de registro** | **Prompt master** | ❌ Nenhum dos dois planos define o que registrar |
| Sobrecarga de contexto MCP acima de ~6 conexões degrada seleção de ferramentas | Aprendizado registrado do projeto | Plano A sim · **Plano B adiciona 6+ serviços novos** |

**Consequência da restrição nova:** a variável escassa deste projeto deixou de ser dinheiro e passou a ser **tokens do Claude Code**. Isso reordena o roadmap inteiro. Um plano que era apenas ambicioso (Plano B) passa a ser inviável.

## 1.5 Lacunas — o que ninguém resolveu

| # | Lacuna | Impacto | Dono |
|---|---|---|---|
| G1 | **Logo vetorial não existe.** Só dois JPEG de mockup. | Bloqueia 100% do build visual | Você |
| G2 | **Zero prova.** Sem cliente, sem case, sem número medido. | Bloqueia a seção de maior conversão da home | Você |
| G3 | **Preço indefinido.** Sessão do Council não rodou. | Bloqueia a seção 5 da home | Você |
| G4 | **Copy final não existe.** Ambos os planos só dão direção. | Bloqueia o build — CC não deve escrever copy comercial | Hermes → chat |
| G5 | **Nenhum contato real de mercado.** Confirmado na base do projeto. | Risco estratégico, não técnico. Ver autocrítica. | Você |
| G6 | **Skills/plugins do CC não instalados.** `frontend-design`, `superpowers`, `/seo strategy` | Custa créditos fazer à mão o que um plugin faz | CC, 1 sessão |

## 1.6 Contradições — nomeadas explicitamente

### C1 · Duas arquiteturas concorrentes, nenhuma aprovada

| Eixo | Plano A (v1) | Plano B (DeepSeek) |
|---|---|---|
| Escopo do lançamento | 1 página, 14 dias | 12+ páginas, 14 semanas |
| Framework | Astro (≈0 JS) | Next.js 15 App Router |
| Infra | Cloudflare Pages, só isso | Postgres/Neon + Redis + **Kafka** + Clerk + PostHog + Payload/Sanity |
| Animação | SVG + CSS | React Flow + GSAP + Lenis + Framer Motion |
| Paleta | Papel claro, verde eucalipto | Carvão `#0A0A0B` + ciano `#00E5FF` + âmbar `#FFB800` |
| Tipografia | Satoshi + JetBrains Mono | Space Grotesk + Inter + JetBrains Mono |
| Domínio | `.com.au` (exige ABN, sinal geográfico AU) | `.com` |
| Portões | Evento: 1º e 3º cliente pagante | Nenhum |

### C2 · O Plano B se contradiz internamente

Ele afirma, na seção 3.1, que o mercado está *"visualmente saturado de gradientes roxos escuros"* e que a diferenciação está em credibilidade de engenharia — *"pense Linear, Vercel ou Raycast, não template genérico de IA"*. Na seção 4.1 seguinte, prescreve **carvão escuro + ciano elétrico + âmbar + acentos luminosos**, que é exatamente o uniforme que ele acabou de condenar. Linear e Raycast não usam ciano elétrico nem âmbar.

O diagnóstico do Plano B está certo. A prescrição contradiz o diagnóstico.

### C3 · O Plano B pede prova fabricada

Seção 6.2: *"Proof Band — contadores animados: horas economizadas, workflows implantados, aumento de conversão de leads."*

Você tem zero clientes. Esses contadores só podem ser inventados. Isso viola a restrição de integridade do Plano A ("número no site = número medido"), viola a regra de aprovação humana para conteúdo client-facing, e é o tipo de coisa que morre na primeira pergunta de um comprador operacional sério.

**Rejeição categórica. Não negociável.**

### C4 · O Plano B é o caminho mais caro em créditos que existe

MCP server com OAuth 2.0, rate limiting e tenant scoping; canvas React Flow com nós customizados; timelines GSAP; Kafka; portal de cliente com Clerk. Para um site de marketing sem clientes. Cada um desses é um poço de depuração em que "quase certo" custa cinco iterações. Sob a restrição de créditos limitados recém-declarada, o Plano B não é ambicioso — é **inexecutável**.

### C5 · O Documento C conflita com o Plano A em stack, mas concorda em disciplina

O Doc C assume Next.js + Shadcn + Strapi + 21st.dev (tudo React). O Plano A usa Astro. Conflito real, e não vou fingir que não existe.

**Mas o valor do Doc C não está na stack — está nos quatro conflitos que ele resolve na Parte 4**, e todos os quatro são regras de economia de crédito:

1. Proibir one-shot prompting → loop obrigatório **Explorar → Planejar → Implementar → Verificar**, com `/clear` entre subtarefas.
2. Geradores de browser só para exploração visual; código limpo local depois.
3. Extrair **tokens de design** (`DESIGN.md`), nunca código raspado.
4. Proibir `--dangerously-skip-permissions`; sandbox + Stop hook; aprovação manual para push e deploy.

Esses quatro itens valem mais para você agora do que qualquer escolha de framework.

### C6 · Múltiplas frentes abertas — o padrão nomeado

O prompt master me instrui a sinalizar isto se aparecer. Apareceu.

O Plano A foi entregue com 10 decisões pendentes de uma linha cada. **Nenhuma foi respondida.** Em vez de fechar a frente aberta, surgiu um segundo plano de arquitetura (DeepSeek) e agora um terceiro documento pedindo o plano de execução.

Isso é exatamente o padrão já registrado neste projeto: acumular planejamento e ferramental sem fechar entrega. Três arquiteturas não te deixam mais perto do site do que uma aprovada. Estão te deixando mais longe, porque agora existe um custo de reconciliação que não existia ontem.

**Caminho único forçado — recomendação, não menu:**

> **Adotar o Plano A como arquitetura. Adotar a Parte 4 do Doc C como disciplina de execução. Arquivar o Plano B, salvando quatro elementos.**

**O que se salva do Plano B:**
- CTA **"Book a Workflow Audit"** — mais forte e mais on-brand que "Book an automation audit". Adotado.
- Grafo de entidades unificado no schema com `@id` consistentes entre páginas. Detalhe técnico genuinamente bom. Adotado.
- Risk register como artefato formal. Adotado (seção 2, Fase 0).
- IA de `/use-cases/[vertical]` programáticas. Já estava no Estágio 2 do Plano A; confirma a direção.

**O que se descarta:** stack (Next/Postgres/Redis/Kafka/Clerk/CMS), paleta escura+neon, contadores fabricados, timeline de 14 semanas, `.com` no lugar de `.com.au`, Higgsfield MCP e Hostinger connector (ambos pagos, ambos sinalizados no próprio Doc C como exigindo confirmação de orçamento — e nenhum dos dois se justifica).

## 1.7 O reposicionamento central deste roadmap

Os dois planos anteriores assumiam que o Claude Code faria tudo. Sob créditos limitados, isso é o erro caro.

**Regra estruturante:**

> A sessão mais barata de Claude Code é aquela que **começa com uma especificação completa escrita fora dele** e **termina com um diff verificado**. Tudo que *produz* a especificação acontece em outro lugar.

Três superfícies, três funções, sem sobreposição:

| Superfície | Função | Custo |
|---|---|---|
| **Claude.ai chat** (aqui) | Pensar. Arquitetura, decisões, edição final de copy, revisão do output do Hermes antes de entrar no repo. | Quota separada da do CC |
| **Hermes / OpenRouter free** | Volume. Rascunhos, scaffolding repetitivo, sumarização, variações, alt text. Re-rodável a custo zero. | Zero |
| **Claude Code** | Escrever e depurar código. Rodar build e testes. Git e deploy. Nada mais. | **Escasso** |

O Plano B queimaria créditos pensando dentro do Claude Code. Este roadmap não.

---

# 2. Roadmap

Oito fases. Nenhuma começa antes da anterior atingir um checkpoint funcional real. Fases 0 e 1 não escrevem uma linha de código — e são as que mais economizam crédito.

---

### Fase 0 — Desbloqueio e decisão
**Objetivo:** fechar as frentes abertas e remover os bloqueios físicos. Zero código, zero crédito de CC.

**Definição de "done":**
- `00_DECISIONS.md` no Obsidian com as 10 decisões do Plano A resolvidas, mais a decisão Plano A vs. B registrada por escrito.
- Sessão do Council rodada para preço; faixa definida.
- `logo-mark.svg` existe, curvas limpas, fundo transparente, testado a 16px.
- `syncset.com.au` registrado e resolvendo (exige ABN ativo).
- Google Business Profile criado e verificação iniciada.
- `RISKS.md` criado a partir do risk register do Plano B.

**Esforço:** leve em trabalho, **crítico em sequência**. 1 a 5 dias, quase todo em espera externa (verificação do GBP, vetorização).

**Tool routing:**
- **Você + Claude.ai chat** → sessão do Council para preço. Decisão de alto risco pela constituição; não delegável a modelo free, não faz sentido queimar crédito de CC com raciocínio.
- **Você, manual** → registro de domínio e GBP. Nenhum agente pode reivindicar checagem de disponibilidade de domínio; verificação é sua, como o próprio projeto já determina.
- **Logo vetorial** → caminho recomendado: vetorizar você mesmo no Figma (grátis) a partir do JPEG com a ferramenta de caneta, ou contratar ~A$30 no Fiverr. **Não gaste crédito de CC gerando SVG a partir de descrição** — ele vai aproximar a curva e você vai gastar mais em iteração do que o traçado manual custaria.
- **Hermes** → nada nesta fase.

**Obsidian log:** `00_DECISIONS.md` (as 10 + a decisão A/B, com uma linha de justificativa cada), `RISKS.md`, `COUNCIL/2026-09-XX-pricing.md` no formato de síntese do Chairman.

---

### Fase 1 — Especificação e tokens (ainda sem código)
**Objetivo:** produzir os três arquivos a partir dos quais qualquer pessoa conseguiria construir a página sem fazer perguntas. **Esta é a fase que mais economiza crédito em todo o roadmap.**

**Definição de "done":** três arquivos aprovados por você, sem lacunas:
- `SPEC.md` — escopo, rotas, seções, comportamento, critérios de aceite, orçamento de performance.
- `DESIGN.md` — tokens de cor, escala tipográfica, espaçamento, breakpoints, regras de movimento, estados. Valores literais, não adjetivos.
- `CONTENT.md` — **cada palavra que vai ao ar**, final, revisada. Headline, subhead, todas as seções, 6-8 FAQs, microcopy de botão, estados de erro do formulário, meta title e description.

Critério de aceite: se o `CONTENT.md` tem um `[TBD]`, a fase não terminou. Cada `[TBD]` que sobrar vira uma suposição que o CC preenche e você paga para desfazer.

**Esforço:** médio. 2 a 3 dias.

**Tool routing:**
- **Hermes** → primeiro rascunho de tudo. Gera 5 variações de headline, 12 candidatas a FAQ, 3 versões da seção de problema, o texto bruto dos schemas. Barato, descartável, re-rodável.
- **Claude.ai chat** → **portão de qualidade obrigatório.** Nada do Hermes entra nos arquivos sem passar por edição aqui. O Hermes produz matéria-prima, não texto publicável. (Ver autocrítica, ponto H1.)
- **Claude Code** → **zero uso nesta fase.**
- **Plano A** → fonte dos tokens (§4.2, §4.3, §4.5), do wireframe (§5.2) e da direção de copy (§3.3).

**Obsidian log:** os três arquivos vivem no vault, versionados. `AGENT_LOG.md` recebe uma entrada por arquivo aprovado.

---

### Fase 2 — Scaffold do repositório e ambiente de segurança
**Objetivo:** repositório de pé, tokens aplicados, travas de segurança ativas, plugins instalados. Primeira sessão de CC.

**Definição de "done":** `npm run dev` sobe uma página em branco com as fontes carregadas e os tokens CSS aplicados; `.gitignore` cobre `.env`; Stop hook ativo; commit inicial no GitHub.

**Esforço:** leve. **1 sessão de CC.**

**Tool routing:**
- **Claude Code**, sessão única, Plan Mode primeiro (`claude --permission-mode plan`). Entregue `SPEC.md` e `DESIGN.md` por caminho de arquivo — nunca cole conteúdo no prompt; deixe ele ler do disco. Colar é pagar duas vezes pelo mesmo texto.
- Instalar nesta mesma sessão: plugin `frontend-design` (já disponível no ambiente) e `superpowers`. Anexar o `DISTILLED_AESTHETICS_PROMPT` ao `CLAUDE.md` do repo, conforme Doc C §3.
- Criar `.claude/hooks/stop.sh` que impede fim de turno sem build passando. **Proibir `--dangerously-skip-permissions`** — Doc C, Conflito 4.
- **Hermes** → nada. Scaffold errado custa mais para consertar do que para fazer certo.

**Obsidian log:** `BUILD_LOG.md` — data, escopo da sessão, o que foi gerado, o que quebrou. Uma linha por sessão de CC. Isto vira seu histórico de consumo de crédito.

---

### Fase 3 — Página estática, sem movimento
**Objetivo:** home completa, renderizando, responsiva, acessível — com um SVG **estático** no lugar do diagrama.

**Definição de "done":** todas as 7 seções no ar em localhost, mobile e desktop, navegação por teclado funcional, contraste WCAG AA, Lighthouse ≥ 95 em Performance e Acessibilidade.

**Esforço:** médio. **2 a 3 sessões de CC, uma por bloco de seções.**

**Tool routing:**
- **Claude Code**, uma sessão por bloco: (a) layout base + header + footer + hero; (b) seções 2–4; (c) seções 5–7. **`/clear` entre cada bloco.** Contexto arrastado entre componentes é desperdício puro.
- **Loop de verificação visual via Puppeteer** (Doc C §6) em vez de descrever bug de espaçamento em prosa. Um screenshot resolve o que três rodadas de "o padding está estranho" não resolvem, e custa uma fração.
- **Hermes** → gerar alt text de imagens, variações de microcopy se algo não couber no layout.
- **Claude.ai chat** → se um componente travar, o redesenho do spec acontece aqui, não lá dentro.

**Obsidian log:** `BUILD_LOG.md` por sessão. Screenshots do Puppeteer anexados ao vault.

---

### Fase 4 — O `SyncDiagram`
**Objetivo:** a peça de movimento única do site. Duas faixas, um ciclo de ~6s, SVG + CSS, `prefers-reduced-motion` respeitado.

**Definição de "done":** anima apenas `transform` e `opacity`; INP se mantém abaixo de 200ms; degrada para SVG estático com movimento reduzido; nenhuma biblioteca de animação adicionada.

**Esforço:** médio — e é **o maior risco de crédito do roadmap** (ver autocrítica C1).

**Tool routing:**
- **Claude.ai chat primeiro** → produzir e aprovar a **geometria estática** como SVG, aqui, iterando de graça até você gostar do desenho.
- **Claude Code depois** → recebe o SVG aprovado e adiciona **somente** as keyframes. Não desenha, anima.
- **Teto rígido: 2 sessões.** Se na terceira não estiver pronto, congela o estático e segue. O diagrama é diferenciação, não requisito de lançamento.
- **Hermes** → nada. Precisão geométrica está acima do teto de raciocínio de modelo free.

**Obsidian log:** decisão registrada se o teto de 2 sessões for atingido e o diagrama for congelado.

---

### Fase 5 — Funil (a parte que é a demonstração)
**Objetivo:** formulário → Notion + Telegram + Make + Cal.com, ponta a ponta, sem intervenção humana.

**Definição de "done":** 5 envios de teste reais produzem 5 leads no Notion, 5 alertas no Telegram, 5 e-mails de confirmação em menos de 60s, e um agendamento confirmado no Google Calendar.

**Esforço:** médio.

**Tool routing — e a ordem aqui importa mais que em qualquer outra fase:**
1. **Make.com UI primeiro, sem CC nenhum.** Construa e teste o cenário `lead-intake-v1` com payload manual até funcionar. Depuração de webhook é falha invisível — você não vê *por que* não disparou — e é a forma mais rápida de queimar sessão de CC às cegas.
2. **Claude Code depois** → escrever a Cloudflare Pages Function que POSTa no webhook já comprovado. Uma sessão, escopo trivial, porque a parte difícil já está resolvida.
3. **Manual** → embed do Cal.com, SPF/DKIM/DMARC no domínio. Sem DNS de e-mail correto, seu follow-up cai em spam e o produto se autossabota na demonstração.

**Conectores MCP ativos nesta fase: 4.** Notion, Google Calendar, Cloudflare, GitHub. Não adicione mais — acima de ~6 a seleção de ferramentas degrada, e isso é aprendizado já registrado neste projeto.

**Obsidian log:** `FUNNEL.md` — diagrama do fluxo, payload schema, matriz de autonomia HITL (Plano A §7.2), resultado dos 5 testes.

---

### Fase 6 — Camada SEO/AEO, acessibilidade e performance
**Objetivo:** descobrível por buscador e por crawler de IA; orçamento de performance validado.

**Definição de "done":** JSON-LD válido no Rich Results Test (Organization, WebSite, LocalBusiness, FAQPage, BreadcrumbList com `@id` consistentes); `robots.txt` liberando OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot; bloqueio de bots de IA da Cloudflare **verificado como desligado**; sitemap; `llms.txt`; OG image; FAQ em `<details>` nativo e não acordeão JS; Lighthouse ≥ 95 nas quatro categorias.

**Esforço:** leve a médio.

**Tool routing:**
- **Hermes** → primeiro rascunho do JSON-LD e do conteúdo do `llms.txt`. ⚠️ **Validar 100% em ferramenta externa** — schema alucinado parece correto e está quebrado. Nunca confie em modelo free para sintaxe factual.
- **Claude Code** → skill `/seo strategy` se disponível; senão implementação direta. Uma sessão.
- **Claude.ai chat** → revisão da estratégia de entidade, incluindo a colisão de marca "SyncSet" documentada no Plano A §8.1.

**Obsidian log:** `SEO.md` — mapa de entidades, clusters de keyword, resultado da validação de schema.

---

### Fase 7 — Deploy
**Objetivo:** no ar, no domínio, com Search Console verificado.

**Definição de "done":** `https://syncset.com.au` servindo com SSL; Search Console verificado e sitemap submetido; Cloudflare Web Analytics coletando; GBP linkado ao domínio.

**Esforço:** leve.

**Tool routing:**
- **Claude Code** → build e push. **Deploy exige aprovação manual sua** — Doc C, Conflito 4.
- **Conector Cloudflare (MCP)** → já disponível no seu ambiente.
- **Manual** → DNS, Search Console, GBP.

**Obsidian log:** `DEPLOY.md` — URL de produção, registros DNS, data, hash do commit.

---

### Fase 8 — Medir, e só então escrever a prova
**Objetivo:** transformar a lacuna G2 em ativo. Resolver o bloqueio de prova com número real, não inventado.

**Definição de "done":** 30 dias de dados do funil; a métrica *"tempo entre envio do formulário e chamada agendada, sem intervenção humana"* medida e publicada na seção 3 da home.

**Esforço:** leve em trabalho, 30 dias de calendário.

**Tool routing:** Notion + Cloudflare Analytics para dados; **Claude.ai chat** para escrever a seção; **CC** para uma edição de conteúdo trivial.

**Obsidian log:** `METRICS.md` — snapshot semanal.

---

### 🔒 Portão — Estágio 1 do Plano A
Destrava no **primeiro cliente pagante**. Não por data, não por vontade. Revogação exige sessão registrada do Council.

---

## Resumo de consumo de créditos de CC

| Fase | Sessões de CC | Observação |
|---|---|---|
| 0 · Decisão | **0** | |
| 1 · Spec | **0** | A fase que paga por si mesma |
| 2 · Scaffold | 1 | |
| 3 · Página estática | 2–3 | `/clear` entre blocos |
| 4 · Diagrama | 1–2 | Teto rígido |
| 5 · Funil | 1 | Make resolvido antes |
| 6 · SEO | 1 | |
| 7 · Deploy | 1 | |
| **Total** | **7–9 sessões** | Contra as 30+ que o Plano B exigiria |

---

# 3. Immediate Next Action

**Uma ação. Agora. Zero créditos.**

Crie `00_DECISIONS.md` no vault do Obsidian e preencha. Não abra o Claude Code até este arquivo existir preenchido.

```markdown
# SyncSet — Decisões travadas
Data: 2026-09-__

## D0 · Arquitetura vencedora
Plano A (website-architecture-plan-v1.md) adotado como arquitetura.
Doc C Parte 4 adotado como disciplina de execução.
Plano B (DeepSeek) arquivado. Salvos: CTA "Book a Workflow Audit",
schema com @id unificado, risk register, IA de use-cases.
Justificativa: __________
Status: ☐ ratifico  ☐ discordo, porque: __________

## D1–D10 · Decisões do Plano A, Parte 10
1. Faseamento E0/E1/E2 por evento .......... ☐ aprovo ☐ não
2. Stack Astro + Cloudflare ................ ☐ aprovo ☐ não
3. Cunha "contato perdido → agendamento" ... ☐ aprovo ☐ não
4. Satoshi + JetBrains Mono ................ ☐ aprovo ☐ não
5. Paleta clara ............................ ☐ aprovo ☐ não
6. Arquivo 01 como marca núcleo ............ ☐ aprovo ☐ não
7. Site em inglês .......................... ☐ confirmo ☐ não
8. Faixa de preço .......................... ☐ Council rodado, faixa: ____
9. Área de serviço no LocalBusiness ........ ____________________
10. Nenhum número sem medição real ......... ☐ confirmo

## Bloqueios físicos
- [ ] logo-mark.svg produzido
- [ ] syncset.com.au registrado
- [ ] Google Business Profile criado
```

Tempo estimado: **20 minutos**. É a única coisa que separa este projeto de três documentos de planejamento e nenhum site.

---

---

# SELF-CRITIQUE PASS
*Advogado do diabo contra o roadmap acima. Leia antes de ratificar.*

## C · Onde este roadmap estoura créditos do Claude Code

**C1 · A Fase 4 é o buraco negro e eu subestimei.**
Animação SVG à mão é precisamente a tarefa onde "quase certo" custa seis iterações: o timing fica mecânico, o traçado da linha fica errado, o loop dá salto no reset. Meu mitigador (aprovar geometria no chat, animar no CC) reduz mas não elimina — porque *timing* não se aprova em texto, só se vê rodando, e ver rodando exige sessão de CC. Teto de 2 sessões é a única trava real, e ela vai doer quando você estiver a 80% do resultado desejado.

**C2 · Astro + Cloudflare Pages Functions é caminho menos trilhado que Next.js + Vercel.**
Esta é a crítica mais honesta contra minha própria escolha de stack. Há substancialmente mais Next.js do que Astro no material de treino de qualquer modelo, e o Doc C inteiro — as 41 fontes — assume Next.js. Se o Claude Code hesitar na sintaxe de Pages Functions ou nas content collections do Astro, você paga a diferença em iterações. Contra-argumento que me faz manter Astro: o Estágio 0 tem uma página, um formulário e zero componentes React. A superfície onde a diferença de familiaridade morde é minúscula. **Mas se na Fase 2 o CC tropeçar duas vezes em Astro, migre para Next.js estático sem cerimônia.** A decisão de stack não vale mais que os créditos.

**C3 · A Fase 3 assume que três sessões bastam. Vai ser quatro ou cinco.**
Ajuste responsivo é iterativo por natureza e o loop do Puppeteer, embora mais barato que prosa, não é grátis — cada screenshot entra no contexto. Orce 5 sessões e comemore se forem 3.

**C4 · A disciplina de `/clear` é a primeira coisa que você vai abandonar.**
Às onze da noite, com o componente quase funcionando, ninguém limpa contexto. É exatamente aí que a janela satura e uma sessão vira três. Não tenho mitigação técnica para isto — é disciplina. A única defesa que funciona é a regra de uma sessão = um bloco, encerrada por objetivo e não por cansaço.

**C5 · Um `SPEC.md` vago mata a economia inteira da Fase 1.**
Todo o argumento deste roadmap é "gaste fora do CC para não gastar dentro". Se a Fase 1 produzir um spec que parece completo mas tem ambiguidade — "seção de prova: mostrar resultados" em vez de texto literal — o CC preenche com suposição, você vê o resultado errado, e paga a correção. O `[TBD]` explícito é seu amigo; a ambiguidade implícita é o inimigo. Reler o `CONTENT.md` procurando frases que *você* conseguiria interpretar de duas formas é trabalho de 15 minutos que vale uma sessão de CC.

## H · Onde o Hermes produz lixo que dá retrabalho

**H1 · Copy de marketing. Risco alto, e traiçoeiro.**
Modelo free treinado em landing pages vai devolver exatamente a média das landing pages: "unlock", "seamless", "empower", "in today's fast-paced business landscape", "transform your workflow". É o "slop" que o próprio Doc C cataloga — e o problema é que **lê como texto profissional**. Você não vai perceber que está ruim; vai perceber que o site não converte, três meses depois. **Regra dura: Hermes nunca é autor. Hermes é pesquisador que traz matéria-prima.** Toda palavra que vai ao ar passa por edição no chat.

**H2 · Qualquer coisa factual. Risco crítico.**
JSON-LD, regras da auDA para `.com.au`, limiares de Core Web Vitals, sintaxe de schema, referências ao Privacy Act. Um schema alucinado passa em revisão visual e falha no Rich Results Test — ou pior, passa no teste e descreve sua empresa errado para os motores. **Nada factual do Hermes entra sem validação em ferramenta externa.**

**H3 · Sumarização de concorrentes achata o que importa.**
Peça ao Hermes para resumir cinco sites de concorrentes e você recebe cinco bullets genéricos idênticos. O valor da análise competitiva está no detalhe específico — a avaliação de maturidade em 2 minutos sem cadastro, a frase exata que mata a objeção de lock-in. Resumo apaga exatamente isso. **Use o Hermes para extrair texto bruto, não para interpretar.**

**H4 · Onde o Hermes é genuinamente bom e você deve usá-lo sem culpa:** gerar 12 variações de FAQ para você escolher 6; produzir alt text; converter notas em markdown estruturado; gerar dados de teste para o funil; renomear e reorganizar arquivos em lote. Volume, reversível, baixo risco.

## F · O maior ponto único de falha

**Não é técnico.**

> **Você não tem nenhum cliente, nenhum caso e nenhuma conversa real de mercado — e todo este roadmap termina num site cuja seção de maior conversão você não pode escrever.**

Se você executar as oito fases com perfeição, em seis semanas você terá uma página tecnicamente excelente, rápida, acessível, bem indexada — **lançada no silêncio.** Um site é superfície de conversão para tráfego. Ele não gera demanda. Ele converte demanda que já existe. E nada neste roadmap, nem no Plano A, nem no Plano B, cria uma única conversa com um dono de negócio em Northern Rivers.

A base do próprio projeto já registrou isto: o bloqueio é prático, não estrutural. Construir marca sem contato de mercado é construir sobre suposição — e funciona como comportamento de evitação, porque construir é confortável e ligar para estranho não é.

**Contraproposta contra o meu próprio roadmap:**

Rode a Fase 0 e uma trilha paralela de **dez conversas reais** — dez donos de negócio da sua região, sem pitch, só perguntando onde o trabalho manual dói. Não espere o site. Construa *durante* a prospecção, não antes dela.

Três coisas mudam se você fizer assim:
1. A Fase 1 deixa de ser suposição — o `CONTENT.md` passa a usar **as palavras que eles usaram**, que é exatamente o que a seção 2 da home exige e que nenhum modelo pode inventar por você.
2. A lacuna G2 pode fechar antes do lançamento, e não 30 dias depois.
3. Se as dez conversas revelarem uma dor diferente da cunha "contato perdido → agendamento", você descobre isso **antes** de gastar 9 sessões de CC construindo para a dor errada.

**Ponto de falha secundário, técnico:** o logo vetorial. Tudo o que é visual é downstream dele e, se você terceirizar, está fora do seu controle. Comece hoje.

**Ponto de falha terciário, operacional:** você é um. Sem redundância. Uber, van, processo de PR. Uma semana ruim trava tudo, porque não existe segundo par de mãos. Por isso as fases são curtas e cada uma termina em algo funcional — para que uma interrupção custe uma fase, não o projeto.

---

**Handoff**

```yaml
agent: senior-architect
date: 2026-09-12
task: Roadmap de execução do site SyncSet sob restrição de créditos
status: NEEDS-APPROVAL
next_agent: FOUNDER
output: docs/website-execution-roadmap-v1.md
blocking: 00_DECISIONS.md não existe
```

*Recomendação técnica baseada na disponibilidade atual de ferramentas e nas restrições declaradas. Valide preços, limites de crédito e capacidades de plataforma diretamente antes de comprometer orçamento — mudam com frequência.*
