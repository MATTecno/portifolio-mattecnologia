# Refatoração editorial MAT — diagnóstico anterior à implementação

- React 19 + TypeScript, Vite multi-entry; sem router. Cada URL é uma entrada HTML registrada no Vite.
- CSS comercial compartilhado por home, anúncios, campanha e cases; Tailwind/estilos globais também alimentam recrutadores e demonstração Vue/Zeedhi. Nova composição usa CSS isolado `.mat-page` para não mudar campanhas.
- Fonte system-ui nas páginas comerciais e Orbitron local na marca. Mantidas; monospace nativa nas labels. Sem novas fontes remotas ou biblioteca de movimento.
- Rotas preservadas: `/`, `/sistemas-sob-medida-bh/`, `/baja/`, `/recrutadores/`, `/privacidade/`, `/demos/assinatura/`, cases `/projetos/{convites,estoque,zd-signature-input,brutona,vm-viagens,pdv}/`.
- Infra comercial: `WhatsAppCta` → `trackContact` → PostHog + conversão Ads com consentimento. `attribution.ts` captura UTMs antes de remover query sensível. `estimate.ts` resolve referência, briefing e mensagens. Formulário usa EmailJS por import dinâmico e fallback para WhatsApp/e-mail.
- Eventos existentes: page_viewed, contact_clicked, project_clicked, briefing_started/completed, contact_form_submitted, faq_interaction, profile_clicked, resume_download_clicked e eventos Baja. Nomes preservados.
- SEO: title/description/canonical/OG por HTML, JSON-LD Organization na home, sitemap/robots estáticos. Build passa a pré-renderizar home, índice, contato e cases para entregar conteúdo HTML além do shell React.
- Assets reais: screenshots WebP 1280/800/480 de Brutona, VM, Estoque, Convites e assinatura; foto real de Marcelo; favicon e OG. aPublicitária localizada em `../aPublicitaria-site`, com React/Vite, assets oficiais, galerias/modais, serviços e WhatsApp contextual. Sem vídeos reais ou domínio confirmado no conteúdo versionado; não usar fixture de teste como vídeo de projeto.
- Cases existentes mantêm problema, solução, contribuições, arquitetura, decisões e stack. Briefing, formulário e FAQ expandido migram para `/contato/`; todos os trabalhos ficam em `/projetos/`. `/#estimativa` encaminha ao briefing; `?projeto=...#contato` conserva o contexto.
- Home: hero → três soluções → narrativa ilustrativa caos/processo → três projetos (aPublicitária, Brutona, VM) → processo → Marcelo → CTA → quatro FAQs → footer.
- Movimento: CSS para microinterações; IntersectionObserver e um ciclo rAF agendado por scroll para narrativa, revelações e progresso. Sem interceptar wheel/touch, sem scroll artificial. Mobile sem pin narrativo/parallax; reduced-motion mostra estado estável.
