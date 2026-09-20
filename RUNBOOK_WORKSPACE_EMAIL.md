# Runbook — contact@syncset.com.au no Workspace

2026-09-19 · Paulo

**Atualização 2026-09-20 — prioridade mudou, isto não é mais só profissionalização.**
O site publicou a feature "Diagnóstico de Automação": o visitante preenche um chat, e o
relatório é entregue **por e-mail** (não na tela — ver `memory/COUNCIL.md` no repo Agent Studio
pra essa decisão em aberto). Isso significa que `contact@syncset.com.au` deixou de ser só o
endereço de contato do site — é agora o único canal de entrega do produto prometido ao lead que
acabou de passar 2 minutos respondendo o chat. Revisão de Council (2026-09-20, retroativa)
marcou como **P0** os dois itens abaixo, à frente de qualquer assinatura/branding:
- DKIM: confirmar que a assinatura está de fato **ativa** (Fase 1, item ainda não confirmado —
  o registro DNS existir não basta, ver Fase 4).
- Auto-resposta / expectativa de resposta (Fase 3) — hoje é só polimento; agora é a única
  confirmação que um lead do Diagnóstico recebe se o e-mail do relatório atrasar ou não chegar.
Não se sabe ainda, e precisa ser verificado antes de declarar isso "pronto": **de que endereço o
cenário Make `diagnostic-audit-v1` efetivamente envia o e-mail do relatório** — se não for
`contact@syncset.com.au` (ex: via serviço transacional própio do Make), SPF/DKIM/DMARC deste
runbook não cobrem esse envio, e a deliverability do relatório é um problema separado, não
resolvido por nada abaixo.

## Fase 1 — Diagnóstico (antes de mudar qualquer coisa)

Estado real confirmado nesta sessão (via DNS público + Claude in Chrome), não suposição:

- [x] `contact@syncset.com.au` ativo no Google Workspace Starter (trial 14 dias, iniciado \~17/09)
- [x] MX correto: `smtp.google.com`, prioridade 10, único MX na zona
- [x] SPF correto: `v=spf1 include:_spf.google.com ~all`, sem duplicidade com a Brevo
- [x] DKIM (`google._domainkey`) publicado e válido — assinatura confirmada ativa no Admin Console (2026-09-20)
- [x] Todo o site (`schema.ts`, `privacy.astro`, `terms.astro`, docs) já usa `contact@` como único endereço — `hello@` foi removido do repositório inteiro
- [ ] Assinatura de e-mail — não configurada
- [ ] Auto-resposta / vacation responder — não configurada
- [ ] Encaminhamento (Forwarding) para o Gmail pessoal — passos já entregues, execução não confirmada
- [ ] "Send mail as" (responder como `contact@` de dentro do Gmail pessoal) — não configurado
- [ ] Perfil da organização no Admin Console (nome exibido, fuso horário, idioma) — nunca verificado, provavelmente nos valores padrão do signup
- [x] 2FA em `contact@syncset.com.au` — confirmado ativo (checagem humana, 2026-09-20)
- [ ] 2FA em `paulinhodemolay@gmail.com` — status desconhecido, checagem humana
- [ ] DMARC do domínio em `p=none` (registro da Brevo) — modo monitoramento, sem enforcement; correto por agora, item de maturidade na Fase 4
- [x] Google Business Profile — verificação de identidade concluída (100% verified), confirmado via Claude in Chrome (2026-09-20)

**Por que diagnosticar primeiro:** metade do que normalmente se propõe num setup "do zero" (MX, SPF, DKIM) já está feito e correto. Refazer seria retrabalho e risco de derrubar o que funciona. As lacunas reais estão na camada de uso diário (assinatura, encaminhamento, send-as) e de governança (2FA, DMARC enforcement) — não na infraestrutura.

**Ferramenta usada:** Cowork (esta sessão), via consulta pública de DNS (`dns.google`) e leitura direta do repositório. Só leitura, nenhuma ação de risco — nenhuma ferramenta de IA precisou entrar no Admin Console para esta fase.

**Checkpoint de aprovação:** confirme que a lista acima bate com o Admin Console antes da Fase 2 — em especial os dois itens de 2FA, que só você pode checar.

## Fase 2 — Separação de identidade, notificação e troca sem login separado

O pedido tem duas necessidades diferentes, e o Google resolve cada uma com um mecanismo nativo distinto. Misturar os dois numa só ferramenta é onde a maioria erra.

