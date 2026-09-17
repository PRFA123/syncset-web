# SyncSet Website — Alterações Visuais a Fazer

**Data:** 17 de setembro de 2026  
**Status:** Em progresso  
**Versão:** V28 Visual Direction  

---

## Instruções de Uso

1. **Para cada problema:**
   - Tire uma screenshot da área problemática (Windows + Shift + S)
   - Abra em Paint ou Preview
   - Adicione setas/círculos vermelhos apontando o problema
   - Salve como PNG na mesma pasta deste arquivo

2. **Nomeie as imagens assim:**
   - `01-hero-problema.png`
   - `02-gap-frames.png`
   - `03-section-nome.png`

3. **Descreva o problema:**
   - O que está errado
   - Como deveria ser (compare com Visual Direction)
   - Onde fica (qual seção, qual linha)

---

### OBSERVACAO: TODAS AS IMAGENS QUE TEM NOMES POR EXEMPLO 01.1,02.1 TEM MARCACOES EM VERDE. ESSAS IMAGENS SAO DO VISUAL DIRECTION ("C:\Users\paulo\syncset-web\SyncSet Visual Direction.url") E SERVEM DE EXEMPLO COMO AS ALTERACOES DEVEM FICAR.

### TODOS OS GAPS E ESPACAMENTOS DE TODO O WEB SITE DEVEM FICAR PROPORCIONAIS COM AS MESMAS DISTANCIAS MEDIAS ATRIBUIDAS, ASSIM COMO OS ESPACAMENTOS DOS TITULOS.


## Problemas a Verificar

### ✅ SEÇÃO 00: Navegador Tab
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: do lado esquerdo da chrome tab do navegador onde mostra logo, aparece uma logo que nao condiz com a Syncset logo. trocar para logo oficial.
- Screenshot: `00-chrometab.png`
- Esperado vs Atual: espero ter a logo original do SyncSet "C:\PauloOS\70_AI_OS\AGENT_STUDIO\brand\01_Logos\SyncSet - Marca isolada\Frame 1.png" Atual tem uma logo generica que nao condiz com a marca.Top-heading: A logo da SyncSet deve ficar um pouco maior. Atual: logo pequena desproporcional

### ✅ SEÇÃO 1: HERO
- [x] H1 centralizado
- [x] Subheading centralizado
- [x] Gap entre botões CTA (24px)
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: "NEW BOOKING SYNC IS LIVE" esta dentro de um frame verde que deve ser transparente 
"Every missed enquiry becomes a booked job. Nobody types a thing" tem uma animacao/efeito sobrepondo as letras.
- Screenshot: `01.1-top-heading.png` (de vermelho o que tem que mudar); `01.1-Hero-problem.png`(marcado de verde como deve ficar).
`01-top-heading.png`01-top-heading.png; `01.1-top-heading.png`(marcado de verde como deve ficar)
- Esperado vs Atual: espero aumentar um pouco o espacamento entre headings. Hero-problem: Espero que fique como nas fotos com marcacao verde: frame/botao com cor verde interna deve ser transparente, letras brancas, com efeito de luz estatica no topo. apenas palavra "new" fica verde. Efeito de luz gentil passando dentro do frame. aumentar um pouco os gaps de toda sessao. "Every missed enquiry..." deve ter um efeito sombreado de luz e uma animacao gentil de luz que corre por dentro das letra.

Atual: botao esta todo verde com letras pretas e efeito estranho.
"Every missed enquiry becomes a booked job. Nobody types a thing" tem uma animacao/efeito sobrepondo as letras" tem um efeito animacao muito estranho que sobrepoe o texto e fica ilegivel


---

### ✅ SEÇÃO 2: THE GAP
- [ ] Frames stacked verticalmente (1 coluna)
- [ ] Gap entre frames (~20-30px)
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: "THE GAP" e "THE CORE" frames devem ficar horizontalmente lado a lado. no "THE CORE" frame a 
- Screenshot: `1-the-gap.png (vermelho)`; `1.1-the-gap.png`(verde)
- Esperado vs Atual: Esperado: frames devem ficar horizontalmente lado a lado. no "THE CORE" frame a imagem com a animacao deve descer para ficar centralizado, somente a imagem dentro do frame. Atual: frames stacked verticalmente; "THE CORE" a imagem dentro do frame esta um pouco descentralizada para cima.

---

### ✅ SEÇÃO 3: FLOW (HOW IT RUNS)
- [x] Título centralizado
- [x] Diagram/SVG visível
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: "Every channel in. Every system out." e frame "Enquiry → booking Median 41s"
- Screenshot: `3-how-it-runs-problem.png`; `03-equiry-booking-median-problem`; `03.1-equiry-booking-median-VD`
- Esperado vs Atual:para "how it runs" espero que a palavra "out" permaneca na mesma linha que "Every channel in". 
Atual: a palavra "out" na linha de baixo junto com "No one retyping in between."
- Para equiry-booking-median-problem (o frame com animacao) espero o efeito animado de ter duas linhas contornando o frame sincronicamente (visual Direction). As duas linhas iniciam da parte superior central em sincronia e contornam o frame em sincronia ate a parte inferior central do frame onde as linhas se encontram e desvanecem ate desaparecer e comecar de novo na parte superior central.
Atual: uma linha grossa desproporcional que contorna o frame.

-----------

 - ESSE TEXTO DEVE FICAR TODO ALINHADO A ESQUERDA (TITULO E SUBTITULO): "It all comes in on WhatsApp. I read it, write it in the notebook, then type it into the system. When I get a chance."
It's not that business owners don't care. It's that the reply that should take 30 seconds takes 3 hours, and by then, the client has moved on.

