# Client Reskinning Template — Estágio 2+

Este documento define como reskinar o template `syncset-web` para um cliente específico. **Use apenas na Estágio 2 e posteriormente.**

---

## 1. Antes de começar

- [ ] Obtenha aprovação do cliente para todos os valores abaixo
- [ ] Verifique se o cliente tem um domínio registrado
- [ ] Configure o repositório Git do cliente
- [ ] Prepare todos os assets (logo, favicon, OG image, fontes se customizadas)

---

## 2. Variáveis obrigatórias

### Identidade
- **Client name:** [Nome da empresa]
- **Client domain:** [example.com.au]
- **Client email:** [hello@example.com.au]
- **Location:** [City, State, Country]
- **Price range:** [A$XXX–A$X,XXX]

### Design (se diferentes de SyncSet)
- **Primary color (running state):** [hex]
- **Font family (human):** [Plus Jakarta Sans ou outro]
- **Font family (system):** [JetBrains Mono ou outro]

### Content
- **H1 headline:** [Headline customizado]
- **Meta description:** [155 caracteres máx]
- **CTA text:** [Botão — não rephrase]
- **Seção "Problema":** [Citação real do cliente]

### Integrações
- **Cal.com calendar URL:** [calendly.com/... ou equivalent]
- **Make webhook URL:** [Webhook verificado]
- **Google Analytics ID:** [UA-... ou GA4]
- **Cloudflare Analytics token:** [Token gerado]

---

## 3. Checklist de modificações

### Design (tokens.css)
- [ ] Atualizar `--running` (cor primária)
- [ ] Atualizar `--font-human` se necessário
- [ ] Atualizar `--font-system` se necessário
- [ ] Atualizar `--gutter` se responsivo diferente

### Conteúdo (páginas .astro)
- [ ] Atualizar H1 hero em `src/pages/index.astro`
- [ ] Atualizar subhead
- [ ] Atualizar seção "Problema" (citação + parágrafos)
- [ ] Atualizar seção "Prova" com case real do cliente
- [ ] Atualizar seção "Como trabalhamos" se workflow diferente
- [ ] Atualizar preços
- [ ] Atualizar FAQ com questões relevantes ao cliente

### Estrutura
- [ ] Verificar se precisa de páginas adicionais (ex: `/case-studies`, `/about`) — **não adicione sem aprovação do cliente**
- [ ] Adicionar rotas do cliente em `astro.config.mjs` se necessário

### Assets
- [ ] Criar favicon customizado (SVG)
- [ ] Criar favicon-32.png
- [ ] Criar apple-touch-icon.png
- [ ] Criar og-image.png com branding do cliente
- [ ] Adicionar fonte customizada em `public/fonts/` se aplicável

### Integrações
- [ ] Verificar URL do Cal.com em `src/pages/book.astro`
- [ ] Atualizar `MAKE_WEBHOOK_URL` no `.env`
- [ ] Testar lead form com envio de teste para Make

### SEO
- [ ] Atualizar schema.org Organization, LocalBusiness, WebSite com dados do cliente
- [ ] Submeter `sitemap.xml` no Google Search Console
- [ ] Verificar `robots.txt`
- [ ] Configurar DNS (SPF, DKIM, DMARC) para e-mails

---

## 4. Arquivos que NÃO mudam

Os seguintes arquivos são core do template e **não devem ser editados** sem justificativa explícita:

- `astro.config.mjs` (configuração geral)
- `tsconfig.json` (TS config)
- `tailwind.config.mjs` (Tailwind config)
- `src/components/Cta.astro` (CTA único)
- `src/components/Faq.astro` (FAQ template)
- `src/layouts/BaseLayout.astro` (head template)
- `public/robots.txt` (salvo crawlers específicos)

---

## 5. Performance — verificação final

Antes de deploy, executar:

```bash
npm run build
```

Verificar no Lighthouse:

- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] LCP < 2.0s
- [ ] INP < 200ms
- [ ] CLS < 0.05
- [ ] JS total < 40 KB

Se algum falhar, não publicar.

---

## 6. Documentação para o cliente

Crie um documento `CLIENT_GUIDE.md` incluindo:

1. **Como editar conteúdo:** instruções para atualizar copy diretamente em `.astro` files ou via CMS (se integrado)
2. **Como adicionar imagens:** onde salvá-las, tamanhos esperados
3. **Performance expectations:** LCP targets, mobile vs desktop
4. **Suporte:** quem contatar, SLAs

---

## 7. Checklist pré-deploy (similar a SPEC §16)

- [ ] Build sem erros: `npm run build`
- [ ] Lighthouse ≥ 95 Performance e Accessibility
- [ ] Navegação por teclado funciona
- [ ] `prefers-reduced-motion` respeita (sem animações)
- [ ] FAQ `<details>` funciona sem JS
- [ ] Formulário: 3 envios de teste produzem 3 leads no Make
- [ ] Cal.com: agendamento de teste aparece no calendar do cliente
- [ ] JSON-LD válido (Rich Results Test)
- [ ] `robots.txt` acessível
- [ ] `sitemap.xml` submetido no Search Console
- [ ] SPF, DKIM, DMARC configurados
- [ ] SSL ativo (Cloudflare)
- [ ] Analytics coletando
- [ ] Crawlers de IA não bloqueados (Cloudflare)

---

## 8. Depois do deploy

- [ ] Comunicar ao cliente que site está live
- [ ] Fornecer acesso ao Google Analytics / Cloudflare dashboard
- [ ] Agendar checkpoint em 30 dias (leads, performance, feedback)
- [ ] Documentar qualquer customização feita para referência futura
