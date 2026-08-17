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

O site funciona sem configurar o EmailJS. Apenas o formulário geral de contato depende dele; a estimativa continua oferecendo WhatsApp e `mailto:`.

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
