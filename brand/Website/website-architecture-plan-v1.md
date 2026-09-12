# SyncSet — Arquitetura e Plano de Construção do Site
**Versão:** 1.0 · **Status:** `NEEDS-APPROVAL` · **Autor:** Senior Architect Agent · **Data:** 2026-09-12
**Destinatário:** Founder (aprovação humana obrigatória antes de qualquer execução)

---

## 0. Sumário executivo — leia isto primeiro

Três decisões definem todo o resto. Se você discordar de alguma, o plano muda materialmente.

| # | Decisão | Recomendação | Por quê |
|---|---|---|---|
| 1 | Landing page ou site completo? | **Nenhum dos dois. Site completo em arquitetura, entregue em 3 estágios.** Estágio 0 = uma página só, no stack final, no ar em 14 dias. | Um site de 20 páginas sem um único case real converte pior que uma página honesta. E site grande vazio sinaliza negócio abandonado. |
| 2 | Stack técnico | **Astro + Tailwind + Cloudflare Pages.** Fallback com prazo: se o Estágio 0 não estiver no ar em 14 dias, migra para Framer. | HTML server-rendered = crawlers de IA leem; zero JS por padrão = Core Web Vitals; você é dono do código; hospedagem grátis; Claude Code constrói e mantém. |
| 3 | Posicionamento na home | **Capacidade horizontal, vitrine vertical.** O site não diz "todos os nichos". Diz um processo específico, para um tipo de negócio específico. Verticais novas entram conforme os cases chegam. | "Automatizamos seu negócio" é a causa nº 1 de site de AAA que não converte. A arquitetura que proponho escala para todos os nichos sem que a home precise mentir hoje. |

**O que muda no seu pedido original:** você pediu um site integrado completo — SEO, MCPs, APIs, workflows animados, marketing escalável — de uma vez. Isso está tudo no plano, mas **sequenciado**, não simultâneo. A razão está na Parte 1, e ela vem da sua própria constituição, não da minha opinião.

---

## PARTE 1 — Verificação de governança (North Star + CEO Agent)

### 1.1 O que a constituição do projeto já determina

Auditei os documentos de arquitetura do projeto. As regras vinculantes que incidem sobre este pedido:

| Regra | Fonte | Incidência sobre o site |
|---|---|---|
| Toda ação client-facing = `needs-human-approval` | `CLAUDE.md`, `arquitetura-empresa-agentes.md` | O site é o ativo client-facing máximo. Este documento é o pedido de aprovação. ✅ processo correto |
| Fase 2 (vendas, entrega, financeiro) travada até o 1º cliente pagante | `arquitetura-empresa-agentes.md`, Parte 1 | O site é infraestrutura de vendas. Tecnicamente é Fase 2. ⚠️ conflito |
| "Não deixe o trabalho de infraestrutura da Fase 6/7 expandir antes da Fase 1 produzir pelo menos um cliente pagante — sinalize explicitamente se pedirem para pular" | `prompt-aaa-arquitetura.md`, GO-TO-MARKET SEQUENCING | Instrução direta para eu sinalizar. ⚠️ **sinalizado** |
| "Productize antes de customizar: se não pode ser repetido, não pode ser escalado" | Manual Mestre, Constituição da Agência | O site deve ser template do que você vende. ✅ incorporado no plano |
| "Resultado antes da tecnologia: Problema → Processo → Solução → Tecnologia" | Manual Mestre | Define a ordem das seções da home. ✅ incorporado |
| Navalha de Ockham | Manual Mestre | Mata 70% do que você pediu no Estágio 0. ✅ incorporado |
| Clone-before-build obrigatório | `prompt-aaa-arquitetura.md`, Fase 6 | Aplicado na Parte 6.4 |

### 1.2 Sessão do Council — decisão de alto risco

Conforme `memory/COUNCIL.md`, "criar novo departamento/gastar dinheiro/mudança de escopo estrutural" força sessão. Convoquei.

**Decisão em análise:** construir site completo integrado — SEO, marketing automation, animações, camada de MCP/API — antes do primeiro cliente pagante.

**Skeptic.** Você tem zero cases. A seção que mais converte num site de agência de automação é uma prova com números reais — processo antes, processo depois, tempo de build. Você não tem isso. Um site grande sem prova é uma vitrine bonita de uma loja vazia, e o visitante sente. Pior: construir site é confortável, e vender é desconfortável. Este pedido tem a forma exata do padrão que já foi nomeado neste projeto antes — abrir mais uma frente em vez de fechar a que está aberta.

**Strategic Optimist.** Mas o site não é só vitrine: para uma agência de automação, o próprio funil do site É a demonstração do produto. Se o formulário dispara Telegram → Notion → resposta automática → agendamento, você não fala que automatiza, você prova na primeira interação. Isso é ativo de venda, não distração. E a infra já existe — bot e Notion CRM estão de pé.

**Pragmatist.** Os dois estão certos sobre coisas diferentes. O erro não é construir o site; é construir *todo* o site. A parte que gera conversa comercial é uma página e um botão de agendamento. A parte que custa semanas — matriz serviços × indústrias, calculadoras, hub de conteúdo, páginas de localidade — só rende com tráfego e prova, e você não tem nenhum dos dois ainda. Corte no meio.

