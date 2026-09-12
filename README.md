# MATTecnologia

Portfólio de Marcelo Diogo desenvolvido com React, TypeScript, Vite e Tailwind CSS.

## Rodando localmente

Requisitos:

- Node.js `20.19+` ou `22.12+`
- npm

Na raiz do projeto, execute:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente <http://localhost:5173>.

Entradas disponíveis:

- Portfólio comercial: <http://localhost:5173/>
- Página profissional: <http://localhost:5173/recrutadores/>
- Demonstração do componente de assinatura: <http://localhost:5173/demos/assinatura/>

## Conteúdo profissional e demonstração

`src/data/recruiter.ts` centraliza objetivo, experiência, competências e seleção de projetos para a página profissional e o currículo. As frentes de atuação descrevem responsabilidades já documentadas; relatos de entregas e resultados devem ser adicionados apenas quando houver informações reais.

A seleção profissional destaca ZdSignatureInput, Convites e PDV. Os demais projetos continuam acessíveis com seus estudos de caso. A seleção comercial destaca Estoque Desktop, Brutona e Convites, mantendo os demais trabalhos acessíveis.

A demonstração usa o pacote publicado `@marcelodl49/zd-signature-input` 1.0.4 em uma entrada Vue 2/Vuetify/Zeedhi separada. Sua interface e dependências são carregadas apenas ao abrir a demonstração. Desenhos e uploads ficam em memória; essa entrada não inicia PostHog nem grava sessões. O portfólio registra somente o clique para iniciar ou abrir a demonstração, após o consentimento existente.

A troca de cor atualiza o modelo público `instance.penColor` do componente: a versão 1.0.4 não sincroniza alterações nessa prop do Vue. Assim, novos traços usam a cor escolhida sem apagar os anteriores, e o PNG conserva as duas cores.

As versões Vue/Zeedhi estão fixadas por compatibilidade com o componente publicado. O build converte os `require` presentes nos módulos ESM do Zeedhi e compartilha uma única instância de Vue/Vuetify. O pacote legado gera um bundle maior e traz dependências antigas; qualquer atualização deve validar desenho, upload, limpeza e integração antes da publicação.

O `override` de `node-sass` para Dart Sass remove a dependência de compilação nativa obsoleta trazida por `@zeedhi/vue`; a demonstração consome o CSS já publicado pelo componente.

O site funciona sem configurar o EmailJS. Apenas o formulário geral de contato depende dele; o briefing continua oferecendo WhatsApp e `mailto:`.

## Configuração do EmailJS

Edite o arquivo `.env.local` e preencha:

```dotenv
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_OWNER_EMAIL=marcelos.diogo8@gmail.com
VITE_OWNER_WHATSAPP=5531995797235
```

`VITE_EMAILJS_TEMPLATE_ID` é usado pelo formulário de contato.

Depois de alterar variáveis de ambiente, reinicie `npm run dev`.

## Validação e build

```bash
npm run lint
npm run test
npm run resume:pdf
npm run build
npm run preview
```

`npm run resume:pdf` atualiza `public/Marcelo-Diogo-Teixeira-Curriculo.pdf` a partir dos dados de `src/data/recruiter.ts`.

O preview de produção normalmente fica em <http://localhost:4173>.

## Métricas, feedback e gravações

O site usa PostHog somente após consentimento explícito, respeita DNT e permite preferências separadas para métricas/feedback e Session Replay. O SDK não é carregado antes da autorização, e não são criados perfis associados a nome ou e-mail.

Configuração, eventos, proteções de privacidade e checklist de rollout estão em [`docs/analytics.md`](docs/analytics.md).

## Página comercial e briefing

O tema claro usa variáveis em `src/commercial.css`, carregadas apenas nas entradas comercial, de cases e de privacidade. Recrutadores e demonstração mantêm seus próprios estilos.

A seção `#estimativa` reúne um briefing sem preços ou prazos calculados. As respostas ficam em memória e podem ser enviadas por WhatsApp, e-mail ou incluídas no formulário de contato. O formulário mantém a mensagem do visitante separada do resumo e os combina somente ao enviar, preservando os campos `from_name`, `reply_to`, `message` e `site` do template EmailJS.

Links de cases usam `/?projeto=<id>#contato`. A entrada comercial valida e captura a referência antes de inicializar analytics, que limpa os parâmetros da URL. IDs desconhecidos são ignorados. Recarregar a página após a limpeza descarta a referência e o briefing.

A FAQ descreve assuntos a definir na proposta, sem fixar preços, condições de propriedade ou períodos de suporte.