The problem isn't the tools. It's the gap between them. Every time someone reads a message and re-types it somewhere else, that's a gap. Every time a booking sits in a WhatsApp thread waiting to be entered into a calendar, that's a gap. Every gap is a place where a client can disappear.

You already know this. You've probably tried to fix it. A person to manage the messages, a system nobody ended up using, a spreadsheet that worked for a week. The issue isn't effort. It's that none of those things close the gap automatically.

See it work before you take our word for it.
We run our own enquiries through it, no case study required.

Every enquiry to syncset.com.au runs through the exact system we'd build for you, form to CRM to confirmation, unattended. Submit the form below and watch it happen. That's the whole pitch, proven on ourselves before we ever pitch it to you.

----------

### ✅ SEÇÃO 4: HOW IT WORKS
- [ ] Quote centralizado
- [ ] Quote font size adequado
- [ ] 4-step grid layout
- [ ] Body text (3 parágrafos) left-aligned
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: "How it works" 4-step grid layout
- Screenshot: `04-how-it-works-frame-problem`
- Esperado: Efeito de luz estatica nos quatro frames. Titulo alinhado a esquerda.
- Atual: nao tem nenhum efeito, frames sem divisao

---------------

- ESSE TEXTO DEVE FICAR TODO ALINHADO A ESQUERDA (TITULO E SUBTITULO)
What it costs.
Pilots start at A$900. Most first builds run A$1,800–2,500.

Fixed scope, fixed price, no monthly retainer until you've seen it work. The pilot covers one workflow end-to-end: usually enquiry capture to booking confirmation. If it works, we build from there. If it doesn't do what we said it would, you don't pay the second half.

No lock-in. No ongoing fees unless you want them. You own the system.

-------

### ✅ SEÇÃO 5: INTEGRATIONS
- [ ] Título centralizado
- [ ] Layout dos case studies
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: Animacao com os apps e conectores
- Screenshot: `05-integrations-problem.png`
- Esperado vs Atual: Espero que tenha logos mais modernas e gostaria que o Hermes baixasse novos pacotes de logo. 
- Atual: Logos com design que nao combinam com as logos originais dos provedores.

---

### ✅ SEÇÃO 6: COMMON QUESTIONS
- [ ] Título centralizado
- [ ] Alturas iguais dos cards
- [ ] Step numbers cor verde
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: Common questions with big spacing btw lines of each question.
- Screenshot: `06-comon-questions-problem.png`
- Esperado vs Atual: reducao de espacamento leve entre as perguntas. 
 - Atual: Muito espacado, espaco grande entre as perguntas.

---

### ✅ SEÇÃO 7: PREFER TO WRITE INSTEAD
- [ ] Título centralizado
- [ ] "What it costs" heading
- [ ] "Pilots start at..." emphasis
- [ ] Trust line visibility
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: 1.Titulo do texto desalinhado desproporcional ao frame de mensagens. 2. texto dentro do frame com uma palavra por linha.
- Screenshot: `07-prefer-to-write.png`
- Esperado: 1. espero que o frame abaixo do titulo e subtitulo fique alinhado proporcionalmente com titulo e subtitulo.
2. espero que texto dentro do frame (que eh o mesmo do titulo e subtitulo seja removido de dentro do frame). Os campos de preenchimento do formulario devem ficar alinhados proporcionalmente ao titulo. Aplicar efeito de luz estatica no frame. Incluir "replies within 1 business day" em baixo do subtitulo em azul 
- Aual: titulo e subtitulo desalinhados em relacao ao frame; 
2. mesmo conteudo do titulo e subtitulo duplicado dentro do frame e formulario isolado.

---

### ✅ SEÇÃO 8: START HERE
- [x] Título centralizado
- [ ] Logo marquee full-width
- [ ] Logos looping smoothly
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: "Start here. Stop losing clients to slow replies.Book the audit. It's free, and it's 20 minutes." DESALINHADOS
- Screenshot: `08-start-here-problem.png`; `08.1-start-here-VD.png`
- Esperado: espero que o texto fique alinhado a esquerda assim como o frame. Frame deve ser alinhado a esquerda e expandido como mostra `08.1-start-here-VD.png`
- Atual: texto centralizado e frame pequeno cortado alinhado a esquerda.

---

### ✅ SEÇÃO 9: START HERE (CTA FINAL)
- [x] Section heading centralizado
- [x] Frame centralizado horizontalmente
- [x] "No deck, no discovery call" text visible
- [x] Button + "Write instead" link side-by-side
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: _______________________________________
- Screenshot: `09-starthere-problema.png`
- Esperado vs Atual: _______________________________________

---

### ✅ SEÇÃO 10: FOOTER
- [x] NO "2026" no copyright
- [x] Email = contact@syncset.com.au
- [ ] Privacy/Terms links visible
- [ ] Outros problemas visuais?

**Se houver problema:**
- Descrição: _______________________________________
- Screenshot: `10-footer-problema.png`
- Esperado vs Atual: _______________________________________


## Checklist Final

- [x] Verifiquei todas as 10 seções
- [x] Tirei screenshots de todos os problemas encontrados
- [x] Descrevi cada problema com clareza
- [x] Comparei com Visual Direction (https://claude.ai/artifact/WpcVCEv39DoJmGMQsyXSfW)
- [x] Salvei as imagens PNG na mesma pasta

---

## Próximas Ações

Após preencher este documento:
1. Salve como `Alteracoes-a-fazer.md`
2. Coloque as screenshots PNG na mesma pasta
3. Envie para análise

Hermes irá:
- Revisar cada problema
- Corrigir o CSS
- Recompilar (npm run build)
- Verificar no browser