### Necessidade A — "avise no pessoal quando chegar mensagem em @syncset"

**Mecanismo escolhido: Gmail Forwarding** (dentro das configurações de `contact@`, não do Gmail pessoal).

- [x] **Decisão do fundador (2026-09-21): Forwarding NÃO será configurado.** Paulo optou por não receber e-mails de `contact@syncset.com.au` na caixa pessoal — Necessidade A fica fechada por decisão, não por execução. Sem cópia automática no pessoal, checar `contact@` passa a depender de rotina própria (ex: checagem semanal via Hermes, ver Camada PRO) ou acesso direto à conta.

**Por que Forwarding e não outra coisa:** uma cópia chegando no Gmail pessoal gera notificação nativa (push, badge, e-mail) sem precisar de nenhuma configuração extra de notificação do Workspace — é o próprio e-mail chegando. `contact@` mantém sua cópia íntegra (com "keep in Inbox"), entao as duas caixas continuam com histórico completo e independente — não há fusão de identidade, só uma cópia de leitura chegando no pessoal.

- **Alternativa descartada — Cloudflare Email Routing:** tomaria o MX do domínio inteiro e entraria em conflito direto com o MX do Google Workspace que acabamos de validar na Fase 1. Rejeitada.
- **Alternativa descartada — "Check mail from other accounts" (POP):** puxa e remove/duplica com regras de POP mais frágeis e, em muitos casos, o Google já restringe esse recurso entre contas Gmail/Workspace. Forwarding é mais direto e confiável para este caso.

### Necessidade B — "trocar e responder como @syncset direto do Gmail pessoal, sem logar de novo"

**Mecanismo escolhido: "Send mail as"** (configurado do lado do Gmail pessoal, não delegação completa de caixa).

- [x] **Decisão do fundador (2026-09-21): "Send mail as" NÃO será configurado.** Sem Forwarding, não haveria aviso automático no pessoal pra saber quando responder — Paulo prefere logar direto em `contact@syncset.com.au` quando precisar. Necessidade B fecha por decisão, como a A. Fase 2 encerrada inteira sem configuração adicional de identidade/alias.

**Por que "Send mail as" e não delegação completa (Gmail Delegation):** delegação dá acesso à caixa inteira de `contact@` dentro do Gmail pessoal, mas (a) o e-mail enviado carrega um cabeçalho "sent by ... on behalf of ..." visível se o destinatário abrir os detalhes — menos profissional que uma assinatura própria via SMTP — e (b) as mensagens delegadas normalmente não geram notificação/badge no Gmail pessoal do mesmo jeito que Forwarding gera. Combinando Forwarding (aviso real) + Send mail as (responder com o remetente certo), vocã cobre as duas necessidades sem abrir uma visualização separada nem re-autenticar.

### Camada opcional — troca completa de conta (só se quiser acesso total ao Workspace)

- [ ] Adicionar `contact@syncset.com.au` como segunda conta logada no navegador/app do Gmail (seletor de contas do Google, canto superior direito) — útil se algum dia quiser usar recursos exclusivos do Workspace (Admin Console, Labels avançados) ou notificação push própria no celular. Não é necessário para o uso do dia a dia, já coberto por A + B.

**Ferramentas desta fase:** os cliques em Configurações do Gmail (checkboxes, campos de texto) podem ser feitos por **Claude for Chrome**, desde que vocé já esteja logado nas duas contas no seu Chrome — ele nunca digita senha. O clique no **link de confirmação de verificação** e a geração da **senha de app** (se for usar SMTP) ficam com você, por toque em credencial (ver lista "nunca delegar" ao final).

**Checkpoint de aprovação:** Fase 2 encerrada por decisão do fundador (2026-09-21) — Necessidade A (Forwarding) e Necessidade B (Send mail as) descartadas. `contact@syncset.com.au` segue como conta separada, acessada diretamente quando necessário; sem cópia automática no pessoal.

## Fase 3 — Branding profissional

### Assinatura de e-mail

- [ ] Gmail (`contact@`) → Configurações → "General" → Signature → nova assinatura
- [ ] Conteúdo sugerido (ajustar tom):

  ```
  Paulo Andrade
  SyncSet — AI Workflow Automation
  contact@syncset.com.au · syncset.com.au
  ```
