# Miniatura de compartilhamento MAT

A imagem `public/og-company-v5.jpg` substitui a v4 nos metadados da home,
contato, índice de projetos, cases e privacidade. Tem 1200×630px, aproximadamente
49KB, JPEG sRGB e URL absoluta própria para o novo material.

A composição usa o off-white `#f4f3ef`, grafite `#1b1e22` e azul `#2457c5` da
home, a marca MAT em Orbitron e o título “Tecnologia sob medida.”. O conteúdo
principal fica no quadrado central de 630px para resistir a recortes; detalhes
nas bordas são decorativos. Foram inspecionadas a arte inteira, uma redução para
360×189px e um recorte central de 220×220px.

Fonte editável: `assets/source/og-company-v5.svg`. O wordmark usa os contornos da
Orbitron local, peso 700, com o mesmo espaçamento da marca no site. Os textos da
arte usam Liberation Sans. Para exportar: `node scripts/generate-social-image.mjs`
(ambiente com essa fonte instalada). A imagem final é versionada; o deploy não
precisa gerar fontes ou imagens.

`og:image`, `twitter:image`, dimensões, tipo e texto alternativo ficam no HTML
estático. As campanhas com imagem v3 e o perfil de recrutadores mantêm suas
peças específicas. As versões antigas continuam disponíveis para links já
compartilhados.

A validação pública deve confirmar o HTML e comparar os bytes da imagem com o
arquivo local. Isso não comprova a atualização de previews já armazenados pelo
WhatsApp. O novo endereço da imagem evita reutilizar a URL do arquivo anterior,
mas a plataforma ainda pode conservar o HTML ou o cartão antigo do link.