**Financial Conservative.** Custo direto do Estágio 0 no stack proposto: domínio `.com.au` (~A$20/ano) e nada mais. Hospedagem, fontes, agendamento e CRM ficam em free tier. O custo real é seu tempo. Duas semanas é aceitável; seis semanas antes de qualquer receita não é. Exijo prazo travado com circuit breaker, não estimativa.

**Long-Term Voice.** Uma condição inegociável: o Estágio 0 tem que ser a página 1 do site final, no stack final, com os tokens finais. Nada de landing descartável em ferramenta que você abandona depois. Se for para jogar fora em três meses, não construa. Construído assim, cada estágio seguinte é adição, nunca retrabalho.

### Síntese do Chairman

**Recomendação: APROVAR COM CONDIÇÕES.** Construir o site é legítimo e estratégico — é o funil dele que demonstra o produto. Mas o escopo pedido viola a regra de sequenciamento da própria constituição. Aprova-se o Estágio 0 (uma página, stack definitivo, 14 dias, circuit breaker para Framer) e a *arquitetura completa documentada*. Estágios 1 e 2 ficam `LOCKED` e destravam por evento, não por data: Estágio 1 abre no primeiro cliente pagante; Estágio 2 abre no terceiro.

**Aprovação humana necessária: SIM.**

---

## PARTE 2 — Leitura do campo competitivo

Pesquisa direta em agências de automação australianas e no padrão global da categoria.

### 2.1 Quem está no campo (AU)

| Agência | Posicionamento | Estrutura do site | O que roubar | O que evitar |
|---|---|---|---|---|
| **Aivy** (aivy.com.au) | 6 serviços × 6 indústrias, mid-market, compliance-first | O mais sofisticado do conjunto: matriz serviços × indústrias, 3 ferramentas interativas sem cadastro, páginas de cidade, feed de notícias diário, FAQ extenso, form de qualificação em 3 passos. WordPress/Elementor. | Matriz de IA para SEO programático; avaliação de maturidade instantânea sem signup; camada de confiança (Privacy Act, sem lock-in, escopo fixo, piloto em 4–6 semanas) | Volume de conteúdo insustentável para um fundador solo |
| **HYPHN** | SMB AU/NZ, "conectamos o que você já usa" | Processo em 4 passos, FAQ, foco em não substituir stack | "Nada é substituído — fazemos tudo trabalhar junto" é a objeção nº 1 morta numa frase | Pouca prova numérica |
| **Grendesign** | Plataforma proprietária (Grenconnect) + agentes de voz | Lista ferramentas (n8n/Make/Zapier) e prazos por complexidade | Prazos explícitos por tipo de projeto reduzem atrito | Expor a stack convida comparação de preço com freelancer |
| **aiautomationagency.com.au** | "A partir de A$110/semana, zero custo inicial" | Preço semanal na dobra, FAQ pesada, foco em trades (ServiceM8, SimPRO) | Precificação semanal remove a objeção de capex | Claim de "#1 da Austrália" sem lastro |
| **Spark Interact** | Enterprise, A$15k–A$150k+ | Institucional clássico, parcerias Microsoft/Google | — | Faixa de preço fora do seu ICP |

### 2.2 Padrões que se repetem — e a oportunidade

**O que 100% deles faz igual:** fundo escuro, gradiente com brilho, acento neon (azul elétrico, violeta ou verde ácido), ilustração de robô ou de rede neural, headline genérica sobre "o futuro do trabalho".

**Isso é uma oportunidade de diferenciação, não um padrão a seguir.** A categoria inteira parece a mesma página. Um site claro, sóbrio e estruturado se destaca num resultado de busca cheio de telas pretas — e os três atributos de marca já definidos para a SyncSet (confiabilidade, calor humano, competência silenciosa) são literalmente o oposto de neon sobre preto.

**O que a pesquisa mostra que derruba conversão em site de AAA:**

- Herói prometendo produto ("Automatize tudo com IA") num negócio que vende serviço → o visitante procura o app, acha um formulário, e sai.
- Mural de logos de ferramentas (n8n, Make, Zapier) → prova que as ferramentas existem, não que você é bom, e convida comparação de preço com freelancer.
- Seção "o que é automação com IA?" → hoje 89% das pequenas empresas já usam IA de alguma forma (contra 36% em 2023, U.S. Chamber of Commerce). Explicar o conceito sinaliza que você fala com iniciantes.
- Chatbot como demo principal → um bot no seu próprio site não é evidência de que você reconstrói o back office de alguém.
- Blog com três posts de 2024 → lê-se como negócio abandonado.
- CTAs múltiplos competindo (agendar / baixar guia / assinar newsletter) → dividem a intenção e derrubam os três.

**Dado que contraria a intuição e vale a sua atenção:** investimento em IA por porte de empresa — 24% nas de 1–9 funcionários, 45% nas de 10–49, 75% nas de 75+ (pesquisa Business.com/Dialog com 1.009 trabalhadores em firmas de 2–250 pessoas). O micro-negócio é o mais barato de alcançar e o menos provável de comprar. Isso não invalida o mercado de Northern Rivers, mas sugere que dentro dele o alvo é o negócio estabelecido com volume repetitivo real — a clínica com 12 pessoas, não o eletricista sozinho.

---

## PARTE 3 — Posicionamento e decisões estratégicas

### 3.1 O problema com "todos os nichos"

Você descreveu a SyncSet como atendendo negócios de todos os nichos. Como **capacidade**, é verdade e é a arquitetura correta — o mesmo agente base parametrizado por `client_config` serve qualquer vertical. Como **mensagem de site**, é a posição mais fraca possível: é exatamente o que todos os concorrentes dizem, e é o que faz o visitante certo não se reconhecer.