- [ ] Logo: usar o SVG/PNG do favicon/wordmark que já existe em `public/` no repositório (`favicon.svg` é a referência usada no JSON-LD do site) — se não houver uma versão horizontal adequada pra assinatura, gerar uma exportação específica antes

* **Ferramenta:** Claude for Chrome cola o texto e faz upload da imagem — nenhuma credencial envolvida, ação de baixo risco

### Auto-resposta (vacation responder / triagem de expectativa)

- [ ] Configurações → "General" → Vacation responder — usar mais como "expectativa de resposta" do que ausência real, já que o volume ainda é baixo
- [ ] Texto sugerido:

  ```
  Obrigado pelo contato com a SyncSet.
  Recebemos sua mensagem e respondemos dentro de 1 dia útil.
  ```
  (Removida a referência a "syncset.com.au/book" do rascunho original — essa página não existe
  mais, o Cal.com foi removido do site em 19/09/2026. Não há hoje uma página de "ação urgente"
  alternativa pra linkar; se quiser oferecer isso, precisa ser antes decidido no site.)
- [ ] Marcar "Only send a response to people in my Contacts" como **desmarcado** (é e-mail de negócio, precisa responder a desconhecidos)

* **Ferramenta:** Claude for Chrome

### Perfil da organização (Admin Console)

- [ ] Admin Console → Account → Profile — confirmar nome exibido "SyncSet", fuso horário (Australia/Sydney ou o correto pra sua base), idioma
- [ ] **Não preencher endereço físico residencial** — consistente com a decisão já tomada no guia de Google Business Profile (service-area business, sem endereço público exibido)

* **Ferramenta:** Claude for Chrome navega e lê os campos; você confirma os valores finais, mudança de baixo risco mas envolve dados da organização

### Google Business Profile (mesmo domínio)

Já documentado em detalhe no runbook separado que o agente Hermes preparou (categoria, descrição de 750 caracteres, 4 serviços com preço, verificação por vídeo ou correio). Aqui só o que muda depois da decisão desta conversa:

- [ ] Usar `contact@syncset.com.au` como e-mail de contato do perfil (o guia original citava `hello@`, já corrigido no repositório — replicar a mesma escolha no painel do GBP)
- [ ] Confirmar a paleta SPEC.md (warm paper `#FBFAF7` + verde `#1F7A5C`) antes de criar a imagem de capa e o logo do perfil
- [ ] Verificação (vídeo ou postal) — 100% manual, só você

* **Ferramenta:** painel do GBP é 100% manual/humano nas etapas de verificação; Claude for Chrome pode ajudar a preencher categoria/descrição/serviços (texto, sem credencial), mas não a etapa de verificação de identidade

**Checkpoint de aprovação:** aprove o texto da assinatura e da auto-resposta acima (�ou ajuste o tom) antes de eu pedir ao Claude for Chrome pra aplicar — são textos que virão em nome da empresa, vale sua revisão.

## Fase 4 — Deliverability e segurança

### SPF / DKIM / DMARC — já resolvido, só confirmar

- [x] MX, SPF, DKIM confirmados publicamente na Fase 1 — nada a fazer aqui de novo
- [x] Admin Console → Apps → Google Workspace → Gmail → "Authenticate email" → confirmado em 2026-09-20: autenticação DKIM ativa
- [ ] Revisar o DMARC atual (`v=DMARC1; p=none; rua=mailto:...`, registro da Brevo): `p=none` só monitora, não bloqueia nada malicioso se-passar-por-você. Depois de 2–4 semanas de envio normal sem problema de entrega, considerar subir pra `p=quarantine` — item de maturidade, não urgente agora (entra na Camada PRO abaixo)

* **Ferramenta:** Claude for Chrome confirma visualmente o status no Admin Console; qualquer mudança de política DMARC é só editar um registro TXT no Cloudflare — baixo risco, mas fica pra quando o volume de envio justificar

### Revisão de 2FA — só você

- [x] Confirmar 2FA ativo em `contact@syncset.com.au` — confirmado (2026-09-20)
- [ ] Confirmar 2FA ativo em `paulinhodemolay@gmail.com`
- [ ] Se for gerar a senha de app pra SMTP (Fase 2, Necessidade B), 2FA precisa estar ativo primeiro — o Google não libera senha de app sem isso

* **Ferramenta:** 100% humano — nenhum agente de IA deve ver, digitar ou armazenar código de 2FA ou senha de app

