# Segunda rodada de direção de arte — 02/10/2026

Escopo: hero, movimento e temas dos três projetos selecionados. A estrutura,
copy, ordem das seções, páginas internas, SEO, tracking, consentimento e
WhatsApp da primeira rodada foram preservados. As mudanças CSS desta rodada
estão em `src/art-direction.css`, importado apenas pela entrada da home.

## Hero

O cálculo anterior começava em `-hero.getBoundingClientRect().top`: a altura do
header atrasava o início. Agora o progresso parte de `window.scrollY`, desde o
primeiro pixel, e converge em aproximadamente o menor valor entre **65% da
altura da janela e 70% da altura do hero**. Não há sticky ou bloqueio de scroll.

- 0–20% do progresso: massa escura e órbita respondem; camadas se separam;
  a imagem real já aparece com revelação lateral e opacidade crescente.
- 20–45%: screenshot assume a composição, aumenta de escala e se torna opaco
  por volta de 32% do progresso; interfaces abstratas se afastam.
- 45–70%: screenshot domina; os elementos antigos terminam de desaparecer.
- 70–100%: rotação e profundidade resolvem a composição até a saída natural.

No desktop a imagem cresce de 0,82 a 1,12 da escala base, com rotação sutil e
sobreposição sobre as interfaces. Cada layer tem deslocamento próprio, em vez
de mover tudo como uma única caixa. A captura permanece real e decorativa;
os CTAs e o texto principal não dependem dela.

O min-height passou de uma viewport inteira disponível para um limite de
760px (respeitando o conteúdo e a altura da janela). Padding vertical e baseline
foram reduzidos, a transição para soluções foi aproximada, e órbita/linha técnica
passaram a ocupar melhor a parte inferior da composição. Nenhum texto adicional
foi criado para preencher espaço.

O header compacto conserva seu espaço no fluxo por uma margem compensatória
sincronizada com a redução da navegação (26px desktop, 10px tablet, 4px mobile).
Isso elimina o deslocamento do hero e a correção involuntária de scroll durante
a transição. Com movimento reduzido, a navegação mantém altura constante.

## Project themes e origem das cores

Configuração única: `src/data/projectThemes.ts`. Os valores foram lidos nos
repositórios locais, sem reconstruir marcas ou extrair cores arbitrárias de
fotografias.

| Projeto | Superfície | Accent / apoio | Origem |
| --- | --- | --- | --- |
| aPublicitária | `#4a1a3f` ameixa | `#fec800` amarelo, `#f8f7f7` claro | `../aPublicitaria-site/src/styles.css`, tokens `--plum`, `--yellow`, `--paper` |
| Brutona | `#a0121b` vermelho | `#ebd9c8` bege, `#ecc7d8` rosa, texto `#faf8f4` | `../Brutona/src/app/globals.css` e `../Brutona/docs/official-brand.md` |
| VM Viagens | `#102b4b` azul profundo | `#ded4c8` areia, `#f4f0ea` off-white; header `#173a64` | `../VM Viagens/src/styles/tokens.css` |

O tema domina a superfície inteira da vitrine, grid, linhas, labels, detalhes
do título e cursor “Ver case”. A mídia usa 85% da largura útil no desktop, com
limite pela altura em telas baixas para manter a legenda acessível. Tablet usa
94%; mobile conserva imagem quase full width e texto abaixo.

O header permanece claro e com a marca MAT intacta. Apenas ponto, linha inferior,
underline do item Projetos, hover e CTA usam a cor profunda correspondente.
Não é aplicada uma recoloração global ao logo nem a outras seções da home.

A transição mistura tokens via `color-mix()` e custom properties conforme a
posição do scroll, numa faixa de 36% da altura da janela ao redor da fronteira
entre projetos (18% antes/depois). Não há timer, autoplay ou atraso artificial.
Um frame agendado também trata salto por âncora, scroll reverso e resize.

## Projeto ativo, favicon e theme-color

A propriedade ativa muda quando o centro da viewport entra no projeto. Uma
margem de estabilidade de 12px nas fronteiras evita alternância repetida com
pequenas oscilações de trackpad. Essa margem não atrasa a restauração fora do
intervalo dos projetos.

Todos os três projetos possuem favicon real. Arquivos copiados sem alteração,
com hashes SHA-256 conferidos contra as fontes:

| Projeto | Asset servido pela MAT | Fonte |
| --- | --- | --- |
| aPublicitária | `/projects/icons/apublicitaria.png` (64px) | `../aPublicitaria-site/public/assets/favicon.png` |
| Brutona | `/projects/icons/brutona.png` (32px) | `../Brutona/public/favicon-32x32.png` |
| VM Viagens | `/projects/icons/vm-viagens.ico` (32px) | `../VM Viagens/public/favicon.ico` |