**A arquitetura que resolve os dois ao mesmo tempo:**

```
Núcleo horizontal (fixo, verdadeiro hoje)
  "Conectamos as ferramentas que você já usa, para que nada seja
   digitado duas vezes."
        │
        ├── Página de indústria 1  ← abre com o 1º case real
        ├── Página de indústria 2  ← abre com o 2º case real
        └── Página de indústria N  ← escala sem reescrever o núcleo
```

A home nunca lista nichos que você não pode provar. Cada case pago abre uma página vertical nova. Em 12 meses o site cobre "todos os nichos" — com prova em cada um, em vez de uma promessa vazia em todos.

### 3.2 Cunha de entrada recomendada (Estágio 0)

Um processo, nomeado, com resultado mensurável:

> **Contato perdido → trabalho agendado.** Toda ligação não atendida, DM e formulário vira um agendamento no calendário, sem ninguém digitar nada.

Por que essa: já está validada na sua base de conhecimento (Missed Call Text Back), o ROI é aritmético na frente do cliente, o build é de dias e não semanas, e serve trades, wellness, hospitalidade e clínicas sem alterar a arquitetura — que são exatamente as verticais do seu ICP.

### 3.3 Marca e proposta — texto de referência

**Nome:** SyncSet · **Registrado:** sim · **Significado operacional:** um *set* (conjunto) de sistemas em *sync* (fase). Dois fios que passam a se mover juntos.

**Promessa central (uma frase, para uso em todo lugar):**
> SyncSet põe em fase os sistemas que seu negócio já usa, para que o trabalho manual entre eles desapareça.

**Propósito (uso interno e página Sobre, não headline):** ajudar negócios a prosperar. Isso é motivação, não proposta de valor — mantenha fora da dobra.

**Três opções de headline para o herói — escolha uma:**

- A · *Every missed enquiry becomes a booked job. Nobody types a thing.*
- B · *Your tools already have the data. SyncSet makes them talk.*
- C · *The follow-up that never happens — automated, and in your calendar.*

Recomendo **A**: nomeia o processo, nomeia o resultado, deixa o visitante errado sair na primeira linha.

⚠️ **Decisão sua:** o site vai em inglês (mercado AU). Confirmar.

---

## PARTE 4 — Sistema visual e identidade

### 4.1 Auditoria do logo enviado

Você enviou dois mockups. Eles não são idênticos e a diferença importa tecnicamente.

| | Arquivo 01 | Arquivo 02 |
|---|---|---|
| Terminais do laço | Cortados, romos | Afilados em ponta |
| Peso óptico | Maior, mais estável | Mais leve, mais elegante |
| Sobrevive a 16px (favicon) | Sim | **Não** — as pontas somem ou viram artefato |
| Sobrevive a bordado/serigrafia | Sim | Não |

**Recomendação:** **Arquivo 01 é a marca núcleo.** Arquivo 02 vira variante de display, permitida apenas acima de 120px (herói, capa de deck, impresso grande). Não use 02 em favicon, avatar social, assinatura de e-mail ou UI.

**Pendências técnicas antes de qualquer build:**

1. **Você não tem o logo.** Tem dois JPEGs de mockup em papel. Precisa de **SVG vetorial**, curvas limpas, fundo transparente. Sem isso o site não pode ser construído — é bloqueante.
2. Exportar a família: `logo-mark.svg`, `logo-lockup-horizontal.svg`, `logo-lockup-stacked.svg`, `logo-mono-white.svg`, `favicon.svg` + `favicon-32.png` + `apple-touch-icon.png` (180px), `og-image.png` (1200×630).
3. Definir regra de área de respiro: margem mínima = altura do olho interno do laço, em todos os lados.
4. Tamanho mínimo do lockup: 96px de largura. Abaixo disso, só a marca isolada.

**Leitura da marca (use isto na página Sobre):** o símbolo lê como "S", como lemniscata de infinito e como dois fios entrelaçados. As três leituras servem a história de sincronização. É um bom mark — a ambiguidade aqui trabalha a favor.

### 4.2 Tipografia

A tipografia do nome não está definida. Recomendação, com licença comercial verificada:

| Papel | Fonte | Licença | Por quê |
|---|---|---|---|
| **Voz humana** — wordmark, títulos, corpo, botões | **Satoshi** (Fontshare / Indian Type Foundry) | Livre para uso comercial | Geométrica com calor. Contrabalança a curva orgânica do laço sem brigar com ela. Entrega "competência silenciosa" sem a frieza clínica do Inter/Geist. |
| **Voz do sistema** — rótulos de nó, nomes de integração, status, timestamps, trechos de log | **JetBrains Mono** | SIL OFL | Nada decorativo: monoespaçada marca *o que a máquina diz*, em oposição ao que a SyncSet diz. É semântica, não estilo. |

Só duas famílias, com fronteira semântica explícita: **humano fala em Satoshi, sistema fala em mono.** Essa regra é o que impede o site de virar decoração e é replicável para os sites dos clientes.

**Especificação do wordmark:** Satoshi **Medium (500)**, tracking **−1.5%**, caixa como já está (`SyncSet`, dois S maiúsculos). Não usar Bold — engrossa contra a marca. Altura do wordmark = 62% da altura da marca no lockup horizontal, alinhado pela linha de base óptica.