**Checkpoint de aprovação:** confirme os dois 2FA e o status da assinatura DKIM antes da Fase 5 — são os únicos itens desta fase que exigem sua ação direta, o resto já está correto.

## Fase 5 — Verificação e testes

Teste após cada fase, não só no final — assim, se algo falhar, sabemos exatamente qual fase causou.

- [ ] **Depois da Fase 2:** enviar um e-mail de um endereço externo (ex: outra conta sua) para `contact@syncset.com.au` → confirmar que chega em `contact@` E chega uma cópia em `paulinhodemolay@gmail.com`
- [ ] **Depois da Fase 2:** responder esse e-mail de dentro do Gmail pessoal escolhendo "De: contact@syncset.com.au" → confirmar no destinatário que o remetente aparece como `contact@syncset.com.au` (pedir pra essa pessoa checar o cabeçalho completo, não só o nome exibido)
- [ ] **Depois da Fase 3:** enviar um e-mail de teste e confirmar que a assinatura e o logo aparecem corretamente (checar também em mobile — assinaturas com imagem grande quebram em telas pequenas)
- [ ] **Depois da Fase 3:** confirmar que a auto-resposta disparou pra um remetente que não está nos seus contatos
- [ ] **Depois da Fase 4:** usar https://www.mail-tester.com/ (gratuito) — mandar um e-mail de `contact@` pro endereço que o site gera e confirmar nota alta (SPF/DKIM/DMARC alinhados = nota máxima nesses três itens)
- [ ] **Teste final:** simular o fluxo completo — um cliente em potencial manda e-mail pro `contact@` → você recebe o aviso no pessoal → responde de lá mesmo, como `contact@`, sem trocar de conta

**Ferramenta:** os envios de teste você faz (é seu proprio e-mail); Claude Cowork ou Claude for Chrome podem checar visualmente o resultado (cabeçalhos, nota do mail-tester, aparência da assinatura) depois que você enviar.

**Checkpoint de aprovação:** só declare o setup "pronto" depois que os 6 itens acima passarem — nenhuma fase anterior fica "proposta como concluída" sem teste real.

## Fazer manualmente — nunca delegar a um agente de IA

- [ ] Digitar ou confirmar qualquer senha, em qualquer conta
- [ ] Ler, digitar ou repassar código de 2FA / autenticação em duas etapas
- [ ] Gerar ou copiar a senha de app usada no SMTP (Fase 2)
- [ ] Clicar no link de verificação de "Send mail as" que chega por e-mail (um clique, mas é o passo que efetivamente autoriza o envio em nome de `contact@` — vale ser seu)
- [ ] Qualquer código/dado de recuperação de conta (recovery email, recovery phone)
- [ ] Dados de pagamento/cartão do Workspace (já configurado por você, mas qualquer alteração futura também fica com você)
- [ ] Verificação de identidade do Google Business Profile (vídeo com seu rosto/documento, ou receber o código do correio)
- [ ] Desativar 2FA ou remover método de recuperação de qualquer conta, por qualquer motivo de "conveniência" — nunca, nem temporariamente

Nenhum agente (Claude Chat, Claude Code, Claude Cowork, Claude for Chrome, Hermes) deve pedir, digitar, armazenar ou visualizar qualquer item desta lista. Se algum passo do runbook parecer exigir isso, ele foi mal desenhado — pare e reveja o passo em vez de contornar a regra.

## Camada PRO — Maturidade Operacional de 30 dias

Transforma este setup de "feito uma vez" em sistema mantido, sem exigir que você lembre de checar nada manualmente.

### Auditoria trimestral de DNS/segurança

- [ ] Lembrete recorrente (a cada 90 dias) pra reconferir MX/SPF/DKIM/DMARC via `dns.google`, revisar se o DMARC pode subir de `p=none` para `p=quarantine`, e checar se apareceu algum registro Cloudflare duplicado (o mesmo tipo de confusão de zona resolvida nesta sessão)

* **Ferramenta:** um scheduled task (não um cron local) que acorda uma sessão do Claude Cowork a cada 90 dias pra rodar essa checagem e reportar

### SyncSet Brand Kit — documento de reuso