Os atributos originais `href`, `type` e `sizes` dos links `rel=icon`, assim como
`content` de `meta[name=theme-color]`, são capturados ao montar a home. Apenas
uma mudança real de projeto ativo os atualiza. Ao sair, tanto para cima quanto
para baixo, ou ao desmontar o controlador, os valores originais são restaurados.
Apple touch icon, title, canonical e OpenGraph não são modificados.

`theme-color` utiliza a superfície do projeto ativo e volta ao valor original
MAT (`#F7F6F2` neste HTML). A indicação visual na barra/aba depende do navegador;
a validação automatizada comprova DOM e disponibilidade dos assets.

## Cursor, mobile e movimento reduzido

O cursor nativo permanece visível. Em dispositivos com ponteiro preciso, o
rótulo acompanha a posição dentro da mídia, com suavização curta, escala leve
e cores do projeto. Posição limitada às bordas mantém o rótulo legível.

Mobile não usa efeitos de ponteiro nem sticky narrativo. No hero, o scroll
altera opacidade e desloca as camadas por poucos pixels; a imagem real agora
também aparece nessa versão. Temas, favicons e theme-color funcionam normalmente.

Reduced-motion elimina os transforms complexos do hero, parallax e sticky dos
projetos. A composição abstrata fica estável; temas e metadata ainda seguem o
projeto ativo. Trocar a preferência em runtime não elimina o controlador de tema.

## Performance

Nenhuma biblioteca nova. O controlador integra-se ao mesmo requestAnimationFrame
agendado pelo listener passivo de scroll; não há atualização React por frame.
Geometria é lida antes de escrever estilos. O sistema acompanha somente três
cenas; cores estáveis não são reescritas. Favicon/theme-color mudam apenas em
transições de identidade. Cursor usa no máximo uma escrita por frame de ponteiro.

Favicons somam aproximadamente 13,5KB, servidos localmente. As capturas,
responsividade de imagens, lazy loading e pré-renderização anteriores continuam.

Medição local no Chrome headless, no build, desde o carregamento até o scroll
pelos três projetos, com o ponteiro fora dos controles interativos:

| Viewport | Soma das entradas de layout shift sem input recente | Overflow horizontal |
| --- | --- | --- |
| 375 × 812 | 0,000141 | 0px |
| 768 × 1000 | 0,000069 | 0px |
| 1440 × 1000 | 0,000026 | 0px |
| 1920 × 1000 | 0,000014 | 0px |

Os resíduos ocorreram no carregamento da fonte da marca. O teste de regressão
acompanha cada frame da compactação do header e confirma posição do hero estável
(tolerância menor que 0,1px) e scroll solicitado preservado nas quatro larguras.
São medições locais, não dados de campo ou uma nota Lighthouse.

## Vídeo aPublicitária

Não foi criado vídeo nem usado arquivo de teste. A mídia continua sendo o
screenshot real. Caminho reservado para receber uma futura gravação autorizada:
`assets/source/projects/apublicitaria-demo.mp4`.

A integração futura deve gerar um arquivo otimizado em
`public/projects/apublicitaria-demo.mp4` e reutilizar o screenshot como poster,
com preload controlado, muted, playsInline, reprodução ao entrar em foco e pausa
ao sair. O player ainda não foi implementado porque não há vídeo de produção.

## Validação

- Lint, TypeScript e build Vite + pré-renderização: passaram.
- Vitest: 76 testes passaram (incluindo estado ativo/interpolação/estabilidade).
- Playwright: 19 testes passaram; os 12 testes existentes foram preservados.
- 375/768/1440/1920px: hero após 1px de scroll, screenshot real durante a primeira
  dobra, três paletas, restauração nos dois sentidos, ausência de overflow,
  metadados e imagens verificados; capturas inspecionadas visualmente.
- Teste de mutação: zero alterações no favicon ao continuar scroll dentro do
  mesmo projeto; atualização somente nas mudanças de estado ativo.
- Interpolação: três posições de scroll na fronteira produzem três cores distintas.
- Cursor e reduced-motion verificados; contraste automatizado A/AA sem violações
  nas três atmosferas. Isso não constitui auditoria integral de acessibilidade.
- Campanhas, cases, catálogo, contato, referências de projeto, consentimento Ads e
  renderização sem JavaScript continuam cobertos pelos testes anteriores.

Prévia local do build: `http://127.0.0.1:4176/`. Nenhum commit, push ou deploy
foi realizado nesta rodada.
