# Refatoração visual, estrutural e de experiência — MAT Tecnologia

Implementação local de 02/10/2026. O diagnóstico anterior às alterações está em
`ARCHITECTURE.md`; a proveniência dos materiais e pendências está em `ASSETS.md`.

## O que foi alterado

Home reconstruída em React, com componentes editoriais próprios, CSS dedicado e
um catálogo central de projetos. A composição alterna off-white, grafite e azul
MAT, com tipografia ampla, labels monoespaçadas, grid sutil e screenshots reais.
Fontes do sistema e Orbitron local foram mantidas. Não foi instalada biblioteca
de animação.

## Home

1. Header: marca reduzida, cinco links e CTA; compacto após scroll. Menu mobile
   com Escape, ciclo de foco, bloqueio/restauração de scroll e fechamento ao
   navegar ou voltar ao breakpoint desktop.
2. Hero: frase solicitada em destaque, mensagem curta, WhatsApp contextual,
   acesso aos projetos e composição abstrata de interfaces sobre massa escura.
3. Soluções: exatamente três pilares; accordion por hover/foco/clique no desktop
   e toque no mobile, com descrição curta, exemplo visual e CTA específico.
4. Rotina: planilha, mensagens e papel convergem para uma interface de etapas,
   responsáveis e status. Identificação explícita de cenário ilustrativo.
5. Projetos: aPublicitária, Brutona e VM Viagens, nessa ordem, em seções grandes.
   Toda mídia e CTA abrem cases internos; índice de todos os trabalhos disponível.
6. Processo: três etapas e linha técnica que progride com o scroll.
7. Sobre: fotografia real de Marcelo e apresentação da empresa independente,
   mantendo comunicação predominantemente em “nós”.
8. CTA final: seção escura, headline ampla e WhatsApp; formulário como alternativa.
9. FAQ: exatamente quatro perguntas, mantendo o evento de interação existente.
10. Footer: navegação, contatos reais, LinkedIn/GitHub, privacidade, perfil
    profissional secundário e MAT como grande elemento tipográfico em SVG.

O aviso de cookies usa apresentação mais compacta nas novas páginas; mantém
opções, texto, persistência e fluxo de consentimento existentes.

## Projetos e conteúdo reaproveitado

- aPublicitária: novo case em `/projetos/apublicitaria/`, usando screenshot real
  e fatos verificados no código do projeto vizinho. O status de conteúdo em
  preparação é visível. Sem métricas inventadas ou alegação de site publicado.
- Brutona e VM: screenshots e narrativa existentes reutilizados. Problema,
  solução, highlights, contribuições, arquitetura, decisões, stack e links
  permanecem nos respectivos cases.
- `/projetos/`: apresenta todo o catálogo; Convites, Estoque, assinatura, PDV,
  produção e automação de e-mails continuam acessíveis.
- `/contato/`: recebe o briefing, formulário EmailJS e FAQ expandido da home
  anterior. O resumo continua integrável às mensagens de WhatsApp e e-mail.
- `/#estimativa` encaminha para `/contato/#estimativa`, mantendo parâmetros.
  Referências `?projeto=...` são resolvidas antes da limpeza de URL do analytics.
- Âncoras legadas de problemas, diferenciais, outros projetos e títulos técnicos
  dos cases continuam disponíveis. As páginas comerciais/campanhas usam seus
  componentes existentes; seu escopo não foi reformulado.

## Animações

CSS realiza entrada escalonada do hero, feedback de botões/accordion, fluxos de
dados ilustrativos e transições simples. IntersectionObserver seleciona os
blocos ativos; um único frame agendado por scroll atualiza progresso via CSS.
Não há loop contínuo de scroll, mudança de estado React a cada frame ou captura
de wheel/touch. Leituras de geometria precedem escritas de estilo.

No desktop: parallax de poucos pixels com ponteiro preciso, fragmento real de
projeto revelado no primeiro scroll, convergência do caos e troca para fundo
azul, linhas conectando etapas, sticky curto por projeto, acentos por case e
rótulo “Ver case”. O cursor do sistema permanece visível.

GSAP/ScrollTrigger: não utilizados. Os efeitos foram implementados com recursos
nativos, sem acrescentar dependência de runtime.

## Mobile e movimento reduzido

Mobile usa narrativa vertical, mídia quase full width, descrição abaixo e
accordion por toque. Não usa sticky narrativo nem parallax de mouse. A sequência
clara → azul fica no próprio fundo da composição; as etapas permanecem legíveis.

`prefers-reduced-motion` remove animações/parallax, desativa sticky dos projetos
e apresenta o estado organizado da narrativa. O conteúdo essencial não depende
de uma animação para existir.

## Performance