**Alternativas se Satoshi não agradar:** Plus Jakarta Sans (Google Fonts, mais amigável) ou Geist (Vercel, mais técnica e fria). Inter é a escolha segura e por isso a mais invisível — evite se quiser diferenciação.

**Carregamento:** auto-hospedar `.woff2`, subset latino, apenas os pesos 400/500/700, `font-display: swap`, `preload` no peso do herói. Fonte variável completa sem subset custa centenas de KB e derruba o LCP.

### 4.3 Paleta

Deliberadamente fora do padrão da categoria. As cores vêm do vernáculo do próprio produto — estados de um workflow em monitoramento — não de decoração.

```css
:root {
  /* Superfícies */
  --paper:    #FBFAF7;  /* branco quente — ecoa o papel do mockup */
  --surface:  #F2F0EB;  /* cartões, blocos secundários */
  --rule:     #E2DED6;  /* fios de 1px, grade, conectores */

  /* Texto e marca */
  --ink:      #101112;  /* marca, títulos */
  --graphite: #55585E;  /* corpo secundário, linhas de conexão */

  /* Estados de workflow — semânticos, nunca decorativos */
  --running:  #1F7A5C;  /* eucalipto profundo — "em fase". Acento primário. */
  --queued:   #A8721A;  /* âmbar — aguardando, pendente */
  --failed:   #A32E22;  /* usado só em erro real de UI */

  /* Modo escuro (projetado em paralelo, não bolt-on) */
  --paper-dk: #14150F;
  --ink-dk:   #F3F1EC;
}
```

**Regra de disciplina:** `--running` é a única cor que aparece por escolha estética. `--queued` e `--failed` só aparecem quando algo está de fato pendente ou quebrado. Cor carrega estado. Se você usar âmbar para "destacar", o sistema perde o sentido.

**O que foi deliberadamente evitado e por quê:** fundo preto com acento neon (é o uniforme da categoria inteira); gradiente violeta-azul (idem); creme com terracota (virou assinatura visual de página gerada por IA em 2026); imagem de robô (a forma mais rápida de parecer com todo mundo).

### 4.4 Movimento — o único lugar onde a página é ousada

Princípio: **movimento comunica estado, não impressiona.** Uma peça coreografada vale mais que efeitos espalhados. Fade-and-slide em cada seção e hover em cada card são o padrão genérico e leem como página automática.

**A peça única:** o herói mostra um diagrama de fluxo real, animado, em duas faixas — os dois fios do logo viram as duas faixas do diagrama.

```
 Faixa A · o mundo                  Faixa B · seus sistemas
 ─────────────────────             ──────────────────────────
 ligação perdida  ──┐
 DM no Instagram  ──┼──▶ [ SyncSet ] ──▶ CRM atualizado
 formulário       ──┘                ──▶ SMS enviado  ──▶ agendado
                                     ──▶ nota no Notion
```

Um único ciclo, ~6 segundos, em loop, SVG + CSS. Anima apenas `transform` e `opacity`. Sem 3D, sem vídeo, sem biblioteca de animação. Pausa em `prefers-reduced-motion`. Fora disso, a página é estática: micro-interações apenas em foco, hover de botão e expansão de FAQ.

**Por que essa e não outra:** é a única coisa na página que explica o produto mais rápido em imagem do que em texto. Tudo o mais que se ganharia animando, ganha-se escrevendo melhor.

### 4.5 Orçamento de performance (inegociável — trava de projeto)

| Métrica | Teto | Nota |
|---|---|---|
| LCP | < 2.0s em 4G | Meta de mercado é 2.5s; ficamos abaixo |
| INP | < 200ms | 43% dos sites falham aqui; JS de animação é o vilão nomeado |
| CLS | < 0.05 | Reservar caixa de fonte e de imagem |
| JS na home | < 40 KB comprimido | Astro entrega zero por padrão; qualquer JS é escolha consciente |
| Peso total da home | < 400 KB | Inclui fontes e SVG |

Sites que passam nos três Core Web Vitals reportam ganhos de conversão na faixa de 15–30%. Isso não é detalhe de engenharia: é a parte do projeto que paga.

---

## PARTE 5 — Arquitetura da informação

### 5.1 Mapa completo, marcado por estágio

```
syncset.com.au
│
├── /                                   ESTÁGIO 0 ✅
├── /book                               ESTÁGIO 0 ✅  (Cal.com embutido)
├── /privacy  /terms                    ESTÁGIO 0 ✅  (obrigatório)
│
├── /how-it-works                       ESTÁGIO 1 🔒  destrava no 1º cliente pagante
├── /services/
│     ├── missed-enquiry-recovery       ESTÁGIO 1 🔒
│     ├── crm-setup-and-sync            ESTÁGIO 1 🔒
│     └── workflow-automation           ESTÁGIO 1 🔒
├── /work/[case-slug]                   ESTÁGIO 1 🔒  1 case real = 1 página
├── /about                              ESTÁGIO 1 🔒
│
├── /industries/[vertical]              ESTÁGIO 2 🔒  destrava no 3º cliente
├── /services/[service]/[industry]      ESTÁGIO 2 🔒  matriz programática
├── /tools/roi-calculator               ESTÁGIO 2 🔒
├── /tools/automation-audit             ESTÁGIO 2 🔒
├── /[location]                         ESTÁGIO 2 🔒  Byron Bay, Lismore, Ballina…
└── /resources/[post]                   ESTÁGIO 2 🔒  só se houver cadência real
```