- [ ] Um único arquivo (`docs/BRAND_KIT.md` no repositório, ou um doc no Drive) consolidando: paleta confirmada (SPEC.md, warm paper + verde), logo/wordmark (caminhos dos arquivos no repo), assinatura de e-mail padrão, texto de auto-resposta padrão — pra reusar em qualquer ferramenta nova (Canva, GBP, propostas, futuros clientes da agência)

* **Ferramenta:** Cowork monta o conteúdo (já tem tudo levantado nesta sessão); Claude Code ou o device bridge grava no repositório

### Checagem semanal via Hermes

- [ ] Um prompt agendado (semanal) entregue ao Hermes: verificar se há mensagem não lida em `contact@syncset.com.au` com mais de 48h, e alertar você se houver — tarefa de baixo risco, volume alto, perfeita pro tier gratuito do Hermes em vez de gastar Claude Pro nisso

* **Ferramenta:** Hermes (OpenRouter/Nous), com acesso de leitura ao Gmail MCP já disponível neste ambiente — só leitura de labels/threads, sem enviar nada sozinho

**Checkpoint de aprovação final:** essa camada PRO só vale a pena depois que as Fases 1–5 estiverem 100% testadas. Confirme comigo quando chegar lá e eu preparo o agendamento.

## Fechamento da sessão — 2026-09-20

**Confirmado hoje:**
- [x] DKIM ativo (Admin Console) e verificação de identidade do Google Business Profile
  concluída (100% verified) — ver Fase 1/4 acima.
- [x] Dados de pagamento do Workspace adicionados (trial com 12 dias restantes no momento
  desta sessão).
- [x] Feature "Diagnóstico" (relatório na tela, commit `e03f1fd`) **deployada e confirmada em
  produção** pelo Claude Code — `ANTHROPIC_API_KEY` e `DIAGNOSTIC_KV` corretos, endpoint
  retornando 200 com relatório completo. Handoff fechado: `tasks/2026-09-20-diagnostic-kv-binding.md`
  (status DONE).

**Ainda em aberto para a próxima sessão:**
- [ ] Fase 2 deste runbook — Forwarding (`contact@` → pessoal) e Send mail as — não configurados.
- [ ] Cenário Make `diagnostic-audit-v1` — ainda precisa parar de chamar a Anthropic
  internamente (double billing), não tocado hoje.
- [ ] **Ação de segurança recomendada pelo Claude Code, ainda sem confirmação**: uma chave da
  Anthropic foi colada em texto puro na conversa do Claude Code durante o troubleshooting de
  hoje — precisa estar **revogada** no console da Anthropic. Confirmar isso amanhã.
- [ ] Limpeza de CRM/Notion: 2 dos 6 diagnósticos de QA consumidos hoje dispararam o webhook
  real do Make (CRM + Telegram + e-mail de backup) com dados de teste óbvios ("QA Test Co",
  "SyncSet QA Final") — vale apagar essas linhas.
- [ ] Senha de app SMTP — adiada por decisão do fundador, sem data.

## Fechamento da sessão — 2026-09-21

**Confirmado hoje (decisões e status reportados por Paulo):**
- [x] Forwarding (Fase 2, Necessidade A) — decisão do fundador de não configurar; item fechado por
  decisão, não por execução (ver nota na Fase 1 e checkpoint da Fase 2).
- [x] Chave de console da Anthropic (exposta em texto puro durante troubleshooting em 2026-09-20)
  — **revogada**. Ação de segurança pendente do fechamento anterior, resolvida.
- [x] Limpeza de CRM/Notion — as 2 linhas de teste ("QA Test Co", "SyncSet QA Final") removidas.
- [x] Cenário Make `diagnostic-audit-v1` — corrigido e funcionando (double billing / chamada
  interna à Anthropic resolvida por Paulo).
- [x] Senha de app SMTP — não será necessária: "Send mail as" (Fase 2, Necessidade B) foi descartado por decisão do fundador em 2026-09-21 (ver Fase 2). Item encerrado, não apenas adiado.

**Ainda em aberto — e por que a maior parte não é tarefa do Claude Code:**
Todo o trabalho pendente das Fases 2–5 e da Camada PRO é configuração dentro de telas do Gmail/Admin
Console/GBP (cliques, checkboxes, texto) ou decisão humana — não código, CLI ou deploy. Claude Code
não tem navegador; essas tarefas cabem ao Claude for Chrome / Claude Cowork (com supervisão de Paulo
nos pontos de credencial) ou a Paulo diretamente.
