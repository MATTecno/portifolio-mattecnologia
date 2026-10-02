# Assets e proveniência

| Uso | Arquivo fonte | Evidência |
| --- | --- | --- |
| aPublicitária | `assets/source/projects/apublicitaria.webp` | Captura real 1280×720 do projeto local `../aPublicitaria-site`, home executada em Vite em 02/10/2026. Não é mockup ou imagem gerada. |
| Brutona | `assets/source/projects/brutona.webp` | Captura existente no catálogo, preservada. |
| VM Viagens | `assets/source/projects/vm-viagens.webp` | Captura existente no catálogo, preservada. |
| Marcelo | `assets/source/marcelo-profissional.webp` | Fotografia real existente; versão pública responsiva e apresentação em preto e branco por CSS. |
| Marca | Orbitron local + favicon existente | Redução tipográfica MAT, sem substituir a identidade. |

`npm run assets:images` regenera as imagens públicas, incluindo as variantes da
aPublicitária de 480, 800 e 1280 pixels. Os nomes são
`public/projects/apublicitaria-480.webp`, `apublicitaria-800.webp` e
`apublicitaria.webp`.

A aPublicitária ainda não possui vídeo/demo real entre os assets de produção
locais. O único `.webm` localizado era uma fixture de teste; não foi utilizado.
O site MAT utiliza a captura real. Não existe player sem mídia nem download de
vídeo no carregamento. Para uma futura demo, fornecer uma gravação autorizada
em `assets/source/projects/apublicitaria-demo.mp4` e um poster atualizado; será
necessária a integração do player com lazy load, mute, playsInline, pausa por
visibilidade e controle manual. A infraestrutura de imagem já está pronta.

Também não há endereço público confirmado no conteúdo versionado da
aPublicitária. Seu case não apresenta link fictício de “Visitar projeto”.
O próprio projeto de origem sinaliza que as mídias dos trabalhos de Lavínia
estão em preparação. Essa condição está explicitada no case MAT.

Nenhuma foto, screenshot ou logo bloqueia a experiência implementada. Vídeo
é opcional. Não foi localizado um Instagram da MAT no conteúdo existente;
LinkedIn e GitHub foram preservados, e o perfil da aPublicitária não foi
indevidamente apresentado como rede da MAT.