**Regra de destravamento:** nenhuma página do Estágio 1 ou 2 é construída antes do gatilho. Página vazia é passivo, não ativo. `/resources` só existe se houver compromisso de publicação — senão fica fora permanentemente.

### 5.2 Home do Estágio 0 — wireframe e especificação

Ordem derivada da regra da constituição (Problema → Processo → Solução → Tecnologia) cruzada com o padrão que converte em serviço: qualificar antes de provar, provar antes de precificar.

```
┌──────────────────────────────────────────────────┐
│ [marca]  SyncSet                    [Book a call]│  header fino, 1 CTA
├──────────────────────────────────────────────────┤
│                                                  │
│  Every missed enquiry becomes                    │  Satoshi 500, 56px desktop
│  a booked job. Nobody types a thing.             │  medida < 80 caracteres
│                                                  │
│  We connect the tools your business already      │  subhead, 20px, graphite
│  runs, so the follow-up happens by itself.       │
│                                                  │
│  [ Book a 20-minute automation audit ]           │  CTA único
│                                                  │
│  ┌────────── DIAGRAMA DE FLUXO ANIMADO ────────┐ │  ← a peça ousada
│  │  ligação/DM/form ──▶ SyncSet ──▶ CRM        │ │     SVG + CSS, 6s loop
│  │                              ──▶ SMS        │ │     rótulos em mono
│  │                              ──▶ agendado   │ │
│  └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│ 2 · O PROBLEMA, NAS PALAVRAS DELES                │
│   "Someone re-types the booking into the diary."  │  ← linguagem do cliente,
│   Três parágrafos curtos. Sem jargão. Sem IA.     │     não a sua
├──────────────────────────────────────────────────┤
│ 3 · PROVA — um exemplo trabalhado, com números    │  ⚠️ BLOQUEIO: exige
│   Processo · antes · depois · tempo de build      │     1 piloto real
│   Anônimo é aceitável. Inventado não é.           │     (ver 5.3)
├──────────────────────────────────────────────────┤
│ 4 · COMO TRABALHAMOS                              │  ← seção que fecha
│   Acesso e permissões · o que acontece se quebrar │     comprador operacional
│   · quem é dono do workflow depois · handover     │
│   4 passos. Sem "01/02/03" decorativo.            │
├──────────────────────────────────────────────────┤
│ 5 · ESCOPO E FAIXA DE PREÇO                       │  ⚠️ decisão do Council
│   "Pilots from A$___. Most first builds run       │     (precificação =
│    A$___–A$___ over N weeks."                     │      alto risco)
├──────────────────────────────────────────────────┤
│ 6 · FAQ (6–8 perguntas)                           │  FAQPage schema
├──────────────────────────────────────────────────┤
│ 7 · CTA repetido — texto idêntico ao do herói     │
└──────────────────────────────────────────────────┘
```

**Nota de copy:** a seção 2 tem que ser escrita nas palavras que o cliente usa internamente, não nas suas. "Alguém redigita o agendamento na agenda" funciona; "ineficiência de handoff manual" não. É a seção que faz o visitante se sentir entendido e é a que quase toda agência pula.

**Deliberadamente ausentes:** mural de logos de ferramentas, explicador "o que é IA", chatbot de demonstração, imagem de robô, segundo e terceiro CTA, contador de clientes inflado.

### 5.3 O bloqueio da prova — e como sair dele

Você não tem case. A seção 3 é a de maior peso de conversão e é a única que não pode ser escrita.

**Três saídas, em ordem de preferência:**

1. **Piloto interno documentado.** Construa o funil da própria SyncSet (Parte 7), meça de verdade e publique: "Our own intake runs on this. Enquiry to booked call: 4 minutes, unattended." Prova real, zero cliente necessário, e é honesta.
2. **Piloto Alpha com desconto** em troca de estudo de caso documentado — já previsto no roadmap de 90 dias da sua base de conhecimento (Mês 1: 2 clientes locais com 50% de desconto).
3. **Não ter a seção.** Melhor um site sem seção de prova do que com prova inventada. Substitua por "How we work" expandido até o primeiro case existir.

**Restrição de integridade:** número no site = número medido. Sem exceção. As faixas de ROI da sua base de conhecimento são ilustrativas e de template — não podem ir para o site como se fossem resultado seu.

---

## PARTE 6 — Arquitetura técnica

### 6.1 Stack — decisão e justificativa

| Camada | Escolha | Alternativa avaliada | Por que a escolhida |
|---|---|---|---|
| Framework | **Astro 5** | Next.js · Framer · Webflow · WordPress | Zero JS por padrão; HTML server-rendered que crawlers de IA leem sem executar JS; content collections dão a camada programática do Estágio 2 sem reescrita; markdown-native, o que Claude Code edita bem |
| Estilo | **Tailwind + tokens CSS** | CSS puro · CSS Modules | Tokens da Parte 4.3 como fonte única; velocidade de iteração |
| Hospedagem | **Cloudflare Pages** | Vercel · Netlify | Free tier generoso; CDN global; conector Cloudflare já disponível no seu ambiente |
| Formulários | **Cloudflare Pages Function** → webhook | Formspree · Tally | Sem terceiro no caminho do lead; você controla o payload |
| Agendamento | **Cal.com** (free) | Calendly | Free tier maior; open source; integra Google Calendar já conectado |
| Analytics | **Cloudflare Web Analytics** | GA4 · Plausible | Grátis, sem cookie, sem banner de consentimento, sem peso de script |
| Versionamento | **GitHub** | — | Já em uso |

