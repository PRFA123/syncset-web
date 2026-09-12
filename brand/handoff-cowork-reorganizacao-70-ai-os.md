# Handoff para Cowork — Auditoria e Reorganização de `C:\PauloOS\70_AI_OS`

Cole este documento inteiro como primeira mensagem de uma nova sessão do Cowork. Ele tem duas partes: **contexto** (o que já foi decidido em outra sessão, para você não repetir trabalho) e **tarefa** (o que fazer agora, com acesso real ao sistema de arquivos, que aquela sessão não tinha).

---

## PARTE A — Contexto da sessão anterior (Claude.ai chat, sem acesso a arquivo local)

### A.1 Projeto
SyncSet — estúdio solo de agentes de IA (fundador: Paulo, baseado em Byron Bay). Nome registrado.

**Correção de escopo já aplicada — usar esta versão, não versões antigas de memória:** mercado-alvo é **todos os portes de negócio**, de startups a companhias estabelecidas — não apenas pequenos negócios. Escopo geográfico é **Austrália, com expansão internacional prevista** — Byron Bay é só onde o fundador mora, não fronteira de mercado.

### A.2 Estado da marca
- Nome: SyncSet, registrado, irreversível.
- Logo: **esboço pronto** (mark em laço de duplo S). Falta: mockups de apresentação, configuração técnica (variantes — isolada, lockup horizontal, lockup empilhado, monocromática —, área de respiro, tamanho mínimo de uso) e vetor final em SVG.
- Tudo o mais de marca (paleta, tipografia, tom de voz) está **em aberto**, com recomendações já produzidas em `website-architecture-plan-v1.md` (ver Parte B abaixo) mas **não aprovadas**.

### A.3 Site — dois planos concorrentes, um vencedor decidido
Dois planos de arquitetura de site foram produzidos em paralelo (um por esta sessão, outro por outro assistente/DeepSeek). Eles conflitam em stack, paleta, escopo e prazo. **Decisão tomada nesta sessão:** adotar o Plano A (Astro + Cloudflare, arquitetura em estágios travados por evento, paleta clara) como arquitetura vencedora, e arquivar o Plano B (Next.js + stack pesada, paleta escura+neon, contadores de resultado fabricados — rejeitados por violarem a regra de "nenhum número sem medição real"). Um roadmap de execução de 8 fases foi produzido, com disciplina de economia de crédito de Claude Code (spec e copy nascem fora do CC; CC só escreve e depura código).

**Nenhuma das ~10 decisões de aprovação do Plano A foi marcada ainda.** Isso é a próxima tarefa pendente do fundador, independente da tarefa que você vai fazer agora.

### A.4 O problema que motivou este handoff
A vault do Obsidian está em `C:\PauloOS`, estrutura numerada tipo PARA. O projeto da agência vive em `70_AI_OS`. Dentro dele existem **duas pastas com a mesma anatomia de projeto** (`brand`/`marcas`, `memory`, `tasks`, `CLAUDE`), com timestamps idênticos — sinal de cópia, não de uso paralelo legítimo:

- `70_AI_OS/AGENT_STUDIO/` — `brand/`, `clients/`, `memory/`, `tasks/`, `CLAUDE`
- `70_AI_OS/AI AGENCY/` — `agents/`, `marcas/`, `memory/`, `tasks/`, mais `blueprint-agen...`, `CLAUDE`, `Gemini instruc...`, `prompt-aaa-ar...` soltos fora de qualquer subpasta

Ambas têm `AGENT_LOG.md` dentro de `memory/`, mas o conteúdo não foi comparado ainda — só confirmado que ambas existem.

Há ainda uma terceira pasta, `70_AI_OS/MEMORY/` (raiz, fora das duas anteriores), com `decisions/`, `people/`, `preferences/`, `user/` — parece memória pessoal geral do Paulo, não específica da agência. Tratar como fora de escopo desta reorganização a menos que a auditoria mostre o contrário.

Outras pastas de nível 1 dentro de `70_AI_OS` ainda não auditadas: `AGENTS/personal`, `AUTOMATIONS`, `config`, `copilot`, `docs`, `Excalidraw`, `OUTPUTS/` (com `_from_paulo_pr...`, `claude-code`, `claude-desktop`, `cowork`, `hermes`), `PROMPTS`, `scripts`, `skills`, `specs`.

---

## PARTE B — Arquivos de referência (na base de conhecimento do projeto, leia antes de agir)

