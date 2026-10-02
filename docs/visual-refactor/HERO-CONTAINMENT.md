# Contenção da mídia do Hero

Em 1920px, a escala e a rotação do screenshot da aPublicitária faziam a mídia
ultrapassar o fim da seção durante o scroll. Telefones de 430px também não tinham
altura suficiente para a imagem 16:9, sua legenda e o deslocamento de entrada.

A correção em `src/art-direction.css` contém a pintura e as sombras no Hero com
`overflow: clip` e isolamento de empilhamento. O screenshot tem largura máxima
de 640px no desktop; no mobile, a área visual reserva altura proporcional à
imagem, incluindo legenda e movimento. A sequência e o conteúdo são preservados.

Validação local antes da publicação: lint, TypeScript/build, 76 testes unitários
e 26 testes de navegador passaram. O teste `hero-containment.spec.ts` percorre
13 posições em cada sentido, em 375×812, 430×932, 768×1000, 1280×720, 1440×900,
1920×1000 e 2560×1440. Confere limites da mídia visível, próxima seção, overflow,
clicabilidade do CTA, navegação para projetos e erros de console.

Os commits distinguem a refatoração previamente aprovada e ainda não versionada
desta correção de contenção. Artefatos de build e testes, configurações locais e
variáveis de ambiente ficam fora do versionamento.