**Por que não Framer/Webflow:** entregam em 2 dias contra ~10 no Astro. É uma vantagem real e não vou escondê-la. Mas: mensalidade permanente, você não é dono do código, mais JS no cliente, e — o ponto que decide — você vai vender "sem lock-in, você é dono do sistema" para os clientes. Construir a própria casa em plataforma alugada é uma contradição que aparece na primeira conversa de venda.

**Por que não WordPress:** é o que a Aivy usa e funciona. Mas é superfície de manutenção e de segurança que um fundador solo não deveria carregar para um site de 6 páginas.

**Circuit breaker (exigência do Financial Conservative):** se em 14 dias corridos o Estágio 0 não estiver no ar, aborta o Astro e sobe em Framer no mesmo dia. Prazo vence preferência de stack.

### 6.2 Estrutura do repositório

```
syncset-web/
├── astro.config.mjs
├── package.json
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   ├── favicon.svg · favicon-32.png · apple-touch-icon.png
│   ├── og-image.png
│   └── fonts/            # .woff2 subsetados
├── src/
│   ├── styles/tokens.css        # ÚNICA fonte de cor/tipo/espaço
│   ├── layouts/BaseLayout.astro # <head>, schema, skip-link
│   ├── components/
│   │   ├── SyncDiagram.astro    # a peça animada
│   │   ├── Faq.astro            # emite FAQPage schema
│   │   ├── Cta.astro            # texto idêntico em toda ocorrência
│   │   └── Header.astro · Footer.astro
│   ├── content/                 # ESTÁGIO 1+: cases, serviços, indústrias
│   │   └── config.ts
│   ├── pages/
│   │   ├── index.astro · book.astro · privacy.astro · terms.astro
│   │   └── api/lead.ts          # handler do formulário
│   └── lib/schema.ts            # geradores de JSON-LD
└── docs/
    ├── DESIGN_TOKENS.md
    ├── CONTENT_MODEL.md
    └── CLIENT_TEMPLATE.md       # como reskinar para cliente
```

`docs/CLIENT_TEMPLATE.md` é o que transforma este site em produto: o mesmo repositório, parametrizado, vira entregável vendável. Está alinhado com a camada de template da Parte 5 da arquitetura da empresa.

### 6.3 Domínio

- **Primário: `syncset.com.au`.** `.com.au` exige presença australiana verificável — na prática, ABN ou ACN ativo, sob regras da auDA vigentes desde 12 de abril de 2021. Você tem ABN. O domínio também precisa ter conexão próxima com o nome do negócio — "SyncSet" registrado satisfaz isso.
- ⚠️ **Condição contínua, não checagem única:** se o ABN caducar, a elegibilidade do domínio cai junto. Manter ativo.
- **Defensivo:** registrar `syncset.au` e, se disponível, `.com`, redirecionando 301 para o primário.
- **E-mail:** `hello@syncset.com.au` com SPF, DKIM e DMARC configurados antes do primeiro envio — senão sua automação de follow-up cai em spam e o produto se autossabota.

### 6.4 Clone-before-build (protocolo obrigatório)

Antes de escrever qualquer componente do zero, varredura em GitHub e web. Resultado da varredura preliminar:

| Componente | Existe pronto? | Decisão |
|---|---|---|
| Diagrama de fluxo animado em SVG | Parcial — bibliotecas de fluxograma (React Flow etc.) são pesadas demais para um loop decorativo de 6s | **Build custom** — ~80 linhas de SVG + CSS |
| Widget de agendamento | Sim — Cal.com embed | **Clone** |
| Geradores de JSON-LD | Sim — `astro-seo-schema` | **Adapt** |
| Handler de formulário | Sim — template de Pages Function da Cloudflare | **Clone** |
| Fontes | Sim — Fontshare / Google Fonts | **Clone** |

Registrar a varredura completa em `tasks/` no formato de handoff padrão antes de começar.

---

## PARTE 7 — A camada de automação (a parte que realmente prova o produto)

Você pediu skills, conectores, MCPs, APIs e workflows no site. Aqui está a leitura arquitetural: **a automação não deve estar *na página*. Deve estar *atrás* dela.**

Um chatbot no seu site não prova que você reconstrói o back office de ninguém. Mas um funil de captação que roda sozinho, de ponta a ponta, prova — e você pode dizer na chamada: *"o sistema que agendou esta conversa é o sistema que eu construiria para você."* Esse é o argumento de venda mais forte disponível, e ele usa apenas ferramentas que você já tem de pé.

### 7.1 O funil que É a demonstração

```
Visitante preenche o formulário
        │
        ▼
[1] Pages Function valida e normaliza o payload
        │
        ├──▶ [2] Notion CRM — cria o lead com origem, timestamp, UTM
        ├──▶ [3] Telegram @Paulo_leads_bot — alerta imediato no seu bolso
        └──▶ [4] Make.com — cenário "lead-intake-v1"
                    │
                    ├─ e-mail de confirmação em < 60s, com link do Cal.com
                    ├─ se não agendou em 24h → 1 follow-up
                    ├─ se não agendou em 72h → 1 follow-up final, depois para
                    └─ agendou → status no Notion + evento no Google Calendar
```