- `arquitetura-empresa-agentes.md` — define a arquitetura-alvo: `CLAUDE.md` na raiz + `memory/{NORTH_STAR.md, BRAND.md, AGENT_LOG.md}` + `agents/{ceo.md, brand-strategist.md, visual-identity.md, brand-voice.md}` + `brand/{positioning.md, visual-identity-guide.md, voice-guide.md, first-assets.md}` + `tasks/` + `clients/_template/`. **Esta é a estrutura contra a qual as duas pastas duplicadas devem ser avaliadas.**
- `prompt-arquiteto-empresa-agentes.md` — o prompt que gerou a arquitetura acima.
- `prompt-aaa-arquitetura.md` — arquitetura de site/AAA, framework RIG.
- `website-architecture-plan-v1.md` — plano de site aprovado como vencedor (Plano A).
- Princípio já estabelecido e vinculante: **"Auditar antes de construir."** Uma pasta duplicada já foi identificada como sinal de trabalho anterior incompleto — regra: nunca criar estrutura nova sem primeiro entender o que já existe.

---

## PARTE C — Tarefa para esta sessão do Cowork

Você tem acesso real ao sistema de arquivos que a sessão anterior não tinha. Execute nesta ordem, e **pare para reportar entre cada etapa** — não reorganize nada até a etapa 3 ser aprovada pelo Paulo.

### C.1 — Ler e comparar
1. Leia `AGENT_STUDIO/memory/AGENT_LOG.md` e `AI AGENCY/memory/AGENT_LOG.md` na íntegra.
2. Leia o `CLAUDE` de cada uma.
3. Liste o conteúdo de `tasks/` em cada uma (nomes de arquivo bastam, não precisa ler tudo).
4. Verifique se `blueprint-agen...`, `Gemini instruc...` e `prompt-aaa-ar...` (soltos em `AI AGENCY`) são cópias de arquivos que já existem na base de conhecimento do projeto (Parte B acima) ou se têm conteúdo original não documentado em outro lugar.

### C.2 — Reportar, não decidir sozinho
Produza uma tabela comparando as duas pastas: qual tem histórico de trabalho real vs. qual parece vazia/template; qual `CLAUDE` está mais desenvolvido; se os arquivos soltos de `AI AGENCY` têm conteúdo único que precisa ser preservado antes de qualquer exclusão.

**Pare aqui.** Apresente o relatório ao Paulo e peça a decisão explícita de qual pasta é a canônica antes de mover ou apagar qualquer coisa. Isso é uma ação destrutiva (mover/arquivar arquivos) e exige aprovação humana, conforme a regra do próprio projeto.

### C.3 — Reorganizar (só depois da aprovação da C.2)
Com a pasta canônica definida:
1. Renomeie a pasta perdedora para `_ARCHIVED_<nome>_<data-de-hoje>` e mova para dentro dela, ou mova inteira para `90_ARQUIVO_QUARENTENA` — não delete nada permanentemente sem confirmação explícita adicional.
2. Na pasta canônica, reorganize a estrutura de arquivos para bater exatamente com o padrão da Parte B: `CLAUDE.md` na raiz, `memory/{NORTH_STAR.md, BRAND.md, AGENT_LOG.md}`, `agents/{ceo.md, brand-strategist.md, visual-identity.md, brand-voice.md}`, `brand/`, `tasks/`, `clients/_template/`.
3. Qualquer arquivo solto (os que estavam fora de subpasta em `AI AGENCY`) entra na subpasta correta segundo seu conteúdo, ou vai para uma pasta `_uncategorized/` se não for óbvio — nunca apague por não reconhecer o conteúdo.
4. Ao final, gere um `AGENT_LOG.md` com uma entrada única documentando a reorganização: data, o que foi arquivado, o que foi movido, e o estado final da árvore de pastas.

### C.4 — Reportar de volta
Ao terminar, produza um resumo curto do estado final da pasta `70_AI_OS`, para o Paulo colar de volta nesta conversa do Claude.ai e retomarmos o `00_DECISIONS.md` a partir do estado correto.

---

**Nota de disciplina de crédito (herdada da sessão anterior):** esta é uma tarefa de leitura, comparação e organização de arquivos — não deveria exigir geração de código. Se em algum ponto você (Cowork) sentir necessidade de escrever lógica complexa ou instalar algo, pare e pergunte; não é esse o escopo aqui.