Imagens WebP com srcset e dimensões reservadas, lazy loading abaixo da dobra,
fontes locais e ausência de vídeo no carregamento. A home não importa os
formulários/briefing nem a demonstração Vue/Zeedhi; esses recursos ficam nas
páginas correspondentes.

Pré-renderização de 10 páginas no build usa os mesmos componentes React e
hidratação no navegador, evitando duplicar copy para SEO. Visitas com contexto
privado de projeto são renderizadas com o contexto correto no cliente.

Inspeção local, sem simulação de rede/dispositivo lento: CLS entre 0,000016 e
0,000142 em 375/768/1440/1920 px. Zero overflow horizontal e zero imagens
quebradas. Isso não representa medição de Core Web Vitals em produção.

## SEO e rotas

Title/description/OG da home refletem sistemas, automações e experiências
digitais. Canonical, imagem social existente, robots e Organization JSON-LD
preservados; nome do fundador alinhado a Marcelo Teixeira. Sitemap inclui
índice, contato e aPublicitária. Cada página mantém um H1 principal.

Home, índice, contato e sete cases entregam conteúdo pré-renderizado no HTML.
Rotas de anúncios, Baja, recrutadores, privacidade, demo e cases antigos seguem
registradas no Vite, com suas URLs e metadata. Nenhuma URL foi removida.

## Tracking

Preservados: `page_viewed`, `contact_clicked`, conversão Ads de WhatsApp,
`project_clicked`, `faq_interaction`, `briefing_started`, `briefing_completed`,
`contact_form_submitted`, `profile_clicked`, `resume_download_clicked` e eventos
Baja. Consentimento, PostHog, replay e sanitização/atribuição de UTMs preservados.

Adicionados: `project_viewed` e `service_interaction`. Abrir case continua usando
`project_clicked` com destination `case`. Contextos de WhatsApp centralizados em
`src/lib/contact.ts`. Detalhes estão em `docs/analytics.md`.

O teste de Ads bloqueia a rede externa e verifica a chamada de conversão após
opt-in, sua ausência antes e após revogação. Não foram enviadas mensagens,
leads ou conversões reais. Entrega em contas externas não foi testada.

## Assets faltantes

Nenhum asset visual obrigatório ficou pendente: os três projetos têm capturas
reais e Marcelo tem foto. aPublicitária não possui vídeo/demo de produção nem
URL pública confirmada no conteúdo disponível. Esses itens ficam opcionais e
documentados em `ASSETS.md`. Instagram da MAT não foi inventado.

## Arquivos principais

- `src/pages/App.tsx`: nova composição da home.
- `src/sections/editorial/`: hero, soluções, narrativa, projetos e fechamento.
- `src/components/editorial/`: header e footer.
- `src/editorial.css` e `src/lib/useEditorialMotion.ts`: sistema visual e movimento.
- `src/data/home.ts` e `src/data/projects.ts`: conteúdo e catálogo.
- `src/pages/ProjectCasePage.tsx`, `ProjectsIndexPage.tsx`, `ContactPage.tsx`: páginas internas.
- `src/lib/contact.ts`, `src/lib/analytics.ts`: contextos e eventos.
- `scripts/prerender.mjs`, `src/lib/mountPage.tsx`, `vite.config.ts`: build/HTML/hidratação.
- `index.html`, novas entradas HTML, `public/sitemap.xml`: SEO/rotas.
- `tests/browser/editorial.spec.ts`, `src/data/home.test.ts`: testes de regressão.

## Validação

- Lint: passou.
- TypeScript: passou, como parte de `npm run build`.
- Vitest: 73 testes passaram.
- Playwright: 12 testes passaram.
- Build Vite + pré-renderização de 10 páginas: passou.
- Navegação, teclado, menu mobile, accordion, FAQ, WhatsApp contextual, referência
  de projeto/briefing, movimento reduzido e renderização sem JavaScript: passaram.
- Axe nas páginas home, índice, aPublicitária, Brutona e menu mobile: nenhuma
  violação nas regras automatizadas WCAG A/AA selecionadas. Não equivale a uma
  certificação ou auditoria integral de acessibilidade.
- Breakpoints: 375, 768, 1440 e 1920 px, com inspeção de screenshots e DOM.
- Rotas: HTTP 200 nas 15 entradas; title e canonical onde aplicáveis; links
  internos, sitemap, robots e imagens verificados.
- Console da home: sem erros nas quatro larguras.
- Vídeos: não há mídia real disponível nem player/vídeo baixado.
- Avisos de build existentes: base Browserslist antiga e chunk grande da demo
  Vue/Zeedhi. A demo continua isolada da home.

Reproduzir: `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e`.
Os testes de navegador usam Chrome e abrem o build em `127.0.0.1:4175`.

Escopo entregue no workspace. Não foi realizado commit, push ou deploy.