**Tudo já está na sua stack.** Notion CRM, bot do Telegram, Make.com e Google Calendar estão operacionais. O trabalho novo é o passo [1] e o cenário [4].

**Métrica a instrumentar e publicar (resolve o bloqueio da Parte 5.3):** *tempo entre envio do formulário e chamada agendada, sem intervenção humana.* Meça por 30 dias. Esse número vira a seção de prova da home.

### 7.2 Camada de aprovação humana (HITL)

Conforme a constituição — toda ação client-facing é `needs-human-approval` até o agente estar provado:

| Ação | Autonomia | Nota |
|---|---|---|
| Criar lead no Notion | Autônomo | Interno, reversível |
| Alerta no Telegram | Autônomo | Interno |
| E-mail de confirmação (template fixo) | Autônomo **após 20 envios revisados** | Começa em modo rascunho para revisão |
| Follow-up 24h / 72h | `needs-human-approval` nos 30 primeiros dias | Depois autônomo, se zero incidentes |
| Qualquer e-mail com conteúdo gerado por LLM | `needs-human-approval` **sempre** | Risco de saída fora da marca em escala |
| Qualquer coisa com preço, contrato ou nota fiscal | `needs-human-approval` **sempre** | Regra inegociável |

### 7.3 MCPs e APIs — o que entra agora, o que espera

⚠️ Disciplina de contagem de ferramentas: acima de ~50 ferramentas MCP ativas simultaneamente, a seleção do modelo degrada por consumo de contexto. Começar mínimo.

**Estágio 0 (4 conectores):** Notion · Google Calendar · Cloudflare · GitHub.
**Estágio 1 (+2):** Gmail (follow-up) · Make.com.
**Estágio 2:** Semrush ou equivalente para monitoramento de posição. Nada mais entra sem justificativa escrita.

---

## PARTE 8 — Arquitetura de SEO e AEO

### 8.1 Achado crítico — colisão de marca na busca

**"SyncSet" é um termo técnico estabelecido em vários ecossistemas de desenvolvimento.** A varredura encontrou: `SyncSet` é um recurso do OpenShift Hive (Red Hat) para gerenciamento de clusters; é um objeto na API GraphQL do Xurrent; é uma classe do InterSystems Caché/Ensemble; é um pacote Python publicado (`py-syncset`); e existe um gerador `syncset-gen` no GitHub.

**Consequência prática:** você não vai dominar a busca pelo termo isolado "syncset" tão cedo — os resultados estão ocupados por documentação técnica com autoridade de domínio alta e anos de acúmulo. Isso **não é motivo para trocar o nome** (registrado, decidido, e a colisão é com documentação de infraestrutura, não com um concorrente comercial), mas muda a estratégia:

1. **Não persiga a query nua.** Persiga `syncset automation`, `syncset australia`, `syncset byron bay`, `syncset ai agency`.
2. **Sempre com qualificador no `<title>`:** `SyncSet — AI Workflow Automation for Australian Business`. Nunca só "SyncSet".
3. **Construa a entidade, não a keyword.** Schema `Organization` com `sameAs` apontando para LinkedIn, Google Business Profile, ABN Lookup e Instagram. É assim que os motores desambiguam "SyncSet a empresa" de "SyncSet o objeto de API".
4. **Google Business Profile é a vitória mais rápida disponível** — gratuita, e o Google alimenta AI Overviews e Gemini direto dela. Criar e verificar na semana 1.

### 8.2 Camada técnica

```
public/robots.txt
  User-agent: *
  Allow: /
  # liberar explicitamente crawlers de IA
  User-agent: OAI-SearchBot     Allow: /
  User-agent: PerplexityBot     Allow: /
  User-agent: Google-Extended   Allow: /
  User-agent: ClaudeBot         Allow: /
  Sitemap: https://syncset.com.au/sitemap-index.xml
```

⚠️ Se usar Cloudflare, **verificar a configuração de bloqueio de bots de IA** — a Cloudflare passou a bloquear crawlers de IA por padrão em certas configurações, e isso desliga sua visibilidade em AEO sem aviso.

**Schema JSON-LD, por página:**

| Página | Schema |
|---|---|
| Todas | `Organization` + `WebSite` + `BreadcrumbList` |
| Home | `+ LocalBusiness` (areaServed: Northern Rivers NSW) `+ FAQPage` |
| Serviço (E1) | `+ Service` |
| Case (E1) | `+ Article` |

**Regra de arquitetura que serve SEO e AEO ao mesmo tempo:** conteúdo tem que estar no HTML que o servidor devolve. Crawlers de IA não navegam como pessoas — eles leem o HTML de resposta. Conteúdo escondido atrás de abas, acordeões que exigem clique ou render por JS é invisível para eles. Astro resolve isso por padrão; **o FAQ precisa usar `<details>` nativo, não acordeão JS.**

### 8.3 Sobre `llms.txt` — posição honesta

Há disputa genuína aqui. O Google declarou publicamente que táticas como criar arquivos de texto para IA (`llms.txt` incluído) não são efetivas para o Google Search e recomenda ignorá-las em favor de SEO convencional. Outros motores e ferramentas de terceiros tratam o arquivo como sinal útil, e parte do mercado reporta ganho.

**Posição recomendada:** publique. Custa 20 minutos e ~2KB, e o downside é zero. Mas **não construa estratégia em cima disso** — os ganhos reais em AEO vêm de HTML server-rendered, schema, Google Business Profile e conteúdo em formato pergunta-resposta.

### 8.4 Conteúdo — só do Estágio 2 em diante

Nada de blog no lançamento. Quando abrir, o formato que funciona é question-led: cada página responde uma pergunta real de busca, com a resposta direta no primeiro parágrafo e contexto depois. Cluster inicial sugerido: *"missed calls small business australia"*, *"servicem8 automation"*, *"how much does workflow automation cost australia"*. Três páginas mantidas valem mais que trinta abandonadas.

---

## PARTE 9 — Plano de execução, custo e prazo

### 9.1 Estágio 0 — 14 dias corridos

| Dia | Entrega | Bloqueante |
|---|---|---|
| 1 | Vetorizar logo → família SVG completa | **Você.** Sem SVG, nada anda. |
| 1 | Registrar `syncset.com.au` (+ `.au` defensivo) | **Você.** Precisa do ABN. |
| 1 | Criar Google Business Profile | **Você.** Verificação leva dias — comece já. |
| 2 | Repositório + Astro + tokens + fontes auto-hospedadas | — |
| 3 | BaseLayout, header, footer, acessibilidade base | — |
| 4–5 | `SyncDiagram` — a peça animada | — |
| 6 | Copy da home (todas as seções) | **Você** aprova antes de codar |
| 7–8 | Home montada | — |
| 9 | Pages Function + Notion + Telegram + Make | — |
| 10 | Cal.com, `/book`, `/privacy`, `/terms` | — |
| 11 | Schema, robots, sitemap, `llms.txt`, OG image | — |
| 12 | Auditoria: Lighthouse, teclado, leitor de tela, reduced-motion | Falhou o orçamento da 4.5 → não publica |
| 13 | Teste ponta a ponta do funil, 5 envios reais | — |
| 14 | Deploy, DNS, verificação Search Console | **Você** aprova o go-live |

### 9.2 Custo

| Item | Custo |
|---|---|
| `syncset.com.au` + `.au` | ~A$40/ano |
| Cloudflare Pages · Cal.com · Satoshi · JetBrains Mono · Cloudflare Analytics · Google Business Profile | A$0 |
| Make.com | Free tier cobre o volume do Estágio 0 |
| **Total em dinheiro** | **~A$40/ano** |
| **Total em tempo** | **~40–50 horas** — o custo real |

### 9.3 Portões de destravamento

| Estágio | Gatilho | Escopo |
|---|---|---|
| **1** | 1º cliente pagante assinado | `/how-it-works`, 3 páginas de serviço, 1 case real, `/about` |
| **2** | 3º cliente pagante | Matriz indústrias, calculadora de ROI, páginas de localidade, resources |

Gatilho é evento, não data. Nenhuma exceção sem sessão do Council.

---

## PARTE 10 — Decisões que exigem você (aprovação prévia)

Marque cada uma. Nada começa antes disso.

| # | Decisão | Recomendação | Sua resposta |
|---|---|---|---|
| 1 | Aprovar o faseamento (E0 agora, E1/E2 travados por evento) | Aprovar | ☐ |
| 2 | Aprovar o stack Astro + Cloudflare, com circuit breaker de 14 dias para Framer | Aprovar | ☐ |
| 3 | Aprovar a cunha "contato perdido → trabalho agendado" como oferta do E0 | Aprovar | ☐ |
| 4 | Aprovar Satoshi + JetBrains Mono | Aprovar — alternativas na 4.2 | ☐ |
| 5 | Aprovar a paleta clara (sair do padrão escuro/neon da categoria) | Aprovar | ☐ |
| 6 | Confirmar Arquivo 01 como marca núcleo e 02 como variante de display | Aprovar | ☐ |
| 7 | Confirmar idioma do site = inglês | Confirmar | ☐ |
| 8 | **Definir faixa de preço para a seção 5** | Sessão do Council obrigatória (precificação = alto risco) | ☐ |
| 9 | Definir área de serviço declarada no `LocalBusiness` | Northern Rivers NSW + remoto AU | ☐ |
| 10 | Confirmar: nenhum número no site sem medição real | Confirmar | ☐ |

### Pendências suas, bloqueantes para o dia 1

1. **Logo em SVG vetorial.** Os dois arquivos enviados são mockups raster. Sem vetor o build não começa.
2. **ABN ativo confirmado** para elegibilidade do `.com.au`.
3. **Aprovação das 10 decisões acima.**

---

## Nota de responsabilidade

Este documento cobre arquitetura de produto, marca e automação. Não constitui aconselhamento jurídico, fiscal ou contábil — questões de ABN, GST, Privacy Act 1988 e termos de contrato vão para seu contador e, quando aplicável, para um advogado australiano. As páginas `/privacy` e `/terms` do Estágio 0 devem ser revisadas por profissional habilitado antes de tratarem dados de clientes reais.

Dados de mercado citados (adoção de IA por porte, benchmarks de Core Web Vitals, práticas de AEO) vêm de fontes públicas de 2026 e servem para calibrar a arquitetura, não para uso em material de vendas sem validação contra números reais dos seus próprios clientes.

---

**Handoff**

```yaml
agent: senior-architect
date: 2026-09-12
task: Arquitetura e plano de construção do site SyncSet
status: NEEDS-APPROVAL
next_agent: FOUNDER
output: docs/website-architecture-plan-v1.md
```

**Decisões que precisam de aprovação humana:** as 10 da Parte 10, com a nº 8 (precificação) exigindo sessão do Council antes de resposta.
